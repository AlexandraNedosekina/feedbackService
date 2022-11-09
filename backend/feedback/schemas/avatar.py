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


class AvatarOptions(AvatarCreate):
    pass


class AvatarInDB(Base):
    id: int
    original_path: str
    thumbnail_path: str
    thumbnail_url: str
    x: int
    y: int
    width: int
    height: int
    owner_id: int


class Avatar(AvatarInDB):
    id: int | None
    original_path: str | None
    thumbnail_path: str | None
    thumbnail_url: str
    owner_id: int | None

    class Config:
        fields = {
            "original_path": {"exclude": True},
            "thumbnail_path": {"exclude": True},
            "id": {"exclude": True},
            "owner_id": {"exclude": True},
        }
