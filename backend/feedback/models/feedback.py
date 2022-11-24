from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer,
                        Numeric, String)
from sqlalchemy.orm import relationship

from feedback.db.session import Base


class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True)

    date_start = Column(DateTime, nullable=False)
    date_end = Column(DateTime, nullable=False)
    status = Column(String) #waiting, active, archive


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("event.id"))
    sender_id = Column(Integer, ForeignKey("user.id"))
    receiver_id = Column(Integer, ForeignKey("user.id"))

    completed = Column(Boolean)
    avg_rating = Column(Numeric)

    task_completion = Column(Integer)
    involvement = Column(Integer)
    motivation = Column(Integer)
    interaction = Column(Integer)

    achievements = Column(String)
    wishes = Column(String)
    remarks = Column(String)
    comment = Column(String)
