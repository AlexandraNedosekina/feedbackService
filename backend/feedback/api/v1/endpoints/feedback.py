from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import (GetUserWithRoles, get_current_user, get_db,
                               is_allowed)

# Change roles according to TZ
get_admin = GetUserWithRoles(["admin"])
router = APIRouter()


@router.get("/", response_model=list[schemas.Feedback])
async def get_all_feedback(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> list[schemas.Feedback]:
    return parse_obj_as(
        list[schemas.Feedback], crud.feedback.get_multi(db, skip=skip, limit=limit)
    )


# Change
@router.post("/event/{event_id}", response_model=schemas.Feedback)
async def create_feedback(
    event_id: int,
    feedback_create: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
) -> schemas.Event:
    event = crud.event.get(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if user can send feedback in this event
    user_colleagues_ids = [c.colleague_id for c in curr_user.colleagues]
    if event.user_id not in user_colleagues_ids:
        raise HTTPException(
            status_code=401, detail="You can not send feedback to this user"
        )

    # Check if user already has sent feedback to this event
    feedback = crud.feedback.get_by_user_and_event(db, curr_user.id, event.id)
    if feedback:
        raise HTTPException(status_code=404, detail="You have already sent feedback")

    feedback = crud.feedback.create(
        db, obj_in=feedback_create, owner_id=curr_user.id, intendend_for=event.user_id
    )
    return feedback


@router.get("/{id}", response_model=schemas.Feedback)
async def get_feedback_by_id(
    id: int, db: Session = Depends(get_db), _: models.User = Depends(get_admin)
) -> schemas.Feedback:
    # !!! Check permissions ??? or not
    feedback = crud.feedback.get(db, id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback does not exist")
    return feedback


@router.patch("/{id}", response_model=schemas.Feedback)
async def update_feedback(
    id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_user)
) -> schemas.Event:
    raise HTTPException(status_code=404, detail="Not implemented")


# check roles
@router.delete("/{id}")
async def delete_event(
    id: int,
    response: Response,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin),
):
    feedback = crud.feedback.get(db, id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback does not exist")
    crud.feedback.remove(db, id=id)
    response.status_code = 200
    return response
