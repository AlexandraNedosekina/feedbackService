import logging
from datetime import datetime, timedelta, timezone
from enum import Enum

import pytz
from pydantic import Field, validator
from pydantic.class_validators import root_validator

from feedback.schemas.base import Base
from feedback.schemas.user import UserDetails

logger = logging.getLogger(__name__)

MAX_MEETING_DURATION_HOURS = 8


def at_least_one_date_exists(cls, values):
    if not values.get("date_start") and not values.get("date_end"):
        raise ValueError("At least one date should exist")
    return values


def convert_to_utc(date: datetime) -> datetime:
    try:
        return date.astimezone(pytz.timezone("UTC"))
    except pytz.UnknownTimeZoneError as e:
        logger.debug(e)
        raise ValueError("unknown Timezone") from e


def is_date_after_currnet_date(date: datetime):
    if date < datetime.now(tz=timezone.utc):
        raise ValueError("date can not be earlier than now")
    return date


def nullify_seconds(date: datetime):
    return date.replace(second=0, microsecond=0)


def is_end_after_start(cls, values):
    start = values.get("date_start")
    end = values.get("date_end")

    if (not start or not end) and cls != CalendarEventUpdate:
        raise ValueError("cant find start or end")
    elif cls == CalendarEventUpdate and (not start or not end):
        return values

    if end <= start:
        raise ValueError("end date can not be smaller or equal to start")
    return values


def check_time_interval(cls, values):
    start = values.get("date_start")
    end = values.get("date_end")
    if (not start or not end) and cls != CalendarEventUpdate:
        raise ValueError("cant find start or end")
    elif cls == CalendarEventUpdate and (not start or not end):
        return values

    max_duration = timedelta(hours=MAX_MEETING_DURATION_HOURS)
    duration = end - start
    if duration > max_duration:
        raise ValueError(
            f"Продолжительность встречи не может быть более {MAX_MEETING_DURATION_HOURS} часов"
        )
    return values


class CalendarEventCreate(Base):
    user_id: int
    title: str
    description: str | None

    date_start: datetime = Field(
        ...,
        description="Event start datetime in UTC with timezone. Example: '2023-02-26T12:30:00Z'",
    )
    date_end: datetime = Field(
        ...,
        description="Event end datetime in UTC with timezone. Example: '2023-02-26T12:30:00Z'",
    )

    # validators
    _convert_to_utc = validator("date_start", "date_end", allow_reuse=True)(
        convert_to_utc
    )
    _nullify_seconds = validator("date_start", "date_end", allow_reuse=True)(
        nullify_seconds
    )
    _check_start_after_current_date = validator("date_start", allow_reuse=True)(
        is_date_after_currnet_date
    )
    _check_end_after_start = root_validator(allow_reuse=True)(is_end_after_start)
    _check_time_interval = root_validator(allow_reuse=True)(check_time_interval)


class CalendarEventUpdate(Base):
    user_id: int | None
    title: str | None
    description: str | None

    date_start: datetime | None = Field(None, description="Event start datetime in UTC")
    date_end: datetime | None = Field(None, description="Event end datetime in UTC")

    # validators
    _convert_to_utc = validator("date_start", "date_end", allow_reuse=True)(
        convert_to_utc
    )
    _nullify_seconds = validator("date_start", "date_end", allow_reuse=True)(
        nullify_seconds
    )
    _check_start_after_current_date = validator("date_start", allow_reuse=True)(
        is_date_after_currnet_date
    )
    _check_end_after_start = root_validator(allow_reuse=True)(is_end_after_start)
    _check_time_interval = root_validator(allow_reuse=True)(check_time_interval)


class CalendarEventReshedule(Base):
    date_start: datetime = Field(..., description="Event start datetime in UTC")
    date_end: datetime = Field(..., description="Event end datetime in UTC")

    # validators
    _convert_to_utc = validator("date_start", "date_end", allow_reuse=True)(
        convert_to_utc
    )
    _nullify_seconds = validator("date_start", "date_end", allow_reuse=True)(
        nullify_seconds
    )
    _check_start_after_current_date = validator("date_start", allow_reuse=True)(
        is_date_after_currnet_date
    )
    _check_end_after_start = root_validator(allow_reuse=True)(is_end_after_start)
    _check_at_least_one_exists = root_validator(allow_reuse=True)(
        at_least_one_date_exists
    )
    _check_time_interval = root_validator(allow_reuse=True)(check_time_interval)


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

    status: CalendarEventStatus
    rejection_cause: str | None


class CalendarEvent(CalendarEventInDB):
    pass
