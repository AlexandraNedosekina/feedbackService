from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from feedback.db.session import Base
from feedback.models.feedback import MyDateTime

class CalendarEvent(Base):
    __tablename__ = "calendar_event"

    id = Column(Integer, primary_key=True, index=True)

    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("User", foreign_keys=[owner_id])

    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", foreign_keys=[user_id])

    title = Column(String)
    description = Column(String, nullable=True)

    date_start = Column(MyDateTime, nullable=False)
    date_end = Column(MyDateTime, nullable=False)

    status = Column(String) # Accepted, Rejected, Resheduled
    rejection_cause = Column(String)
    
