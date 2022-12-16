import datetime
from typing import Literal

from pydantic import BaseModel, validator

from feedback import schemas


class Base(BaseModel):
    class Config:
        orm_mode = True


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
    email: str
    full_name: str


class UserUpdateSelf(Base):
    facts: list[str] | None
    skills: list[str] | None
    job_expectations: list[str] | None
    work_format: Literal["home", "office", "part"] | None
    work_hours_start: datetime.time | None
    work_hours_end: datetime.time | None
    meeting_readiness: bool | None
    date_of_birth: datetime.date | None

    @validator("date_of_birth")
    def check_real_bdate(cls, val):
        if datetime.date.today() <= val:
            raise ValueError("Date of birth cannot be in the future")
        return val


class UserUpdateOther(Base):
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


class AddSkillPromts(Base):
    name: list[str]


class ShowSkillPromts(Base):
    id: int
    name: str


class UserDetails(Base):
    id: int
    full_name: str
    job_title: str | None
    avatar: schemas.Avatar | None
