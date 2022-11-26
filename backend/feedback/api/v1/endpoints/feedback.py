from datetime import datetime
import sys
from fastapi_utils.tasks import repeat_every
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import (GetUserWithRoles, get_current_user, get_db,
                               is_allowed)

get_admin = GetUserWithRoles(["admin"])
get_admin_boss_manager_hr = GetUserWithRoles(["admin", "boss", "manager", "hr"])
router = APIRouter()


@router.post("/", description="Method for button 'Отправить', user_id belongs to receiver")
async def send_feedback(feedback_upd: schemas.FeedbackFromUser,
                        curr_user: models.User = Depends(get_current_user),
                        db: Session = Depends(get_db)):
    # проверки user_exists, user in colleagues
    # либо получать event_id, sender_id, reciver_id и проверять curr_user на sender_id и находить запись самостоятельно

    # либо, что будет проще для меня, запрашивать feedback_id, проверять curr_user с sender_id и находить зап
    # по id feedback
    db_obj = crud.feedback.get(db=db, id=feedback_upd.id)
    if curr_user.id != db_obj.sender_id:
        HTTPException(400, detail="You have no permissions to send this feedback")
    feedback = crud.feedback.update_user_feedback(db=db, db_obj=db_obj, obj_in=feedback_upd)
    return feedback


@router.get("/me", response_model=list[schemas.Feedback], description="Show curr user active and archived feedback ")
async def show_current_user_feedback_list(curr_user: models.User = Depends(get_current_user),
                                          db: Session = Depends(get_db)):
    try:
        events_ids = db.query(models.Event.id).filter(models.Event.status == schemas.EventStatus.active and
                                                      models.Event.status == schemas.EventStatus.archived).all()
        feedbacks = db.query(models.Feedback).filter(models.Feedback.sender_id == curr_user.id and
                                                     models.Feedback.event_id in events_ids).all()
    except Exception as e:
        return repr(e)
    return feedbacks


#Todo не получается пройти проверку с ролью админ, пишет method not allowed
# поэтому пока закомментировал Depends(get_admin_boss_manager_hr)
@router.get("/all", response_model=list[schemas.Feedback])
async def get_all_feedback(
        db: Session = Depends(get_db),
        # _: models.User = Depends(get_admin_boss_manager_hr),
        _:models.User = Depends(get_admin),
        skip: int = 0,
        limit: int = 100,
) -> list[schemas.Feedback]:
    return parse_obj_as(
        list[schemas.Feedback], crud.feedback.get_multi(db, skip=skip, limit=limit)
    )


async def is_allowed_to_send_feedback(
        db: Session, curr_user: models.User, event: models.Event
) -> bool:
    event_user = crud.user.get(db, event.user_id)
    event_user_roles = [r.description for r in event_user.roles]

    # Boss, Manager, Admin can send feedback to anyone
    if is_allowed(curr_user, None, ["admin", "boss", "manager"]):
        return True

    # Only boss, manager, admin can send feedback to user with trainee role
    if "trainee" in event_user_roles and is_allowed(
            curr_user, None, ["admin", "boss", "manager"]
    ):
        return True
    elif "trainee" in event_user_roles:
        return False

    # Only colleagues can send feedback
    user_colleagues_ids = [c.colleague_id for c in curr_user.colleagues]
    if event.user_id not in user_colleagues_ids:
        return False
    return True


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



# @router.get("/sender/active/{user_id}", description="User method.Only active events. Optional method")
# async def show_sender_active_feedback_list_by_user_id(user_id: int, db: Session = Depends(get_db)):
#     user = crud.user.get(db=db, id=user_id)
#     # показываем только сообщения активные и архивные (возможно только активные будем оставлять)
#
#     events = db.query(models.Event).filter(models.Event.status == schemas.EventStatus.active).all()
#     feedbacks = db.query(models.Feedback).filter(models.Feedback.sender_id == user.id,
#                                                  models.Feedback.event_id in events).all()
#     # прочитать в нотпаде
#     return feedbacks
#
#
# @router.get("/sender/archieved/{user_id}", description="User method. Only archived events. Optional method")
# async def show_sender_archived_feedback_list_by_user_id(user_id: int, db: Session = Depends(get_db)):
#     user = crud.user.get(db=db, id=user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail=f"No user with such id - {user_id}")
#     # показываем только сообщения активные и архивные (возможно только активные будем оставлять)
#
#     events = db.query(models.Event).filter(models.Event.status == schemas.EventStatus.archived).all()
#     feedbacks = db.query(models.Feedback).filter(models.Feedback.sender_id == user.id,
#                                                  models.Feedback.event_id in events).all()
#
#     return feedbacks

@router.get("/table/{user_id}", description="Admin method to show him table of feedbacks about user")
async def show_receiver_active_feedback_list_by_user_id(user_id: int, db: Session = Depends(get_db)):
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"No user with such id - {user_id}")

    events = db.query(models.Event).filter(models.Event.status == schemas.EventStatus.active).all()
    feedbacks = db.query(models.Feedback).filter(models.Feedback.receiver_id == user.id,
                                                 models.Feedback.event_id in events).all()
    return feedbacks

@router.get("/archieve/{user_id}", description="Admin method to show him archived feedbacks about user")
async def show_receiver_active_feedback_list_by_user_id(user_id: int, db: Session = Depends(get_db)):
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"No user with such id - {user_id}")

    events = db.query(models.Event).filter(models.Event.status == schemas.EventStatus.archived).all()
    feedbacks = db.query(models.Feedback).filter(models.Feedback.receiver_id == user.id,
                                                 models.Feedback.event_id in events).all()
    return feedbacks

@router.post("/create_oneway/{user_id}",
             description="Creates task only for colleagues of specific user")  # response_model=list[schemas.Feedback]
async def create_oneway_feedback_task(user_id: int,
                                      event_create: schemas.EventCreate,
                                      db: Session = Depends(get_db)):
    # check user_exist method
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"No user with such id - {user_id}")

    ###create_event crud method #подумать, какой статус добавить
    event = crud.event.create(db=db, obj_in=event_create)

    # для каждого коллеги создать задание по текущему пользователю
    feedback_to_add = []
    for colleague in user.colleagues:
        ###create_feedback_oneway crud method
        obj_in = schemas.FeedbackCreateEmpty(event_id=event.id,
                                             sender_id=colleague.colleague_id,
                                             receiver_id=user.id)

        feed = crud.feedback.create_empty(db=db, obj_in=obj_in)
        feedback_to_add.append(feed)

    # Todo из-за ошибки возвращается только последний созданный feedback из всего списка, нужно понять в чем проблема.
    return feedback_to_add


# Todo возвращать список целиком
@router.post('/all', description="Creates task for all users")
async def create_feedback_task_for_all(event_create: schemas.EventCreate,
                                       db: Session = Depends(get_db)):
    event = crud.event.create(db=db, obj_in=event_create)
    users = crud.user.get_multi(db=db)
    for user in users:
        for colleagues in user.colleagues:
            obj_in = schemas.FeedbackCreateEmpty(
                event_id=event.id,
                sender_id=colleagues.colleague_id,
                receiver_id=user.id)
            feed = crud.feedback.create_empty(db=db, obj_in=obj_in)

    return Response(status_code=200)


@router.post("/create_twoway/{user_id}", description="Creates task for user and his colleagues")
async def create_twoway_feedback_task(user_id: int, event_create: schemas.EventCreate, db: Session = Depends(get_db)):
    event = crud.event.create(db=db, obj_in=event_create)
    user = crud.user.get(db=db, id=user_id)
    for colleague in user.colleagues:
        obj_in_user = schemas.FeedbackCreateEmpty(event_id=event.id,
                                                  sender_id=user.id,
                                                  receiver_id=colleague.colleague_id)

        obj_in_colleague = schemas.FeedbackCreateEmpty(event_id=event.id,
                                                       sender_id=colleague.colleague_id,
                                                       receiver_id=user.id)
        crud.feedback.create_empty(db=db, obj_in=obj_in_user)
        crud.feedback.create_empty(db=db, obj_in=obj_in_colleague)

    #Todo возвращать список
    return Response(status_code=200)


@router.delete("/")
async def test_method_delete_all_feedback(db: Session = Depends(get_db)):
    obj = crud.feedback.remove_all(db=db)
    return Response(headers={"num of rows deleted": obj}, status_code=200)


from feedback.db.session import engine
from fastapi.encoders import jsonable_encoder


@router.on_event("startup")
@repeat_every(seconds=3600)
async def sheduled_update_event_status():
    try:
        db = Session(engine)
        def update_event_status(db: Session):
            events = db.query(models.Event).filter(models.Event.status == "waiting")

            events_to_add = []
            time = datetime.datetime.now()
            for event in jsonable_encoder(events):
                if event.date_start <= time < event.date_end:
                    event.status = "active"
                    events_to_add.append(event)
            db.add(events_to_add)
            db.commit()
            db.refresh(events_to_add)
            return events_to_add

        ev = update_event_status(db)

    except Exception as e:
        #Todo log exception and send notifications to telegram bot
        sys.stdout.write(str(e))
        sys.stdout.flush()

