import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi_utils.tasks import repeat_every
from pydantic import parse_obj_as
from sqlalchemy import or_
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db, is_allowed

logger = logging.getLogger(__name__)

get_admin = GetUserWithRoles(["admin"])
get_admin_boss_manager_hr = GetUserWithRoles(["admin", "boss", "manager", "hr"])
get_admin_boss_manager = GetUserWithRoles(["admin", "boss", "manager"])
router = APIRouter()


@router.post("/send-out-of-turn", response_model=schemas.Feedback)
async def send_feedback_out_of_turn(
    user_id: int,
    user_feedback: schemas.FeedbackFromUser,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_admin_boss_manager),
):
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")

    user_roles = [r.description for r in user.roles]
    can_send_feedback = True

    for el in ("manager", "hr", "boss", "admin"):
        if el in user_roles:
            can_send_feedback = False
            break

    if not can_send_feedback:
        raise HTTPException(
            status_code=403, detail="You can not send feedback to user with that role"
        )

    curr_utc_datetime = datetime.now(tz=timezone.utc) + timedelta(seconds=2)
    new_event_params = schemas.EventCreate(
        date_start=curr_utc_datetime, date_stop=curr_utc_datetime + timedelta(seconds=4)
    )
    new_event = crud.event.create(db, obj_in=new_event_params)

    new_feedback = crud.feedback.create(
        db,
        obj_in=user_feedback,
        sender_id=curr_user.id,
        receiver_id=user.id,
        event_id=new_event.id,
    )
    _ = crud.event.update_status(
        db, db_obj=new_event, status=schemas.EventStatus.archived
    )
    return new_feedback


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
        _feedback = crud.feedback.get_by_event_sender_and_receiver(
            db, feedback.event_id, curr_user.id, feedback.receiver_id
        )
        if _feedback:
            return crud.feedback.update_user_feedback(
                db=db, db_obj=_feedback, obj_in=feedback_upd
            )

        if feedback.receiver_id == curr_user.id:
            raise HTTPException(
                status_code=400, detail="You can not send feedback to yourself"
            )
        return crud.feedback.create(
            db,
            obj_in=feedback_upd,
            sender_id=curr_user.id,
            receiver_id=feedback.receiver_id,
            event_id=feedback.event_id,
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
    events_ids = set()
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
        events_ids.add(val[0])

    feedbacks_q = db.query(models.Feedback).filter(
        models.Feedback.event_id.in_(events_ids)
    )

    feedbacks = feedbacks_q.filter(models.Feedback.sender_id == curr_user.id).all()
    return parse_obj_as(list[schemas.Feedback], feedbacks)


@router.get("/{id}", response_model=schemas.Feedback)
async def get_feedback_by_id(
    id: int,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
) -> schemas.Feedback:
    feedback = crud.feedback.get(db, id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback does not exist")
    if not is_allowed(
        curr_user, feedback.sender_id, ["admin", "boss", "manager", "HR", "self"]
    ):
        raise HTTPException(status_code=401, detail="Not enough permissions")
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
        return "privilege"

    if "trainee" in receiver_roles:
        return False
    return True


@router.get(
    "/table/{user_id}",
    response_model=list[schemas.Feedback],
    description="Admin method to show him table of feedbacks about user",
)
async def show_receiver_active_feedback_list_by_user_id(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager_hr),
):
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")

    events_ids = set()
    for val in (
        db.query(models.Event.id)
        .filter(models.Event.status == schemas.EventStatus.active)
        .distinct()
    ):
        events_ids.add(val[0])

    feedbacks = (
        db.query(models.Feedback)
        .filter(
            models.Feedback.receiver_id == user.id,
            models.Feedback.event_id.in_(events_ids),
        )
        .all()
    )
    return parse_obj_as(list[schemas.Feedback], feedbacks)


@router.get(
    "/archive/{user_id}",
    response_model=list[schemas.Feedback],
    description="Admin method to show him archived feedbacks about user",
)
async def show_receiver_archive_feedback_list_by_user_id(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager_hr),
):
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")

    events_ids = set()
    for val in (
        db.query(models.Event.id)
        .filter(models.Event.status == schemas.EventStatus.archived)
        .distinct()
    ):
        events_ids.add(val[0])

    feedbacks = (
        db.query(models.Feedback)
        .filter(
            models.Feedback.receiver_id == user.id,
            models.Feedback.event_id.in_(events_ids),
        )
        .all()
    )
    return parse_obj_as(list[schemas.Feedback], feedbacks)


@router.get("/stats/{user_id}")
async def get_user_rating(
    user_id: int,
    event_id: int | None = None,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager_hr),
) -> schemas.FeedbackStat:
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")

    if event_id:
        event = crud.event.get(db, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Event does not exist")

    return crud.feedback.get_user_avg_ratings(db, user=user, event_id=event_id)


@router.delete("/")
async def test_method_delete_all_feedback(db: Session = Depends(get_db)):
    _ = crud.feedback.remove_all(db=db)
    return Response(status_code=200)


from feedback.db.session import engine


@router.get("/event/{event_id}", response_model=list[schemas.Feedback])
async def get_feedback_by_envent_id(
    event_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager_hr),
):
    event = crud.event.get(db=db, id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event does not exist")
    feedbacks = crud.feedback.get_by_event_id(db=db, event_id=event_id)
    return parse_obj_as(list[schemas.Feedback], feedbacks)


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
                    f"[Scheduler (Active)] checking {event.date_start} <= {time} < {event.date_stop}"
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
                models.Event.status != schemas.EventStatus.archived
            )

            events_to_add = []
            time = datetime.utcnow()
            for event in events:
                logger.debug(
                    f"[Scheduler (Archived)] checking  {time} > {event.date_stop}"
                )
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
