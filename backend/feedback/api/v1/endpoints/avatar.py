from pathlib import Path

import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from fastapi.responses import FileResponse
from PIL import Image
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import get_current_user, get_db, is_allowed

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
        raise HTTPException(status_code=401, detail="Not enough permissions")
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not Path(ORIGINALS_DIR).exists() or not Path(THUMBNAILS_DIR).exists():
        Path(ORIGINALS_DIR).mkdir(parents=True, exist_ok=True)
        Path(THUMBNAILS_DIR).mkdir(parents=True, exist_ok=True)

    image_extension = file.filename.split(".")[-1].lower()
    if image_extension not in ACCEPTED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=415, detail="File extention not supported")

    original_path = f"{ORIGINALS_DIR}{user.id}.{image_extension}"
    thumbnail_path = f"{THUMBNAILS_DIR}{user.id}.{image_extension}"
    content = await file.read()
    await file.close()
    if len(content) / 1024**2 > MAX_FILE_SIZE_IN_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File size can not be more than {MAX_FILE_SIZE_IN_MB} MB",
        )

    if curr_user.avatar:
        Path(curr_user.avatar.original_path).unlink(missing_ok=True)
        Path(curr_user.avatar.thumbnail_path).unlink(missing_ok=True)

    async with aiofiles.open(original_path, "wb") as f:
        await f.write(content)

    try:
        result = create_thumbnail(avatar_create, thumbnail_path, original_path)
    except Exception:
        raise HTTPException(status_code=500, detail="Error when creating thumbnail")

    if not result:
        Path(original_path).unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="Bad params for thumbnail")

    crud.avatar.create(
        db, user=user, op=original_path, tp=thumbnail_path, obj_in=avatar_create
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
        raise HTTPException(status_code=401, detail="Not enough permissions")
    user = crud.user.get(db, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.avatar or not user.avatar.original_path:
        raise HTTPException(status_code=404, detail="User does not have avatar")

    image_extension = user.avatar.original_path.split(".")[-1]
    thumbnail_path = f"{THUMBNAILS_DIR}{user.id}.{image_extension}"

    try:
        result = create_thumbnail(
            avatar_update, thumbnail_path, user.avatar.original_path
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Error when creating thumbnail")

    if not result:
        raise HTTPException(status_code=400, detail="Bad params for thumbnail")

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
        raise HTTPException(status_code=401, detail="Not enough permissions")

    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.avatar:
        return Response(status_code=200)

    _ = crud.avatar.remove(db, id=user.avatar.id)
    return Response(status_code=200)


@router.get("/{user_id}/avatar")
async def get_thumbnail(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.avatar:
        raise HTTPException(status_code=404, detail="User does not have avatar")

    avatar = user.avatar
    if not Path(avatar.thumbnail_path).exists():
        raise HTTPException(status_code=404, detail="Can not find avatar")
    return FileResponse(avatar.thumbnail_path)


@router.get("/{user_id}/avatar/original")
async def get_original(
    user_id: int,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
):
    if not is_allowed(curr_user, user_id, ["self", "admin"]):
        raise HTTPException(status_code=401, detail="Not enough permissions")

    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.avatar:
        raise HTTPException(status_code=404, detail="User does not have avatar")

    avatar = user.avatar
    if not Path(avatar.original_path).exists():
        raise HTTPException(status_code=404, detail="Can not find avatar")
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
