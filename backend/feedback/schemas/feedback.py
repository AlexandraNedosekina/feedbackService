from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ValidationError, validator


class Base(BaseModel):
    class Config:
        orm_mode = True


class ColleaguesIdList(Base):
    colleagues_ids: list[int]


class Colleagues(Base):
    id: int
    colleague_id: int
    user_id: int


class EventCreate(Base):
    user_id: int
    date_start: datetime
    date_stop: datetime

    # Create date validation TODO
    @validator("date_start")
    def validate_start(cls, v):
        return v

    @validator("date_stop")
    def validate_stop(cls, v):
        return v

    @validator("date_start", "date_stop")
    def validate_dates(cls, v):
        return v


class EventUpdate(Base):
    date_start: datetime | None
    date_stop: datetime | None


class EventInDB(Base):
    id: int
    user_id: int
    date_start: datetime
    date_stop: datetime
    status: Literal["active", "archived", "finished"]
    avg_rating: float | None


class Event(EventInDB):
    pass


class FeedbackCreate(Base):
    event_id: int

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


class FeedbackInDB(Base):
    id: int
    event_id: int
    owner_id: int

    task_completion: int
    involvement: int
    motivation: int
    interaction: int

    achievements: str | None
    wishes: str | None
    remarks: str | None
    comment: str | None


class Feedback(FeedbackInDB):
    pass
