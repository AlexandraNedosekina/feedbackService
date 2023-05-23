from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db

get_admin = GetUserWithRoles(["admin"])
router = APIRouter()


@router.get("/{feedback_id}", response_model=list[schemas.FeedbackHistory])
async def get_history_for_feedback(
    feedback_id: int,
    curr_user: models.User = Depends(get_current_user),
    db=Depends(get_db),
) -> list[schemas.FeedbackHistory]:
    feedback = crud.feedback.get(db, id)
    if not feedback:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Feedback not found")

    if curr_user.id != feedback.sender_id or "admin" not in curr_user.get_roles:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    return crud.feedback_history.get_by_feedback_id(db, feedback_id=feedback_id)
