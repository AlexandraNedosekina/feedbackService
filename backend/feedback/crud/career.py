from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDCareer(
    CRUDBase[models.CareerTrack, schemas.CareerTrackCreate, schemas.CareerTrackUpdate]
):
    def create(
        self, db: Session, *, obj_in: schemas.CareerTrackCreate
    ) -> models.CareerTrack:
        db_obj = self._construct_db_obj(obj_in)
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

    def _construct_db_obj(self, obj_in: schemas.CareerTrackCreate):
        career_params = [models.CareerParam(**param.dict()) for param in obj_in.params]
        return models.CareerTrack(
            **obj_in.dict(exclude={"params"}), params=career_params
        )

    def bulk_create(
        self, db: Session, *, objs_in: list[schemas.CareerTrackCreate]
    ) -> None:
        db_objs = [self._construct_db_obj(obj_in) for obj_in in objs_in]
        db.add_all(db_objs)
        db.commit()


class CRUDCareerParam(
    CRUDBase[models.CareerParam, schemas.CareerParamCreate, schemas.CareerParamUpdate]
):
    def create(self):
        raise NotImplementedError

    def get_multi(self):
        raise NotImplementedError


career = CRUDCareer(models.CareerTrack)
career_param = CRUDCareerParam(models.CareerParam)
