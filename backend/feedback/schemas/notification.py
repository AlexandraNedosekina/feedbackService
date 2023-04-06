from datetime import datetime

from feedback.schemas.base import Base


class NotificationCreate(Base):
    user_id: int
    message: str
    subject: str


class Notification(Base):
    id: int
    user_id: int
    message: str
    subject: str
    created_at: datetime
