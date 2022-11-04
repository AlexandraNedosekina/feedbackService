from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.crud.base import CRUDBase


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
            if field in update_data and field not in (
                "skills",
                "job_expectations",
                "facts",
                "roles",
            ):
                setattr(db_obj, field, update_data[field])

        # Needs custom setting for ref data
        if update_data.get("skills"):
            db_obj.skills = [
                models.Skills(description=d) for d in update_data["skills"]
            ]

        if update_data.get("facts"):
            db_obj.facts = [models.Facts(description=d) for d in update_data["facts"]]

        if update_data.get("job_expectations"):
            db_obj.job_expectations = [
                models.Expectations(description=d)
                for d in update_data["job_expectations"]
            ]

        if update_data.get("roles"):
            db_obj.roles = [models.Roles(description=d) for d in update_data["roles"]]

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> models.User:
        obj = db.query(self.model).get(id)

        if obj.avatar:
            self.delete_file_from_os(obj.avatar.original_path)
            self.delete_file_from_os(obj.avatar.thubmail_path)

        db.delete(obj)
        db.commit()
        return obj


user = CRUDUser(models.User)
