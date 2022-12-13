from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDEvent(CRUDBase[models.Event, schemas.EventCreate, schemas.EventUpdate]):
    def create(self, db: Session, *, obj_in: schemas.EventCreate) -> models.Event:
        db_obj = models.Event(**obj_in.dict(), status=schemas.EventStatus.waiting)
        return super().create(db, obj_in=db_obj)

    def update_status(
        self, db: Session, *, db_obj: models.Event, status: schemas.EventStatus
    ) -> models.Event:
        obj_in = {"status": status}
        return super().update(db, db_obj=db_obj, obj_in=obj_in)


event = CRUDEvent(models.Event)
