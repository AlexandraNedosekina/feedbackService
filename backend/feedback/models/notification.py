from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func

from feedback.db.session import Base


class Notification(Base):
    __tablename__ = "notification"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    message = Column(String)
    subject = Column(String)
    created_at = Column(DateTime, server_default=func.now())
