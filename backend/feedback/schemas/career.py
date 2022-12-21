from typing import Literal

from pydantic import BaseModel, validator, root_validator

ParamType = Literal["to_complete", "to_learn"]


class CareerParamCreate(BaseModel):
    description: str
    type: ParamType


class CareerParamUpdate(BaseModel):
    id: int
    description: str | None
    type: ParamType | None
    is_completed: bool | None


class CareerParamInDB(BaseModel):
    id: int
    career_id: int
    description: str
    type: ParamType
    is_completed: bool


class CareerParam(CareerParamInDB):
    class Config:
        orm_mode = True


class CareerTrackCreate(BaseModel):
    name: str | None
    salary: int | None
    user_id: int
    params: list[CareerParamCreate] | None

    @root_validator
    def check_name_or_salary_exists(cls, values):
        name = values.get("name")
        salary = values.get("salary")
        if not name and not salary:
            raise ValueError("Either name or salary field must be specified")
        return values


class CareerTrackUpdate(BaseModel):
    name: str | None
    salary: int | None
    is_completed: bool | None
    is_current: bool | None
    params: list[CareerParamUpdate] | None
    
    
class CareerTrackInDB(BaseModel):
    id: int
    name: str | None
    salary: int | None
    user_id: int
    is_completed: bool
    is_current: bool
    params: list[CareerParamInDB] | None


class CareerTrack(CareerTrackInDB):
    params: list[CareerParam] | None

    class Config:
        orm_mode = True
