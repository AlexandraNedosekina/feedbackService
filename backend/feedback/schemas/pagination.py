import typing as tp

from pydantic.generics import GenericModel

_Records = tp.TypeVar("_Records")


class PaginatedResponse(GenericModel, tp.Generic[_Records]):
    total_count: int
    count: int
    records: list[_Records]
