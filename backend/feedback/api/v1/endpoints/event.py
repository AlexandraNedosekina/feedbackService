from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import (GetUserWithRoles, get_current_user, get_db,
                               is_allowed)

get_admin = GetUserWithRoles(["admin"])
get_admin_boss_manager = GetUserWithRoles(["admin", "boss", "manager"])
router = APIRouter()


@router.get("/me", response_model=list[schemas.Event])
async def get_events_for_current_user(
    curr_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[schemas.Event]:
    if is_allowed(curr_user, None, ["admin", "boss", "manager"]):
        events = crud.event.get_events_for_priviliged_role(db, curr_user)
    else:
        events = crud.event.get_events_for_user(db, curr_user)
    return parse_obj_as(list[schemas.Event], events)


@router.get("/", response_model=list[schemas.Event])
async def get_all_events(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
    q: Literal["active", "archived", "finished"] | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[schemas.Event]:
    # redo with dynamic filter
    if not q:
        return parse_obj_as(
            list[schemas.Event], crud.event.get_multi(db, skip=skip, limit=limit)
        )
    return parse_obj_as(
        list[schemas.Event],
        crud.event.get_with_status(db, skip=skip, limit=limit, status=q),
    )


@router.post("/", response_model=schemas.Event)
async def create_event(
    event_create: schemas.EventCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager),
) -> schemas.Event:
    prev_event = crud.event.get_prev_event_for_user(db, event_create.user_id)
    if prev_event:
        crud.event.update_status(db, db_obj=prev_event, status="archived")
    return crud.event.create(db, obj_in=event_create)


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

    # Check if only 1 param is passed: if conflicts with db values
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
