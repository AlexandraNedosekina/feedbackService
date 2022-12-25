from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from feedback.db.session import Base


class CareerTrack(Base):
    __tablename__ = "career_track"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    salary = Column(Integer, nullable=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    is_completed = Column(Boolean, nullable=False, server_default="0")
    is_current = Column(Boolean, nullable=False, server_default="0")
    params = relationship(
        "CareerParam",
        backref="career_track",
        cascade="all, delete, delete-orphan",
        lazy="joined",
    )


class CareerParam(Base):
    __tablename__ = "career_param"

    id = Column(Integer, primary_key=True)
    career_id = Column(Integer, ForeignKey("career_track.id"), nullable=False)
    description = Column(String, nullable=False)
    is_completed = Column(Boolean, nullable=False, server_default="0")
    type = Column(String, nullable=False)
