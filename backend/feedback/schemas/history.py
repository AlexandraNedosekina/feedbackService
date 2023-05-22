from datetime import datetime

from feedback.schemas.base import Base


class FeedbackHistoryCreate(Base):
    feedback_id: int
    task_completion: int
    involvement: int
    motivation: int
    interaction: int

    achievements: str | None
    wishes: str | None
    remarks: str | None
    comment: str | None
    created_at: datetime


class FeedbackHistory(FeedbackHistoryCreate):
    id: int
