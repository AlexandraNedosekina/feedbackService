from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Time,
)
from sqlalchemy.orm import relationship

from feedback.db.session import Base


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    job_title = Column(String)
    date_of_birth = Column(Date)
    roles = relationship(
        "Roles", backref="user", cascade="all, delete, delete-orphan", lazy="joined"
    )
    facts = relationship(
        "Facts",
        backref="user",
        cascade="all, delete, delete-orphan",
        lazy="joined",
        order_by="Facts.id",
    )
    skills = relationship(
        "Skills",
        backref="user",
        cascade="all, delete, delete-orphan",
        lazy="joined",
        order_by="Skills.id",
    )
    job_expectations = relationship(
        "Expectations",
        backref="user",
        cascade="all, delete, delete-orphan",
        lazy="joined",
        order_by="Expectations.id",
    )
    avatar = relationship(
        "Avatars",
        back_populates="owner",
        cascade="all, delete, delete-orphan",
        lazy="joined",
        uselist=False,
    )
    work_format = Column(String)
    work_hours_start = Column(Time)
    work_hours_end = Column(Time)
    meeting_readiness = Column(Boolean())
    colleagues = relationship(
        "Colleagues",
        backref="user",
        cascade="all, delete, delete-orphan",
        lazy="joined",
        foreign_keys="Colleagues.owner_id",
    )

    @property
    def get_roles(self) -> set[str]:
        return {r.description for r in self.roles}

    @property
    def get_colleagues_id(self) -> set[int]:
        return {c.colleague_id for c in self.colleagues}


class Avatars(Base):
    __tablename__ = "avatars"
    id = Column(Integer, primary_key=True)
    original_path = Column(String)
    thumbnail_path = Column(String)
    thumbnail_url = Column(String)
    x = Column(Integer)
    y = Column(Integer)
    width = Column(Integer)
    height = Column(Integer)
    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("User", back_populates="avatar")


class Facts(Base):
    __tablename__ = "facts"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("user.id"))


class Skills(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("user.id"))


class Expectations(Base):
    __tablename__ = "expectations"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("user.id"))


class Roles(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("user.id"))


class Colleagues(Base):
    __tablename__ = "colleagues"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("user.id"))
    colleague_id = Column(Integer, ForeignKey("user.id"), index=True)
    colleague = relationship("User", foreign_keys=[colleague_id])


class SkillPromts(Base):
    __tablename__ = "skillpromts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
