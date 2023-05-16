from sqlalchemy import Column, ForeignKey, Integer, String

from feedback.db.session import Base
from feedback.models.feedback import MyDateTime


class FeedbackHistory(Base):
    __tablename__ = "feedback_history"

    id = Column(Integer, primary_key=True, index=True)
    feedback_id = Column(Integer, ForeignKey("feedback.id"))

    task_completion = Column(Integer)
    involvement = Column(Integer)
    motivation = Column(Integer)
    interaction = Column(Integer)

    achievements = Column(String, nullable=True)
    wishes = Column(String, nullable=True)
    remarks = Column(String, nullable=True)
    comment = Column(String, nullable=True)

    created_at = Column(MyDateTime, nullable=False)
