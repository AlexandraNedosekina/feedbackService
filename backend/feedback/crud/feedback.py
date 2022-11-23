from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDFeedback(
    CRUDBase[models.Feedback, schemas.FeedbackCreateEmpty, schemas.FeedbackFromUser]
):
    def create(self):
        raise NotImplementedError

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

    def create_empty_feedback(
        self, db: Session, *, obj_in: schemas.FeedbackCreateEmpty
    ) -> models.Feedback:
        db_obj = models.Feedback(**obj_in.dict(), completed=False)
        return super().create(db, obj_in=db_obj)

    # def create(self, db: Session, *, obj_in: schemas.FeedbackCreate, sender_id: int) -> models.Feedback:
    #     user_rating = [
    #         obj_in.task_completion,
    #         obj_in.involvement,
    #         obj_in.motivation,
    #         obj_in.interaction,
    #     ]
    #     avg_rating = sum(user_rating) / len(user_rating)
    #
    #     db_obj = models.Feedback(
    #         **obj_in.dict(), sender_id=sender_id, avg_rating=avg_rating
    #     )
    #     return super().create(db, obj_in=db_obj)

    # def get_by_user_and_event(
    #         self, db: Session, user_id: int, event_id: int
    # ) -> list[models.Feedback]:
    #     return (
    #         db.query(models.Feedback)
    #         .filter(models.Feedback.sender == user_id)
    #         .filter(models.Feedback.event_id == event_id)
    #         .all()
    #     )


feedback = CRUDFeedback(models.Feedback)
