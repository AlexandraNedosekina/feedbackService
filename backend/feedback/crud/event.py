from datetime import date, datetime
from typing import Literal

from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDEvent(CRUDBase[models.Event, schemas.EventCreate, schemas.EventUpdate]):
    def create(self, db: Session, *, obj_in: schemas.EventCreate) -> models.Event:
        db_obj = models.Event(
            user_id=obj_in.user_id,
            date_start=obj_in.date_start,
            date_stop=obj_in.date_stop,
            status="active",
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_avg_rating(
        self, db: Session, *, db_obj: models.Event, avg_rating: float
    ) -> models.Event:
        obj_in = {"avg_rating": avg_rating}
        return super().update(db, db_obj=db_obj, obj_in=obj_in)

    def update_status(
        self,
        db: Session,
        *,
        db_obj: models.Event,
        status: Literal["active", "archived", "finished"]
    ) -> models.Event:
        obj_in = {"status": status}
        return super().update(db, db_obj=db_obj, obj_in=obj_in)

    def get_with_status(
        self,
        db: Session,
        skip: int,
        limit: int,
        status: Literal["active", "archived", "finished"],
    ) -> list[models.Event]:
        return (
            db.query(models.Event)
            .filter(models.Event.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_events_for_user(self, db: Session, user: models.User) -> list[models.Event]:
        colleagues_ids = [c.colleague_id for c in user.colleagues]
        print(colleagues_ids)
        events = (
            db.query(models.Event)
            .filter(models.Event.status == "active")
            .filter(models.Event.user_id.in_(colleagues_ids))
            .all()
        )
        print(events)
        return events


event = CRUDEvent(models.Event)
