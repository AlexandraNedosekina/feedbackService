from logging import getLogger

from sqlalchemy import desc
from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase

log = getLogger(__name__)


class CRUDFeedback(
    CRUDBase[
        models.FeedbackHistory,
        schemas.FeedbackHistoryCreate,
        schemas.FeedbackHistoryCreate,
    ]
):
    def update(self):
        raise NotImplementedError

    def get_by_feedback_id(
        self, db: Session, *, feedback_id: int, limit: int = 10
    ) -> list[models.FeedbackHistory]:
        return (
            db.query(models.FeedbackHistory)
            .filter(models.FeedbackHistory.feedback_id == feedback_id)
            .order_by(desc(models.FeedbackHistory.created_at))
            .limit(limit)
            .all()
        )


feedback_history = CRUDFeedback(models.FeedbackHistory)
