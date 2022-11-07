from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from feedback.core.config import settings

from feedback import models, schemas
from feedback.crud.base import CRUDBase


class CRUDAvatar(CRUDBase[models.Avatars, schemas.AvatarCreate, schemas.AvatarUpdate]):
    def create(
        self,
        db: Session,
        *,
        user: models.User,
        op: str,
        tp: str,
    ) -> models.Avatars:
        user.avatar = models.Avatars(
            original_path=op,
            thumbnail_path=tp,
            thumbnail_url=f'http://{settings.APP_HOST}:{settings.APP_PORT}/user/{user.id}/avatar'
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
        thumbnail_path: str
    ) -> models.Avatars:

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
