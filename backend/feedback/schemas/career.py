from typing import Literal

from pydantic import BaseModel

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
    name: str
    user_id: int
    params: list[CareerParamCreate] | None


class CareerTrackUpdate(BaseModel):
    name: str | None
    is_completed: bool | None
    is_current: bool | None
    params: list[CareerParamUpdate] | None


class CareerTrackInDB(BaseModel):
    id: int
    name: str
    user_id: int
    is_completed: bool
    is_current: bool
    params: list[CareerParamInDB] | None


class CareerTrack(CareerTrackInDB):
    params: list[CareerParam] | None

    class Config:
        orm_mode = True
