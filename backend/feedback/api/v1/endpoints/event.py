from logging import getLogger

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db

get_admin = GetUserWithRoles(["admin"])
get_admin_boss_manager = GetUserWithRoles(["admin", "boss", "manager"])
router = APIRouter()
log = getLogger(__name__)


# Change permissions
@router.get("/", response_model=list[schemas.Event])
async def get_all_events(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> list[schemas.Event]:
    return parse_obj_as(
        list[schemas.Event], crud.event.get_multi(db, skip=skip, limit=limit)
    )


@router.post(
    "/all",
    response_model=schemas.Event,
    description="Создать cбор обратной связи для всех пользователей",
)
async def create_event_for_all(
    event_create: schemas.EventCreateForAllForm,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    event = crud.event.create(db=db, obj_in=schemas.EventCreate(**event_create.dict()))
    users = crud.user.get_multi(db=db, skip=0, limit=10000)

    objs_in = set()
    for user in users:
        for colleagues in user.colleagues:
            obj_in = schemas.FeedbackCreateEmpty(
                event_id=event.id,
                sender_id=colleagues.colleague_id,
                receiver_id=user.id,
            )
            objs_in.add(obj_in)
    crud.feedback.create_empty_bulk(db, objs_in=objs_in)
    log.debug(f"Created {len(objs_in)}")
    log.debug(f"{objs_in=}")
    return event


@router.post(
    "/create_oneway",
    response_model=schemas.Event,
    description="Создать сбор обратной связи по пользователям",
)
async def create_oneway_event(
    event_create: schemas.EventCreateForm,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    users = []
    for user_id in event_create.user_ids:
        user = crud.user.get(db=db, id=user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User does not exist")
        users.append(user)
    event = crud.event.create(db=db, obj_in=schemas.EventCreate(**event_create.dict()))

    objs_in = set()
    for user in users:
        for colleague in user.colleagues:
            obj_in = schemas.FeedbackCreateEmpty(
                event_id=event.id, sender_id=colleague.colleague_id, receiver_id=user.id
            )
            objs_in.add(obj_in)

    crud.feedback.create_empty_bulk(db, objs_in=objs_in)
    log.debug(f"Created {len(objs_in)}")
    log.debug(f"{objs_in=}")
    return event


@router.post(
    "/create_twoway",
    response_model=schemas.Event,
    description="Создать сбор обратной связи для пользовотелей и их коллег",
)
async def create_twoway_event(
    event_create: schemas.EventCreateForm,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    users = []
    for user_id in event_create.user_ids:
        user = crud.user.get(db=db, id=user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User does not exist")
        users.append(user)
    event = crud.event.create(db=db, obj_in=schemas.EventCreate(**event_create.dict()))

    objs_in = set()
    for user in users:
        for colleague in user.colleagues:
            obj_in_user = schemas.FeedbackCreateEmpty(
                event_id=event.id, sender_id=user.id, receiver_id=colleague.colleague_id
            )
            obj_in_colleague = schemas.FeedbackCreateEmpty(
                event_id=event.id, sender_id=colleague.colleague_id, receiver_id=user.id
            )
            objs_in.add(obj_in_user)
            objs_in.add(obj_in_colleague)
    crud.feedback.create_empty_bulk(db, objs_in=objs_in)
    log.debug(f"Created {len(objs_in)}")
    log.debug(f"{objs_in=}")
    return event


@router.get("/{id}", response_model=schemas.Event)
async def get_event_by_id(
    id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
) -> schemas.Event:
    event = crud.event.get(db, id)
    if not event:
        raise HTTPException(status_code=404, detail="Event does not exist")
    return event


@router.patch("/{id}", response_model=schemas.Event)
async def update_event(
    id: int,
    event_update: schemas.EventUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
) -> schemas.Event:
    event = crud.event.get(db, id)
    if not event:
        raise HTTPException(status_code=404, detail="Event does not exist")

    # If only 1 of the dates is changed. check with val in db
    start = event_update.date_start
    end = event_update.date_stop
    if bool(start) != bool(end):
        if (start and event.date_stop <= start.replace(tzinfo=None)) or (
            end and event.date_start >= end.replace(tzinfo=None)
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="date_start cant cant be smaller or equal to date_end",
            )

    return crud.event.update(db, db_obj=event, obj_in=event_update)


@router.delete("/{id}")
async def delete_event(
    id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    event = crud.event.get(db, id)
    if not event:
        raise HTTPException(status_code=404, detail="Event does not exist")
    crud.event.remove(db, id=id)
    return Response(status_code=204)
