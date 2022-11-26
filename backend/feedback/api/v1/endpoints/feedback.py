import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi_utils.tasks import repeat_every
from pydantic import parse_obj_as
from sqlalchemy import or_
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import (GetUserWithRoles, get_current_user, get_db,
                               is_allowed)

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s;%(levelname)s;%(message)s")
logger = logging.getLogger(__name__)

get_admin = GetUserWithRoles(["admin"])
get_admin_boss_manager_hr = GetUserWithRoles(["admin", "boss", "manager", "hr"])
router = APIRouter()


@router.post(
    "/{feedback_id}",
    response_model=schemas.Feedback,
    description="Method for button 'Отправить', user_id belongs to receiver",
)
async def send_feedback(
    feedback_id: int,
    feedback_upd: schemas.FeedbackFromUser,
    curr_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> schemas.Feedback:
    feedback = crud.feedback.get(db=db, id=feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback does not exist")

    event = crud.event.get(db, feedback.event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event does not exist")

    if not (event.date_start <= datetime.utcnow() < event.date_stop):
        raise HTTPException(status_code=410, detail="Event status is not active")

    allow = await is_allowed_to_send_feedback(db, curr_user, feedback)
    # Если у пользователя одна из ролей (Админ, руковод., менеджер) то вероятно что для него не создан фидбэк
    # мы проверяем что если этот фидбэк создан для него то просто обновляем значения
    # а если не для него то создаем новый фидбэк
    if allow == "privilege":
        _feedback = crud.feedback.get_by_event_id_and_user_id(
            db, feedback.event_id, curr_user.id
        )
        if not _feedback:
            return crud.feedback.create(
                db,
                obj_in=feedback_upd,
                sender_id=curr_user.id,
                receiver_id=feedback.receiver_id,
                event_id=feedback.event_id,
            )
        return crud.feedback.update_user_feedback(
            db=db, db_obj=_feedback, obj_in=feedback_upd
        )

    if not allow:
        raise HTTPException(
            status_code=403, detail="You can not send feedback to this user"
        )

    if not curr_user.id == feedback.sender_id:
        raise HTTPException(
            status_code=403, detail="You can not send feedback with this id"
        )

    feedback = crud.feedback.update_user_feedback(
        db=db, db_obj=feedback, obj_in=feedback_upd
    )
    return feedback


@router.get("/", response_model=list[schemas.Feedback])
async def get_all_feedback(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager_hr),
    skip: int = 0,
    limit: int = 100,
) -> list[schemas.Feedback]:
    return parse_obj_as(
        list[schemas.Feedback], crud.feedback.get_multi(db, skip=skip, limit=limit)
    )


@router.get(
    "/me",
    response_model=list[schemas.Feedback],
    description="Show curr user active and archived feedback",
)
async def show_current_user_feedback_list(
    curr_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[schemas.Feedback]:

    events_ids = []
    for val in (
        db.query(models.Event.id)
        .filter(
            or_(
                models.Event.status == schemas.EventStatus.active,
                models.Event.status == schemas.EventStatus.archived,
            )
        )
        .distinct()
    ):
        events_ids.append(val[0])

    feedbacks_q = db.query(models.Feedback).filter(
        models.Feedback.event_id.in_(events_ids)
    )

    if is_allowed(curr_user, None, ["admin", "boss", "manager"]):
        # Todo Admin boss and manager should see every feedback
        # Сейчас для этих ролей показывает только если для них создан feedback
        # Те надо как то убрать повторяющиеся записи, что бы receiver_id были разные (или сделать как то подругому)
        feedbacks_q = feedbacks_q.filter(models.Feedback.sender_id == curr_user.id)
    else:
        feedbacks_q = feedbacks_q.filter(models.Feedback.sender_id == curr_user.id)

    return parse_obj_as(list[schemas.Feedback], feedbacks_q.all())


@router.get("/{id}", response_model=schemas.Feedback)
async def get_feedback_by_id(
    id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager_hr),
) -> schemas.Feedback:
    feedback = crud.feedback.get(db, id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback does not exist")
    return feedback


@router.delete("/{id}")
async def delete_feedback(
    id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin),
):
    feedback = crud.feedback.get(db, id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback does not exist")
    crud.feedback.remove(db, id=id)
    return Response(status_code=204)


async def is_allowed_to_send_feedback(
    db: Session, curr_user: models.User, feedback: models.Feedback
) -> str | bool:
    receiver = crud.user.get(db, feedback.receiver_id)
    if not receiver:
        raise HTTPException(status_code=404, detail="feedback receiver does not exist")
    receiver_roles = [r.description for r in receiver.roles]

    # Boss, Manager, Admin can send feedback to anyone
    if is_allowed(curr_user, None, ["admin", "boss", "manager"]):
        logger.debug("sender roles is admin or boss or manager")
        return "privilege"

    if "trainee" in receiver_roles:
        logger.debug("receiver role is trainee and sender not admin or boss or manager")
        return False

    return True


@router.get(
    "/table/{user_id}",
    description="Admin method to show him table of feedbacks about user",
)
async def show_receiver_active_feedback_list_by_user_id(
    user_id: int, db: Session = Depends(get_admin_boss_manager_hr)
):
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")

    events = (
        db.query(models.Event)
        .filter(models.Event.status == schemas.EventStatus.active)
        .all()
    )
    feedbacks = (
        db.query(models.Feedback)
        .filter(
            models.Feedback.receiver_id == user.id, models.Feedback.event_id in events
        )
        .all()
    )
    return feedbacks


@router.get(
    "/archive/{user_id}",
    description="Admin method to show him archived feedbacks about user",
)
async def show_receiver_archive_feedback_list_by_user_id(
    user_id: int, db: Session = Depends(get_admin_boss_manager_hr)
):
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")

    events = (
        db.query(models.Event)
        .filter(models.Event.status == schemas.EventStatus.archived)
        .all()
    )
    feedbacks = (
        db.query(models.Feedback)
        .filter(
            models.Feedback.receiver_id == user.id, models.Feedback.event_id in events
        )
        .all()
    )
    return feedbacks


@router.delete("/")
async def test_method_delete_all_feedback(db: Session = Depends(get_db)):
    obj = crud.feedback.remove_all(db=db)
    logger.debug(f"Num of rows deleted: {obj}")
    return Response(status_code=200)


from feedback.db.session import engine


@router.on_event("startup")
@repeat_every(seconds=3600)
async def sheduled_update_event_status():
    try:
        db = Session(engine)

        def update_event_status_to_active(db: Session):
            events = db.query(models.Event).filter(
                models.Event.status == schemas.EventStatus.waiting
            )

            events_to_add = []
            time = datetime.utcnow()
            for event in events:
                logger.debug(
                    f"[Scheduler] checking {event.date_start} <= {time} < {event.date_stop}"
                )
                if event.date_start <= time < event.date_stop:
                    logger.debug(f"Updating event: {event.id} status to: Active")
                    event = crud.event.update_status(
                        db, db_obj=event, status=schemas.EventStatus.active
                    )
                    events_to_add.append(event)
            return events_to_add

        def update_event_status_to_archived(db: Session):
            events = db.query(models.Event).filter(
                models.Event.status == schemas.EventStatus.active
            )

            events_to_add = []
            time = datetime.utcnow()
            for event in events:
                logger.debug(f"[Scheduler] checking  {time} > {event.date_stop}")
                if time > event.date_stop:
                    logger.debug(f"Updating event: {event.id} status to: Archived")
                    event = crud.event.update_status(
                        db, db_obj=event, status=schemas.EventStatus.archived
                    )
                    events_to_add.append(event)
            return events_to_add

        update_event_status_to_active(db)
        update_event_status_to_archived(db)

    except Exception as e:
        logger.debug(f"Error sheduled update event status: {e}")
