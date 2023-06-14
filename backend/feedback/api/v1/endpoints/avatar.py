import os

import aiofiles
from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Response,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from PIL import Image
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import get_current_user, get_db, is_allowed
from feedback.core.config import settings

AVATARS_BASE_DIR = "avatars/"
ORIGINALS_DIR = AVATARS_BASE_DIR + "originals/"
THUMBNAILS_DIR = AVATARS_BASE_DIR + "thumbnails/"

MAX_FILE_SIZE_IN_MB = 5
ACCEPTED_IMAGE_EXTENSIONS = ("jpg", "jpeg", "png")


router = APIRouter()


@router.post("/{user_id}/avatar")
async def create_avater(
    user_id: int,
    file: UploadFile = File(...),
    avatar_create: schemas.AvatarCreate = Depends(schemas.AvatarCreate.as_form),
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
):
    if not is_allowed(curr_user, user_id, ["self", "admin"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав"
        )
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )

    if not os.path.exists(AVATARS_BASE_DIR):
        os.mkdir(AVATARS_BASE_DIR)
        os.mkdir(ORIGINALS_DIR)
        os.mkdir(THUMBNAILS_DIR)

    image_extension = file.filename.split(".")[-1].lower()
    if image_extension not in ACCEPTED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSIPPORTED_MEDIA_TYPE,
            detail="Расширение файла не поддерживается",
        )

    original_path = f"{ORIGINALS_DIR}{user.id}.{image_extension}"
    thumbnail_path = f"{THUMBNAILS_DIR}{user.id}.{image_extension}"
    content = await file.read()
    await file.close()
    if len(content) / 1024**2 > MAX_FILE_SIZE_IN_MB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Файл не может превышать {MAX_FILE_SIZE_IN_MB} Мб",
        )

    if curr_user.avatar:
        os.remove(curr_user.avatar.original_path)
        os.remove(curr_user.avatar.thumbnail_path)

    async with aiofiles.open(original_path, "wb") as f:
        await f.write(content)

    try:
        result = create_thumbnail(avatar_create, thumbnail_path, original_path)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка при создании аватара",
        )

    if not result:
        os.remove(original_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=" Bad params for thumbnail"
        )

    crud.avatar.create(
        db,
        user=user,
        op=original_path,
        tp=thumbnail_path,
        obj_in=avatar_create,
        url=settings.BACKEND_URL,
    )
    return Response(status_code=201)


@router.put("/{user_id}/avatar")
async def update_avatar(
    user_id: int,
    avatar_update: schemas.AvatarUpdate,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
):
    if not is_allowed(curr_user, user_id, ["self", "admin"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав"
        )
    user = crud.user.get(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )
    if not user.avatar or not user.avatar.original_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="У пользователя нет аватара"
        )

    image_extension = user.avatar.original_path.split(".")[-1]
    thumbnail_path = f"{THUMBNAILS_DIR}{user.id}.{image_extension}"

    try:
        result = create_thumbnail(
            avatar_update, thumbnail_path, user.avatar.original_path
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка создания аватара",
        )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверные данные для аватара",
        )

    crud.avatar.update(
        db,
        user=user,
        thumbnail_path=thumbnail_path,
        obj_in=avatar_update,
    )
    return Response(status_code=200)


@router.delete("/{user_id}/avatar")
async def delete_avatar(
    user_id: int,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
):
    if not is_allowed(curr_user, user_id, ["self", "admin"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Недостаточно прав"
        )

    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )

    if not user.avatar:
        return Response(status_code=status.HTTP_200_OK)

    _ = crud.avatar.remove(db, id=user.avatar.id)
    return Response(status_code=status.HTTP_200_OK)


@router.get("/{user_id}/avatar")
async def get_thumbnail(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )

    if not user.avatar:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="У пользователя нет аватара"
        )

    avatar = user.avatar
    if not os.path.exists(avatar.thumbnail_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="У пользователя нет аватара"
        )
    return FileResponse(avatar.thumbnail_path)


@router.get("/{user_id}/avatar/original")
async def get_original(
    user_id: int,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
):
    if not is_allowed(curr_user, user_id, ["self", "admin"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Недостаточно прав"
        )

    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )

    if not user.avatar:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="У пользователя нет аватара"
        )

    avatar = user.avatar
    if not os.path.exists(avatar.original_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="У пользователя нет аватара"
        )
    return FileResponse(avatar.original_path)


def create_thumbnail(
    options: schemas.AvatarCreate | schemas.AvatarUpdate,
    thumbnail_path: str,
    original_path: str,
) -> bool:
    img = Image.open(original_path)
    img_w, img_h = img.size
    x = options.x
    y = options.y
    w = options.width
    h = options.height

    if x < 0 or y < 0 or w < 0 or h < 0:
        return False

    if x + w > img_w or y + h > img_h:
        return False

    thumbnail = img.crop((x, y, x + w, y + h))
    thumbnail.save(thumbnail_path)
    img.close()
    return True
