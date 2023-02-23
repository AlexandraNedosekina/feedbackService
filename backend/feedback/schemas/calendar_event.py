from datetime import datetime, timezone
import pytz
from feedback.schemas.base import Base
from feedback.schemas.user import UserDetails
from enum import Enum

from pydantic import validator, Field
from pydantic.class_validators import root_validator
import logging

logger = logging.getLogger(__name__)


def convert_to_utc(date: datetime) -> datetime:
    try:
        return date.astimezone(pytz.timezone("UTC"))
    except pytz.UnknownTimeZoneError as e:
        logger.debug(e)
        raise ValueError(f"unknown Timezone")


def is_date_after_currnet_date(date: datetime):
    if date < datetime.now(tz=timezone.utc):
        raise ValueError("date can not be earlier than now")
    return date


def nullify_seconds(date: datetime):
    return date.replace(second=0, microsecond=0)


def is_end_after_start(cls, values):
    start = values.get("date_start") 
    end = values.get("date_end") 

    if not start or not end:
        raise ValueError("cant find start or end")

    if end <= start:
        raise ValueError("end date can not be smaller or equal to start")
    return values


class CalendarEventCreate(Base):
    user_id: int
    title: str
    description: str | None
    
    date_start: datetime = Field(..., description="Event start datetime in UTC with timezone")
    date_end: datetime = Field(..., description="Event end datetime in UTC with timezone")
    
    # validators
    _convert_to_utc = validator("date_start", "date_end", allow_reuse=True)(convert_to_utc)
    _nullify_seconds = validator("date_start", "date_end", allow_reuse=True)(nullify_seconds)
    _check_start_after_current_date = validator("date_start", allow_reuse=True)(is_date_after_currnet_date)
    _check_end_after_start = root_validator(allow_reuse=True)(is_end_after_start)
    # NOTE: Maybe add min max event duration


class CalendarEventUpdate(Base):
    user_id: int | None
    title: str | None
    description: str | None
    
    date_start: datetime | None = Field(None, description="Event start datetime in UTC")
    date_end: datetime | None = Field(None, description="Event end datetime in UTC")

    # validators
    _convert_to_utc = validator("date_start", "date_end", allow_reuse=True)(convert_to_utc)
    _nullify_seconds = validator("date_start", "date_end", allow_reuse=True)(nullify_seconds)
    _check_start_after_current_date = validator("date_start", allow_reuse=True)(is_date_after_currnet_date)
    _check_end_after_start = root_validator(allow_reuse=True)(is_end_after_start)


class CalendarEventStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    RESHEDULED = "resheduled"


class CalendarFormat(str, Enum):
    DAY = "day"
    WEEK = "week"
    MONTH = "month"


class CalendarEventInDB(Base):
    id: int
    owner_id: int
    owner: UserDetails
    user_id: int
    user: UserDetails

    title: str
    description: str | None

    date_start: datetime
    date_end: datetime

    status: CalendarEventStatus | None
    rejection_cause: str | None


class CalendarEvent(CalendarEventInDB):
    pass
