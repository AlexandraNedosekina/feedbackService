from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db

get_admin = GetUserWithRoles(["admin"])
get_admin_boss_manager = GetUserWithRoles(["admin", "boss", "manager"])
router = APIRouter()


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


@router.post(
    "/all",
    response_model=schemas.Event,
    description="Создать сбор обратной связи для всех пользователей",
)
async def create_event_for_all(
    event_create: schemas.EventCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    event = crud.event.create(db=db, obj_in=event_create)
    users = crud.user.get_multi(db=db, skip=0, limit=10000)
    for user in users:
        for colleagues in user.colleagues:
            obj_in = schemas.FeedbackCreateEmpty(
                event_id=event.id,
                sender_id=colleagues.colleague_id,
                receiver_id=user.id,
            )
            _ = crud.feedback.create_empty(db=db, obj_in=obj_in)

    return event


@router.post(
    "/create_oneway/{user_id}",
    response_model=schemas.Event,
    description="Создать сбор обратной связи по пользователю",
)
async def create_oneway_event(
    user_id: int,
    event_create: schemas.EventCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")
    event = crud.event.create(db=db, obj_in=event_create)

    for colleague in user.colleagues:
        obj_in = schemas.FeedbackCreateEmpty(
            event_id=event.id, sender_id=colleague.colleague_id, receiver_id=user.id
        )
        _ = crud.feedback.create_empty(db=db, obj_in=obj_in)

    return event


@router.post(
    "/create_twoway/{user_id}",
    response_model=schemas.Event,
    description="Создать сбор обратной связи для пользовотеля и его коллег",
)
async def create_twoway_event(
    user_id: int,
    event_create: schemas.EventCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
):
    user = crud.user.get(db=db, id=user_id)
    if not user:
        raise HTTPException(404, detail="User not found")
    event = crud.event.create(db=db, obj_in=event_create)

    for colleague in user.colleagues:
        obj_in_user = schemas.FeedbackCreateEmpty(
            event_id=event.id, sender_id=user.id, receiver_id=colleague.colleague_id
        )
        obj_in_colleague = schemas.FeedbackCreateEmpty(
            event_id=event.id, sender_id=colleague.colleague_id, receiver_id=user.id
        )
        _ = crud.feedback.create_empty(db=db, obj_in=obj_in_user)
        _ = crud.feedback.create_empty(db=db, obj_in=obj_in_colleague)

    return event
