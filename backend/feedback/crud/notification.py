from datetime import datetime

from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDNotification(
    CRUDBase[
        models.Notification, schemas.NotificationCreate, schemas.NotificationCreate
    ]
):
    def get_by_user_id(self, db: Session, *, user_id: int) -> list[models.Notification]:
        q = db.query(models.Notification).filter(models.Notification.user_id == user_id)
        return q.all()

    def get_new_by_last_read(
        self, db: Session, *, user_id: int, last_read: datetime
    ) -> list[models.Notification]:
        q = (
            db.query(models.Notification)
            .filter(
                models.Notification.user_id == user_id,
                models.Notification.created_at > last_read,
            )
            .order_by(models.Notification.created_at)
        )
        return q.all()

    def mark_as_seen(self, db: Session, *, db_obj: models.Notification):
        return super().update(db, db_obj=db_obj, obj_in={"has_seen": True})

    def update(self, db: Session, *, db_obj, obj_in):
        raise NotImplementedError

    def delete_all(self, db: Session, user_id: int, last_read_time: datetime) -> None:
        notifications = (
            db.query(models.Notification)
            .filter(
                models.Notification.user_id == user_id,
                models.Notification.created_at <= last_read_time,
            )
            .all()
        )
        for n in notifications:
            db.delete(n)
        db.commit()

    def get_multi_with_pagination(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> tuple[list[models.Notification], int]:
        q = db.query(models.Notification).filter(models.Notification.user_id == user_id)
        return (q.offset(skip).limit(limit).all(), q.count())

    def mark_seen_all(
        self, db: Session, user_id: int, last_read_time: datetime
    ) -> None:
        notifications: list[models.Notification] = (
            db.query(models.Notification)
            .filter(
                models.Notification.user_id == user_id,
                models.Notification.has_seen == False,  # noqa
                models.Notification.created_at <= last_read_time,
            )
            .all()
        )
        for n in notifications:
            n.has_seen = True
            db.add(n)
        db.commit()


notification = CRUDNotification(models.Notification)
