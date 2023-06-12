from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import GetUserWithRoles, get_current_user, get_db, is_allowed

get_admin = GetUserWithRoles(["admin"])
router = APIRouter()


@router.get("/me", response_model=schemas.User)
async def get_currnet_user_info(
    curr_user: models.User = Depends(get_current_user),
) -> schemas.User:
    return curr_user


# Admin method
@router.post("/", response_model=schemas.User)
async def create_user(
    user_create: schemas.UserCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin),
) -> schemas.User:
    if _ := crud.user.get_by_email(db, email=user_create.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует",
        )
    created_user = crud.user.create(db=db, obj_in=user_create)
    return created_user


@router.get("/", response_model=list[schemas.User])
async def get_all_users(
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
    *,
    skip: int = 0,
    limit: int = 100,
) -> list[schemas.User]:
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    return parse_obj_as(list[schemas.User], users)


@router.get("/{user_id}", response_model=schemas.User)
async def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
) -> schemas.User:
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )
    return user


@router.patch("/{user_id}", response_model=schemas.User)
async def update_user(
    user_update: schemas.UserUpdate,
    user_id: int,
    db: Session = Depends(get_db),
    curr_user: models.User = Depends(get_current_user),
) -> schemas.User:
    """
    Updates user.
    User without "admin" role can update everythig except job_title, email, roles, full_name
    """
    upd = user_update.dict(exclude_unset=True, exclude_none=True)
    upd_schemas_roles = (
        (schemas.UserUpdateSelf, ["self", "boss", "admin"]),
        (schemas.UserUpdateOther, ["boss", "admin"]),
        (schemas.UserUpdate, ["admin"]),
    )
    upd_keys = list(upd.keys())

    # Проверяю какие поля изменяются, если это обычный пользователь
    # то в нем не должно быть полей из полей для админа и тд.
    # если поле прошло проверку то убираю его (тк иначе оно не пройдет схему админа, где все поля)
    for s_r in upd_schemas_roles:
        for k in s_r[0].__fields__.keys():
            if k in upd_keys and not is_allowed(curr_user, user_id, s_r[1]):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав"
                )
            if k in upd_keys:
                upd_keys.remove(k)

    # Только админ может установить роль админа
    if not is_allowed(curr_user, user_id, ["admin"]) and "admin" in upd.get(
        "roles", []
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав"
        )

    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )

    updated_user = crud.user.update(db=db, db_obj=user, obj_in=user_update)
    return updated_user


# Admin method
@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(get_admin),
):
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )
    _ = crud.user.remove(db, id=user_id)
    return Response(status_code=204)
