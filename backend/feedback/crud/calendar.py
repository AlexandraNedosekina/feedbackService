from sqlalchemy.orm import Session, Query
from sqlalchemy import or_, and_, func 

from feedback import models, schemas
from feedback.crud.base import CRUDBase
import datetime


class CRUDCalendar(CRUDBase[models.CalendarEvent, schemas.CalendarEventCreate, schemas.CalendarEventUpdate]):
    def update_status(
        self, db: Session, *, db_obj: models.CalendarEvent, status: schemas.CalendarEventStatus
    ) -> models.CalendarEvent:
        obj_in = {"status": status}
        return super().update(db, db_obj=db_obj, obj_in=obj_in)


    def create(self, db: Session, *, obj_in: schemas.CalendarEventCreate, owner_id: int) -> models.CalendarEvent: 
        db_obj = models.CalendarEvent(
            **obj_in.dict(),
            owner_id=owner_id,
            status=schemas.CalendarEventStatus.PENDING
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
            status: schemas.CalendarEventStatus | None = None
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


    def get_by_date_and_user(self, db: Session, *, date: datetime.date, user_id: int) -> list[models.CalendarEvent]:
        q = db.query(models.CalendarEvent)
        q = self._filter_by_user_id_all(q, user_id)
        return q.filter(func.DATE(models.CalendarEvent.date_start) == date).all()


    def get_overlapping_events(self, db: Session, *, start: datetime.datetime, end: datetime.datetime, user_id: int) -> list[models.CalendarEvent]:
        q = db.query(models.CalendarEvent)
        q = self._filter_by_user_id_all(q, user_id)
        q = self._filter_overlapping(q, start, end)
        return q.all()


    def _filter_overlapping(self, q: Query, start: datetime.datetime, end: datetime.datetime) -> Query:
        return q.filter(and_(models.CalendarEvent.date_end > start, models.CalendarEvent.date_start < end))
    

    def _filter_between_dates(self, q: Query, start: datetime.datetime, end: datetime.datetime) -> Query:
        return q.filter(and_(models.CalendarEvent.date_start >= start, models.CalendarEvent.date_end <= end))


    def _filter_by_user_id_all(self, q: Query, user_id: int) -> Query:
        return q.filter(or_(models.CalendarEvent.user_id == user_id, models.CalendarEvent.owner_id == user_id))


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
        return (date.replace(day=28) + datetime.timedelta(days=4)).replace(day=1) + datetime.timedelta(days=-1)


    def _get_start_of_month(self, date: datetime.date) -> datetime.date:
        return date.replace(day=1)


    def _get_min_datetime_from_date(self, date: datetime.date) -> datetime.datetime:
        return datetime.datetime.combine(date, datetime.time.min)


    def _get_max_datetime_from_date(self, date: datetime.date) -> datetime.datetime:
        return datetime.datetime.combine(date, datetime.time.max)

calendar = CRUDCalendar(models.CalendarEvent)

