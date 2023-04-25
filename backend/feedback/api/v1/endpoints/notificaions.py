from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import get_current_user, get_db

router = APIRouter()


@router.get("/me", response_model=schemas.PaginatedResponse[schemas.Notification])
async def get_notifications_for_current_user(
    skip: int = 0,
    limit: int = 100,
    curr_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    crud.user.update(
        db,
        db_obj=curr_user,
        obj_in={"last_notifications_read": datetime.now(timezone.utc)},
    )
    notifications, total_count = crud.notification.get_multi_with_pagination(
        db, user_id=curr_user.id, skip=skip, limit=limit
    )
    return schemas.PaginatedResponse(
        total_count=total_count, count=len(notifications), records=notifications
    )


@router.delete(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_404_NOT_FOUND: {},
        status.HTTP_403_FORBIDDEN: {},
        status.HTTP_204_NO_CONTENT: {},
    },
)
async def delete_notification(
    notification_id: int, curr_user=Depends(get_current_user), db=Depends(get_db)
):
    notification = crud.notification.get(db, notification_id)
    if not notification:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")

    if notification.user_id != curr_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    crud.notification.remove(db, id=notification.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_404_NOT_FOUND: {},
        status.HTTP_403_FORBIDDEN: {},
        status.HTTP_204_NO_CONTENT: {},
    },
)
async def mark_as_seen(
    notification_id: int, curr_user=Depends(get_current_user), db=Depends(get_db)
):
    notification = crud.notification.get(db, notification_id)
    if not notification:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")

    if notification.user_id != curr_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN)

    crud.notification.mark_as_seen(db, db_obj=notification)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete(
    "/all/",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_all_notifications(
    curr_user: models.User = Depends(get_current_user), db=Depends(get_db)
):
    last_read = curr_user.last_notifications_read or datetime(
        1900, 1, 1, tzinfo=timezone.utc
    )
    crud.notification.delete_all(db, user_id=curr_user.id, last_read_time=last_read)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch(
    "/all/",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def mark_as_seen_all(
    curr_user: models.User = Depends(get_current_user), db=Depends(get_db)
):
    last_read = curr_user.last_notifications_read or datetime(
        1900, 1, 1, tzinfo=timezone.utc
    )
    crud.notification.mark_seen_all(db, user_id=curr_user.id, last_read_time=last_read)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
