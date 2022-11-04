from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer, String,
                        Time)
from sqlalchemy.orm import backref, relationship

from feedback.db.session import Base


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    job_title = Column(String)
    date_of_birth = Column(DateTime)
    roles = relationship(
        "Roles", backref="user", cascade="all, delete, delete-orphan", lazy="joined"
    )
    facts = relationship(
        "Facts", backref="user", cascade="all, delete, delete-orphan", lazy="joined"
    )
    skills = relationship(
        "Skills", backref="user", cascade="all, delete, delete-orphan", lazy="joined"
    )
    job_expectations = relationship(
        "Expectations",
        backref="user",
        cascade="all, delete, delete-orphan",
        lazy="joined",
    )
    avatar = relationship(
        "Avatars",
        back_populates="owner",
        cascade="all, delete, delete-orphan",
        lazy="select",
        uselist=False,
    )
    work_format = Column(String)
    work_hours_start = Column(Time)
    work_hours_end = Column(Time)
    meeting_readiness = Column(Boolean())


class Avatars(Base):
    __tablename__ = "avatars"
    id = Column(Integer, primary_key=True)
    original_path = Column(String)
    thumbnail_path = Column(String)
    width = Column(Integer)
    height = Column(Integer)
    x = Column(Integer)
    y = Column(Integer)
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
