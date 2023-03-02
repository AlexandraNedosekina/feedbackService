from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDNotification(
    CRUDBase[
        models.Notification, schemas.NotificationCreate, schemas.NotificationCreate
    ]
):
    def create(
        self, db: Session, *, obj_in: schemas.NotificationCreate
    ) -> models.Notification:
        return super().create(db, obj_in=obj_in)

    def get_by_user_id(self, db: Session, *, user_id: int) -> list[models.Notification]:
        q = db.query(models.Notification).filter(models.Notification.user_id == user_id)
        return q.all()

    def change_to_seen(self, db: Session, notification: models.Notification):
        upd = {"has_seen": "True"}
        return super().update(db, db_obj=notification, obj_in=upd)


notification = CRUDNotification(models.Notification)
