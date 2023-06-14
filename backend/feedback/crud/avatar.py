from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from feedback import models, schemas
from feedback.core.config import settings
from feedback.crud.base import CRUDBase


class CRUDAvatar(CRUDBase[models.Avatars, schemas.AvatarCreate, schemas.AvatarUpdate]):
    def create(
        self,
        db: Session,
        *,
        user: models.User,
        obj_in: schemas.AvatarCreate,
        op: str,
        tp: str,
        url: str,
    ) -> models.Avatars:
        if url.endswith("/"):
            url = url.strip("/")

        user.avatar = models.Avatars(
            original_path=op,
            thumbnail_path=tp,
            x=obj_in.x,
            y=obj_in.y,
            width=obj_in.width,
            height=obj_in.height,
            thumbnail_url=f"{url}/user/{user.id}/avatar",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user.avatar

    def update(
        self,
        db: Session,
        *,
        user: models.User,
        obj_in: schemas.AvatarUpdate,
        thumbnail_path: str,
    ) -> models.Avatars:
        obj_data = jsonable_encoder(user.avatar)
        update_data = obj_in.dict(exclude_unset=True)

        for field in obj_data:
            if field in update_data:
                setattr(user.avatar, field, update_data[field])
        user.avatar.thumbnail_path = thumbnail_path

        db.add(user)
        db.commit()
        db.refresh(user)
        return user.avatar

    def remove(self, db: Session, *, id: int) -> models.Avatars:
        obj = db.query(self.model).get(id)

        self.delete_file_from_os(obj.original_path)
        self.delete_file_from_os(obj.thumbnail_path)

        db.delete(obj)
        db.commit()
        return obj


avatar = CRUDAvatar(models.Avatars)
