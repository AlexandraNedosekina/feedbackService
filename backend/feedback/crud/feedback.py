from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


# Update is not implemented
class CRUDFeedback(CRUDBase[models.Feedback, schemas.FeedbackCreate, schemas.Feedback]):
    def create(
        self,
        db: Session,
        *,
        obj_in: schemas.FeedbackCreate,
        owner_id: int,
        intendend_for: int
    ) -> models.Feedback:
        db_obj = models.Feedback(
            **obj_in.dict(),
            owner_id=owner_id,
            intendend_for=intendend_for,
        )
        return super().create(db, obj_in=db_obj)

    def get_by_user_and_event(
        self, db: Session, user_id: int, event_id: int
    ) -> list[models.Feedback]:
        return (
            db.query(models.Feedback)
            .filter(models.Feedback.owner_id == user_id)
            .filter(models.Feedback.event_id == event_id)
            .all()
        )

    def update(self):
        raise NotImplementedError


feedback = CRUDFeedback(models.Feedback)
