from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer,
                        Numeric, String, TypeDecorator)
from datetime import datetime
from sqlalchemy.orm import relationship

from feedback.db.session import Base


class MyDateTime(TypeDecorator):
    impl = DateTime

    def process_bind_param(self, value, dialect):
        if type(value) is str:
            value = value.split(".")[0]
            return datetime.strptime(value, '%Y-%m-%dT%H:%M:%S')
        return value

class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True)

    date_start = Column(MyDateTime, nullable=False)
    date_stop = Column(MyDateTime, nullable=False)
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
