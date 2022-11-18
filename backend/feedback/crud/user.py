from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy.sql import update

from feedback import models, schemas
from feedback.crud.base import CRUDBase

relationship_models = {
    "skills": models.Skills,
    "facts": models.Facts,
    "job_expectations": models.Expectations,
    "roles": models.Roles,
}


class CRUDUser(CRUDBase[models.User, schemas.UserCreate, schemas.UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> models.User | None:
        return db.query(models.User).filter(models.User.email == email).first()

    def create(self, db: Session, *, obj_in: schemas.UserCreate) -> models.User:
        db_obj = models.User(
            email=obj_in.email,
            full_name=obj_in.full_name,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: models.User,
        obj_in: schemas.UserUpdate | schemas.UserUpdateOther | schemas.UserUpdateSelf
    ) -> models.User:
        obj_data = jsonable_encoder(db_obj)
        update_data = obj_in.dict(exclude_unset=True)

        for field in obj_data:
            if field in update_data:
                # Create relationship model and then add it to obj
                if relationship_models.get(field):
                    rel_data = self.create_relation(
                        relationship_models[field], update_data[field]
                    )
                    setattr(db_obj, field, rel_data)
                else:
                    setattr(db_obj, field, update_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_relation(
        self,
        model: models.Skills | models.Roles | models.Facts | models.Expectations,
        data: list[str],
    ):
        return [model(description=d) for d in data]

    def remove(self, db: Session, *, id: int) -> models.User:
        obj = db.query(self.model).get(id)

        if obj.avatar:
            self.delete_file_from_os(obj.avatar.original_path)
            self.delete_file_from_os(obj.avatar.thubmail_path)

        db.delete(obj)
        db.commit()
        return obj


user = CRUDUser(models.User)
