from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase
from datetime import datetime

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
    
    def get_new_by_last_read(self, db: Session, *, user_id: int, last_read: datetime) -> list[models.Notification]:
        q = db.query(models.Notification).filter(
            models.Notification.user_id == user_id,
            models.Notification.created_at > last_read
        ).order_by(models.Notification.created_at)
        return q.all()
    
    def update(self, db: Session, *, db_obj, obj_in):
        raise NotImplemented


notification = CRUDNotification(models.Notification)
