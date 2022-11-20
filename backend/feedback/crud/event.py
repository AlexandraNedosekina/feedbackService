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

    def update_status(
        self,
        db: Session,
        *,
        db_obj: models.Event,
        status: Literal["active", "archived"]
    ) -> models.Event:
        obj_in = {"status": status}
        return super().update(db, db_obj=db_obj, obj_in=obj_in)

    def get_with_status_multi(
        self,
        db: Session,
        skip: int,
        limit: int,
        status: Literal["active", "archived"],
    ) -> list[models.Event]:
        return (
            db.query(models.Event)
            .filter(models.Event.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_prev_event_for_user(self, db: Session, user_id: int) -> models.Event | None:
        event = (
            db.query(models.Event)
            .filter(models.Event.user_id == user_id)
            .order_by(models.Event.id.desc())
            .first()
        )
        return event

    def get_events_for_user(self, db: Session, user: models.User) -> list[models.Event]:
        # Get all events for colleagues
        colleagues_ids = [c.colleague_id for c in user.colleagues]
        active_events = self.__get_active_events(
            db, [models.Event.user_id.in_(colleagues_ids)]
        )

        # Get all participated events for colleagues
        participated_events = self.__get_participated_events(db, active_events, user.id)
        participated_events_ids = [e.id for e in participated_events]

        # Get events if event id not in participated_events
        available_events = [
            event for event in active_events if event.id not in participated_events_ids
        ]
        return available_events

    def get_events_for_priviliged_role(
        self, db: Session, user: models.User
    ) -> list[models.Event]:
        active_events = self.__get_active_events(db)
        participated_events = self.__get_participated_events(db, active_events, user.id)
        participated_events_ids = [e.id for e in participated_events]
        available_events = [
            event for event in active_events if event.id not in participated_events_ids
        ]
        return available_events

    def __get_active_events(
        self, db: Session, filters: list = []
    ) -> list[models.Event]:
        q = db.query(models.Event).filter(models.Event.status == "active")
        for f in filters:
            q = q.filter(f)
        return q.all()

    def __get_participated_events(
        self, db: Session, active_events: list[models.Event], user_id: int
    ) -> list[models.Event]:
        events_ids = [e.id for e in active_events]
        participated_events = (
            db.query(models.Feedback)
            .filter(
                models.Feedback.event_id.in_(events_ids),
                models.Feedback.owner_id == user_id,
            )
            .all()
        )
        return participated_events

    def get_by_user_id(self, db: Session, user_id: int, status=None):
        event_with_feedback = (
            db.query(models.Event)
            .join(models.Feedback)
            .filter(models.Event.user_id == user_id)
        )
        if status:
            event_with_feedback = event_with_feedback.filter(
                models.Event.status == status
            )
        return event_with_feedback.all()


event = CRUDEvent(models.Event)
