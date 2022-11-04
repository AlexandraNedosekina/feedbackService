import inspect
from typing import Type

from fastapi import Form
from pydantic import BaseModel


class Base(BaseModel):
    class Config:
        orm_mode = True


def as_form(cls: Type[BaseModel]):
    """
    Adds an as_form class method to decorated models. The as_form class method
    can be used with FastAPI endpoints
    """
    new_params = [
        inspect.Parameter(
            field.alias,
            inspect.Parameter.POSITIONAL_ONLY,
            default=(Form(field.default) if not field.required else Form(...)),
            annotation=field.outer_type_,
        )
        for field in cls.__fields__.values()
    ]

    async def _as_form(**data):
        return cls(**data)

    sig = inspect.signature(_as_form)
    sig = sig.replace(parameters=new_params)
    _as_form.__signature__ = sig
    setattr(cls, "as_form", _as_form)
    return cls


@as_form
class AvatarCreate(Base):
    width: int
    height: int
    x: int
    y: int


class AvatarUpdate(AvatarCreate):
    pass


class AvatarInDB(AvatarUpdate):
    id: int
    original_path: str
    thubmail_path: str
    owner_id: int


class Avatar(AvatarInDB):
    pass
