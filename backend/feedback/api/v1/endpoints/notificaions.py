from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from feedback import crud, schemas
from feedback.api.deps import get_current_user, get_db

router = APIRouter()


@router.get("/me", response_model=list[schemas.Notification])
def get_notifications_for_current_user(
    curr_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    Returns only unread notifications
    """
    last_read = curr_user.last_notifications_read or datetime(
        1900, 1, 1, tzinfo=timezone.utc
    )
    crud.user.update(
        db,
        db_obj=curr_user,
        obj_in={"last_notifications_read": datetime.now(timezone.utc)},
    )
    return crud.notification.get_new_by_last_read(
        db, user_id=curr_user.id, last_read=last_read
    )
