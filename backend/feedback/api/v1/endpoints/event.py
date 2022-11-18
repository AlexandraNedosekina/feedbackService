from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import (GetUserWithRoles, get_current_user, get_db,
                               is_allowed)

# Change roles according to TZ
get_admin = GetUserWithRoles(["admin"])
router = APIRouter()


@router.get("/me")
async def get_events_for_current_user(
    user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[schemas.Event]:
    events = crud.event.get_events_for_user(db, user)
    return parse_obj_as(list[schemas.Event], events)


@router.get("/")
async def get_all_events(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
    q: Literal["active", "archived", "finished"] | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[schemas.Event]:

    # !!! Check user permissions
    if not q:
        return parse_obj_as(
            list[schemas.Event], crud.event.get_multi(db, skip=skip, limit=limit)
        )
    return parse_obj_as(
        list[schemas.Event],
        crud.event.get_with_status(db, skip=skip, limit=limit, status=q),
    )


@router.post("/")
async def create_event(
    event_create: schemas.EventCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
) -> schemas.Event:
    # !!! Check user permissions
    # !!! Check event statr stop date
    return crud.event.create(db, obj_in=event_create)


@router.get("/{id}")
async def get_event_by_id(
    id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
) -> schemas.Event:
    # !!! Check permissions ??? or not
    event = crud.event.get(db, id)
    if not event:
        raise HTTPException(status_code=404, detail="Event does not exist")
    return event


# TODO
@router.patch("/{id}")
async def update_event(
    id: int,
    event_update: schemas.EventUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
) -> schemas.Event:
    # !!! Check permissions
    event = crud.event.get(db, id)
    if not event:
        raise HTTPException(status_code=404, detail="Event does not exist")

    # Check event start and stop date makes sense
    # stop < start
    # ...
    # Check if only start, then it can not be after stop in db
    # Check if only stop, then it can not be earlier than start in db

    return crud.event.update(db, db_obj=event, obj_in=event_update)


# check roles
@router.delete("/{id}")
async def delete_event(
    id: int,
    response: Response,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin),
):
    event = crud.event.get(db, id)
    if not event:
        raise HTTPException(status_code=404, detail="Event does not exist")
    crud.event.remove(db, id=id)
    response.status_code = 200
    return response
