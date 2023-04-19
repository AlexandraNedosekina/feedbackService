from datetime import datetime

from pydantic import Field, root_validator

from feedback.schemas.base import Base
from feedback.schemas.career import CareerParamCreate, check_name_or_salary_exists
from feedback.schemas.user import UserDetails


class CareerTrackTemplate(Base):
    name: str | None
    salary: int | None
    params: list[CareerParamCreate]

    __check_name_or_salary = root_validator(allow_reuse=True)(
        check_name_or_salary_exists
    )


class CareerTrackTemplateUpdate(Base):
    name: str | None
    salary: int | None
    params: list[CareerParamCreate] | None


class CareerTemplateCreate(Base):
    name: str
    template: list[CareerTrackTemplate]


class CareerTemplateUpdate(Base):
    name: str
    template: list[CareerTrackTemplate]


class CareerTemplateInDB(Base):
    id: int
    name: str

    template: list[CareerTrackTemplate]

    created_by_id: int
    created_by_user: UserDetails
    created_at: datetime


class CareerTemplate(CareerTemplateInDB):
    pass


class ApplyTemplateOpts(Base):
    user_ids: list[int] = Field(min_items=1, ge=0, unique_items=True)
    indexes: list[int] | None = Field(
        default=None,
        min_items=1,
        ge=0,
        unique_items=True,
        description="Optional field to apply only included indexes from template",
    )
