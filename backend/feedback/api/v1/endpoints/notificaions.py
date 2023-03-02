from fastapi import (
    APIRouter,
    BackgroundTasks,
    Body,
    Depends,
    HTTPException,
    Query,
    Response,
    status,
)
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import get_current_user, get_db

router = APIRouter()


@router.get("/me", response_model=list[schemas.Notification])
def get_notifications_for_current_user(
    curr_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    return crud.notification.get_by_user_id(db, user_id=curr_user.id)


@router.get("/{notification_id}/seen")
def update_to_has_seen(
    notification_id: int,
    curr_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Dont use
    """
    notification = crud.notification.get(db, id=notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found"
        )
    crud.notification.change_to_seen(db, notification)
    return "Ok"
