import datetime
from typing import Literal

from pydantic import EmailStr, Field, validator

from feedback import schemas
from feedback.schemas.base import Base


class BaseRel(Base):
    id: int | None
    description: str
    owner_id: int | None


class Fact(BaseRel):
    pass


class Skill(BaseRel):
    pass


class Role(BaseRel):
    description: Literal[
        "employee", "trainee", "mentor", "manager", "hr", "boss", "admin"
    ]


class JobExpectation(BaseRel):
    pass


class UserCreate(Base):
    email: EmailStr
    full_name: str

    @validator("email")
    def to_lower(cls, v) -> str:
        return v.lower()


class UserUpdateSelf(Base):
    facts: list[str] | None
    skills: list[str] | None
    job_expectations: list[str] | None
    work_format: Literal["home", "office", "part"] | None
    work_hours_start: datetime.time | None = Field(
        None, description="Start of work in Ekaterinburg time"
    )
    work_hours_end: datetime.time | None = Field(
        None, description="End of work in Ekaterinburg time"
    )
    meeting_readiness: bool | None
    date_of_birth: datetime.date | None

    @validator("date_of_birth")
    def check_real_bdate(cls, val):
        if not val:
            return val
        if datetime.date.today() <= val:
            raise ValueError("Date of birth cannot be in the future")
        return val


class UserUpdateOther(Base):
    work_hours_start: datetime.time | None = Field(
        None, description="Start of work in Ekaterinburg time"
    )
    work_hours_end: datetime.time | None = Field(
        None, description="End of work in Ekaterinburg time"
    )
    job_title: str | None
    roles: list[
        Literal["employee", "trainee", "mentor", "manager", "hr", "boss"]
    ] | None


# All fields in user that can be updated
class UserUpdate(UserUpdateSelf, UserUpdateOther):
    email: str | None
    full_name: str | None
    roles: list[
        Literal["employee", "trainee", "mentor", "manager", "hr", "boss", "admin"]
    ] | None


class UserInDB(UserUpdate):
    id: int
    roles: list[Role] | None
    facts: list[Fact] | None
    skills: list[Skill] | None
    job_expectations: list[JobExpectation] | None
    roles: list[Role] | None
    avatar: schemas.Avatar | None
    date_of_birth: datetime.date | None


class User(UserInDB):
    pass


class UserDetails(Base):
    id: int
    full_name: str
    job_title: str | None
    avatar: schemas.Avatar | None
