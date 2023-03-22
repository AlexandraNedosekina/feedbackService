import datetime
import logging

from sqlalchemy import and_, func, or_
from sqlalchemy.orm import Query, Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase

logger = logging.getLogger(__name__)


class OverlappingEventError(Exception):
    pass


class CRUDCalendar(
    CRUDBase[
        models.CalendarEvent, schemas.CalendarEventCreate, schemas.CalendarEventUpdate
    ]
):
    def reject(
        self, db: Session, *, db_obj: models.CalendarEvent, rejection_cause: str = ""
    ) -> models.CalendarEvent:
        obj_in = {
            "status": schemas.CalendarEventStatus.REJECTED,
            "rejection_cause": rejection_cause,
        }
        return super().update(db, db_obj=db_obj, obj_in=obj_in)

    def update(
        self,
        db: Session,
        *,
        db_obj: models.CalendarEvent,
        obj_in: schemas.CalendarEventUpdate,
    ) -> models.CalendarEvent:
        start = obj_in.date_start or db_obj.date_start
        end = obj_in.date_end or db_obj.date_end

        if self.get_overlapping_events(
            db, start=start, end=end, user_id=db_obj.user_id
        ):
            raise OverlappingEventError(
                f"User(id={db_obj.user_id} has overlapping events)"
            )

        if self.get_overlapping_events(
            db, start=start, end=end, user_id=db_obj.owner_id
        ):
            raise OverlappingEventError(
                f"User(id={db_obj.owner_id} has overlapping events)"
            )
        return super().update(db, db_obj=db_obj, obj_in=obj_in)

    def accept(
        self, db: Session, *, db_obj: models.CalendarEvent
    ) -> models.CalendarEvent:
        # Check that event participant has no overlapping events
        if self.get_overlapping_events(
            db, start=db_obj.date_start, end=db_obj.date_end, user_id=db_obj.user_id
        ):
            raise OverlappingEventError(
                f"User(id={db_obj.user_id} has overlapping events)"
            )

        # Check that event creator has no overlapping events
        if self.get_overlapping_events(
            db, start=db_obj.date_start, end=db_obj.date_end, user_id=db_obj.owner_id
        ):
            raise OverlappingEventError(
                f"User(id={db_obj.owner_id} has overlapping events)"
            )

        obj_in = {"status": schemas.CalendarEventStatus.ACCEPTED}
        return super().update(db, db_obj=db_obj, obj_in=obj_in)

    def reshedule(
        self,
        db: Session,
        *,
        db_obj: models.CalendarEvent,
        resheduled: schemas.CalendarEventReshedule,
    ) -> models.CalendarEvent:
        start = resheduled.date_start or db_obj.date_start
        end = resheduled.date_end or db_obj.date_end

        if self.get_overlapping_events(
            db, start=start, end=end, user_id=db_obj.user_id
        ):
            raise OverlappingEventError(
                f"User(id={db_obj.user_id} has overlapping events)"
            )

        if self.get_overlapping_events(
            db, start=start, end=end, user_id=db_obj.owner_id
        ):
            raise OverlappingEventError(
                f"User(id={db_obj.owner_id} has overlapping events)"
            )

        obj_in = dict(
            owner_id=db_obj.user_id,  # Change owner to user cuz now he proposed time
            user_id=db_obj.owner_id,
            status=schemas.CalendarEventStatus.RESHEDULED,
            date_start=start,
            date_end=end,
        )
        return super().update(db, db_obj=db_obj, obj_in=obj_in)

    def create(
        self, db: Session, *, obj_in: schemas.CalendarEventCreate, owner_id: int
    ) -> models.CalendarEvent:
        db_obj = models.CalendarEvent(
            **obj_in.dict(),
            owner_id=owner_id,
            status=schemas.CalendarEventStatus.PENDING,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_with_common_queries(
        self,
        db: Session,
        *,
        user_id: int,
        date: datetime.date,
        format: schemas.CalendarFormat,
        status: schemas.CalendarEventStatus | None = None,
    ) -> list[models.CalendarEvent]:
        q = db.query(models.CalendarEvent)
        q = self._filter_by_user_id_all(q, user_id)

        if format == schemas.CalendarFormat.DAY:
            q = self._get_day_format(q, date)
        elif format == schemas.CalendarFormat.WEEK:
            q = self._get_week_format(q, date)
        else:
            q = self._get_month_format(q, date)

        if status:
            q = q.filter(models.CalendarEvent.status == status)
        return q.all()

    def get_by_date_and_user(
        self, db: Session, *, date: datetime.date, user_id: int
    ) -> list[models.CalendarEvent]:
        q = db.query(models.CalendarEvent)
        q = self._filter_by_user_id_all(q, user_id)
        return q.filter(func.DATE(models.CalendarEvent.date_start) == date).all()

    def get_overlapping_events(
        self,
        db: Session,
        *,
        start: datetime.datetime,
        end: datetime.datetime,
        user_id: int,
        status: schemas.CalendarEventStatus = schemas.CalendarEventStatus.ACCEPTED,
    ) -> list[models.CalendarEvent]:
        q = db.query(models.CalendarEvent)
        q = self._filter_by_user_id_all(q, user_id)
        q = q.filter(models.CalendarEvent.status == status)
        q = self._filter_overlapping(q, start, end)
        overlappings = q.all()
        logger.debug(
            f"Overlapping events for user {user_id} between {start} and {end} with status {status}: {overlappings}"
        )
        return overlappings

    def _filter_overlapping(
        self, q: Query, start: datetime.datetime, end: datetime.datetime
    ) -> Query:
        return q.filter(
            and_(
                models.CalendarEvent.date_end > start,
                models.CalendarEvent.date_start < end,
            )
        )

    def _filter_between_dates(
        self, q: Query, start: datetime.datetime, end: datetime.datetime
    ) -> Query:
        return q.filter(
            and_(
                models.CalendarEvent.date_start >= start,
                models.CalendarEvent.date_end <= end,
            )
        )

    def _filter_by_user_id_all(self, q: Query, user_id: int) -> Query:
        return q.filter(
            or_(
                models.CalendarEvent.user_id == user_id,
                models.CalendarEvent.owner_id == user_id,
            )
        )

    def _get_day_format(self, q: Query, date: datetime.date) -> Query:
        start = self._get_min_datetime_from_date(date)
        end = self._get_max_datetime_from_date(date)
        return self._filter_between_dates(q, start, end)

    def _get_week_format(self, q: Query, date: datetime.date) -> Query:
        monday = date - datetime.timedelta(days=date.weekday())
        sunday = monday + datetime.timedelta(days=6)

        start = self._get_min_datetime_from_date(monday)
        end = self._get_max_datetime_from_date(sunday)
        return self._filter_between_dates(q, start, end)

    def _get_month_format(self, q: Query, date: datetime.date) -> Query:
        start = self._get_min_datetime_from_date(self._get_start_of_month(date))
        end = self._get_max_datetime_from_date(self._get_end_of_month(date))
        return self._filter_between_dates(q, start, end)

    def _get_end_of_month(self, date: datetime.date) -> datetime.date:
        return (date.replace(day=28) + datetime.timedelta(days=4)).replace(
            day=1
        ) + datetime.timedelta(days=-1)

    def _get_start_of_month(self, date: datetime.date) -> datetime.date:
        return date.replace(day=1)

    def _get_min_datetime_from_date(self, date: datetime.date) -> datetime.datetime:
        return datetime.datetime.combine(date, datetime.time.min)

    def _get_max_datetime_from_date(self, date: datetime.date) -> datetime.datetime:
        return datetime.datetime.combine(date, datetime.time.max)


calendar = CRUDCalendar(models.CalendarEvent)
