from pydantic import BaseModel


class Base(BaseModel):
    class Config:
        orm_mode = True


class ColleaguesIdList(Base):
    colleagues_ids: list[int]


class Colleagues(Base):
    id: int
    colleague_id: int
    user_id: int
