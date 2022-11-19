from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import (GetUserWithRoles, get_current_user, get_db,
                               is_allowed)

get_admin = GetUserWithRoles(["admin"])
get_admin_boss_manager_hr = GetUserWithRoles(["admin", "boss", "manager", "hr"])
router = APIRouter()


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


@router.post("/", response_model=schemas.Feedback)
async def create_feedback(
    feedback_create: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
) -> schemas.Event:
    event = crud.event.get(db, feedback_create.event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if not event.status == "active":
        raise HTTPException(status_code=400, detail="You can not send feedback here")

    # Check if user can send feedback in this event
    if not is_allowed_to_send_feedback(db, curr_user, event):
        raise HTTPException(
            status_code=401, detail="You can not send feedback to this user"
        )

    # Check if user already has sent feedback to this event
    feedback = crud.feedback.get_by_user_and_event(db, curr_user.id, event.id)
    if feedback:
        raise HTTPException(status_code=404, detail="You have already sent feedback")

    # Check if date between Event start and stop date
    if not (event.date_start < datetime.now(timezone.utc) < event.date_stop):
        raise HTTPException(
            status_code=400,
            detail="You can not send feedback here. Time limit has expired",
        )

    feedback = crud.feedback.create(
        db, obj_in=feedback_create, owner_id=curr_user.id, intendend_for=event.user_id
    )
    return feedback


@router.get("/{id}", response_model=schemas.Feedback)
async def get_feedback_by_id(
    id: int,
    db: Session = Depends(get_admin_boss_manager_hr),
    _: models.User = Depends(get_admin),
) -> schemas.Feedback:
    feedback = crud.feedback.get(db, id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback does not exist")
    return feedback


# Not in place
@router.get("/user/{user_id}")
async def get_feedback_by_user_id(
    user_id: int,
    status: Literal["active", "archived", "finished"] | None = None,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin_boss_manager_hr),
):
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    events_and_feedback = crud.event.get_by_user_id(db, user_id, status=status)
    for i, e in enumerate(events_and_feedback):
        events_and_feedback[i].users_feedback = e.users_feedback

    return events_and_feedback


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
