from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDCareer(
    CRUDBase[models.CareerTrack, schemas.CareerTrackCreate, schemas.CareerTrackUpdate]
):
    def create(
        self, db: Session, *, obj_in: schemas.CareerTrackCreate
    ) -> models.CareerTrack:
        career_params = []
        for param in obj_in.params:
            career_param = models.CareerParam(**param.dict())
            career_params.append(career_param)

        db_obj = models.CareerTrack(
            name=obj_in.name, user_id=obj_in.user_id, params=career_params
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: models.CareerTrack,
        obj_in: schemas.CareerTrackUpdate
    ) -> models.CareerTrack:
        if obj_in.params:
            for param in obj_in.params:
                param_db = career_param.get(db, id=param.id)
                career_param.update(db, db_obj=param_db, obj_in=param)
            del obj_in.params

        return super().update(db, db_obj=db_obj, obj_in=obj_in)

    def add_params(
        self,
        db: Session,
        *,
        career: models.CareerTrack,
        obj_in: list[schemas.CareerParamCreate]
    ) -> models.CareerTrack:
        for param in obj_in:
            career_param = models.CareerParam(**param.dict())
            career.params.append(career_param)
        db.add(career)
        db.commit()
        db.refresh(career)
        return career

    def remove_param(self, db: Session, *, id: int) -> models.CareerParam:
        return career_param.remove(db, id=id)

    def get_param(self, db: Session, id: int) -> models.CareerParam:
        return career_param.get(db, id)

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, user_id: int = None
    ) -> list[models.CareerTrack]:
        q = db.query(models.CareerTrack)
        if user_id:
            q = q.filter(models.CareerTrack.user_id == user_id)
        return q.offset(skip).limit(limit).all()


class CRUDCareerParam(
    CRUDBase[models.CareerParam, schemas.CareerParamCreate, schemas.CareerParamUpdate]
):
    def create(self):
        raise NotImplementedError

    def get_multi(self):
        raise NotImplementedError


career = CRUDCareer(models.CareerTrack)
career_param = CRUDCareerParam(models.CareerParam)
