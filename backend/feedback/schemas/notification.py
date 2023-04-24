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
    has_seen: bool
    created_at: datetime
