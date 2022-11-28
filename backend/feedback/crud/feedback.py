from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDFeedback(
    CRUDBase[
        models.Feedback,
        schemas.FeedbackCreateEmpty | schemas.FeedbackFromUser,
        schemas.FeedbackFromUser,
    ]
):
    def create(
        self,
        db: Session,
        *,
        obj_in: schemas.FeedbackFromUser,
        sender_id: int,
        receiver_id: int,
        event_id: int
    ) -> models.Feedback:
        user_rating = [
            obj_in.task_completion,
            obj_in.involvement,
            obj_in.motivation,
            obj_in.interaction,
        ]
        avg_rating = sum(user_rating) / len(user_rating)
        db_obj = models.Feedback(
            **obj_in.dict(),
            avg_rating=avg_rating,
            completed=True,
            sender_id=sender_id,
            receiver_id=receiver_id,
            event_id=event_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self):
        raise NotImplementedError

    def update_user_feedback(
        self, db: Session, *, db_obj: models.Feedback, obj_in: schemas.FeedbackFromUser
    ) -> models.Feedback:
        user_rating = [
            obj_in.task_completion,
            obj_in.involvement,
            obj_in.motivation,
            obj_in.interaction,
        ]
        avg_rating = sum(user_rating) / len(user_rating)
        upd = {**obj_in.dict(), "avg_rating": avg_rating, "completed": True}
        return super().update(db, db_obj=db_obj, obj_in=upd)

    def create_empty(
        self, db: Session, *, obj_in: schemas.FeedbackCreateEmpty
    ) -> models.Feedback:
        db_obj = models.Feedback(**obj_in.dict(), completed=False)
        return super().create(db, obj_in=db_obj)

    def remove_all(self, db: Session) -> int:
        number_of_deleted_rows = db.query(models.Feedback).delete()
        db.commit()
        return number_of_deleted_rows

    def get_by_event_id_and_user_id(
        self, db: Session, event_id: int, user_id: int
    ) -> models.Feedback | None:
        feedback = (
            db.query(models.Feedback)
            .filter(
                models.Feedback.event_id == event_id,
                models.Feedback.sender_id == user_id,
            )
            .first()
        )
        return feedback


feedback = CRUDFeedback(models.Feedback)
