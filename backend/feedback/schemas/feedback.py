from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field, validator

from feedback.schemas.user import UserDetails


class Base(BaseModel):
    class Config:
        orm_mode = True


class ColleaguesIdList(Base):
    colleagues_ids: list[int]


class Colleagues(Base):
    id: int
    colleague: UserDetails
    owner_id: int


class EventCreate(Base):
    date_start: datetime = Field(..., description="Event start date in utc")
    date_stop: datetime = Field(..., description="Event end date in utc")

    @validator("date_start", "date_stop")
    def validate_dates(cls, v):
        if v < datetime.now(timezone.utc):
            raise ValueError("date can not be earlier than now")
        return v

    @validator("date_stop")
    def validate_both_dates(cls, v, values):
        start_date = values.get("date_start")
        if v < start_date:
            raise ValueError("stop can not be earlier than start")
        return v


class EventUpdate(Base):
    date_start: datetime | None
    date_stop: datetime | None

    @validator("date_start", "date_stop")
    def validate_dates(cls, v):
        if v < datetime.now(timezone.utc):
            raise ValueError("date can not be earlier than now")
        return v

    @validator("date_stop")
    def validate_both_dates(cls, v, values):
        start_date = values.get("start_date")
        if start_date:
            if v < start_date:
                raise ValueError("stop can not be earlier than start")
        return v


class EventStatus(str, Enum):
    waiting = "waiting"
    active = "active"
    archived = "archived"


class EventInDB(Base):
    id: int
    date_start: datetime
    date_stop: datetime
    status: EventStatus


class Event(EventInDB):
    pass


class FeedbackFromUser(Base):
    task_completion: int
    involvement: int
    motivation: int
    interaction: int

    achievements: str | None
    wishes: str | None
    remarks: str | None
    comment: str | None

    @validator("task_completion", "involvement", "motivation", "interaction")
    def check_rating_between_0_and_5(cls, v):
        if v < 0 or v > 5:
            raise ValueError("value must be between 0 and 5")
        return v


class FeedbackCreateEmpty(Base):
    event_id: int
    sender_id: int
    receiver_id: int


class FeedbackInDB(Base):
    id: int
    event_id: int
    sender: UserDetails
    receiver: UserDetails

    completed: bool
    avg_rating: float | None

    task_completion: int | None
    involvement: int | None
    motivation: int | None
    interaction: int | None

    achievements: str | None
    wishes: str | None
    remarks: str | None
    comment: str | None


class Feedback(FeedbackInDB):
    pass
