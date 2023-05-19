from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    TypeDecorator,
)
from sqlalchemy.orm import relationship

from feedback.db.session import Base


class MyDateTime(TypeDecorator):
    impl = DateTime
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if type(value) is str:
            value = value.split(".")[0]
            return datetime.fromisoformat(value)
        return value


class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)
    date_start = Column(MyDateTime, nullable=False)
    date_stop = Column(MyDateTime, nullable=False)
    status = Column(String)  # waiting, active, archive

    def __repr__(self):
        return f"<Event id={self.id} status={self.status}>"


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("event.id"))

    sender_id = Column(Integer, ForeignKey("user.id"))
    sender = relationship("User", foreign_keys=[sender_id])

    receiver_id = Column(Integer, ForeignKey("user.id"))
    receiver = relationship("User", foreign_keys=[receiver_id])

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

    def __repr__(self):
        return f"<Feedback id={self.id} event_id={self.event_id} sender_id={self.sender_id} receiver_id={self.receiver_id}>"
