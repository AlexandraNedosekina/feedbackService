from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDCareer(
    CRUDBase[
        models.CareerTemplate,
        schemas.CareerTemplateCreate,
        schemas.CareerTemplateUpdate,
    ]
):
    def create(
        self, db: Session, *, obj_in: schemas.CareerTemplateCreate, creator_id: int
    ) -> models.CareerTemplate:
        db_obj = models.CareerTemplate(**obj_in.dict(), created_by_id=creator_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_with_queries(
        self,
        db: Session,
        *,
        by: int = None,
        name: str = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[models.CareerTemplate]:
        q = db.query(models.CareerTemplate)

        if by:
            q = q.filter(models.CareerTemplate.created_by_id == by)

        if name:
            q = q.filter(models.CareerTemplate.name.ilike(f"%{name}%"))

        return (q.offset(skip).limit(limit).all(), q.count())


career_template = CRUDCareer(models.CareerTemplate)
