from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from feedback.db.session import Base


class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"))

    date_start = Column(DateTime, nullable=False)
    date_stop = Column(DateTime, nullable=False)
    status = Column(String)
    avg_rating = Column(Integer)

    users_feedback = relationship(
        "Feedback",
        backref="event",
        cascade="all, delete, delete-orphan",
        lazy="select",
    )


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("event.id"))  # Do we really need this?
    intendend_for = Column(Integer, ForeignKey("user.id"))
    owner_id = Column(Integer, ForeignKey("user.id"))

    task_completion = Column(Integer, nullable=False)
    involvement = Column(Integer, nullable=False)
    motivation = Column(Integer, nullable=False)
    interaction = Column(Integer, nullable=False)

    achievements = Column(String, nullable=True)
    wishes = Column(String, nullable=True)
    remarks = Column(String, nullable=True)
    comment = Column(String, nullable=True)
