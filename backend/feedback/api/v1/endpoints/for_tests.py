from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from feedback import crud, schemas
from feedback.api.deps import get_db
from feedback.api.v1.endpoints.auth import create_token, set_cookie
from feedback.core.config import settings

router = APIRouter()


@router.post("/give-user-role/{user_id}", response_model=schemas.User)
async def FOR_TESTS_give_user_roles(
    user_id: int,
    roles: list[Literal["admin", "manager", "boss", "hr", "employee", "trainee"]],
    db: Session = Depends(get_db),
) -> schemas.User:
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")
    upd = schemas.UserUpdate(roles=roles)
    updated_user = crud.user.update(db=db, db_obj=user, obj_in=upd)
    return updated_user


@router.get("/login-as/{user_id}")
async def FOR_TESTS_login_as_different_user(
    user_id: int, db: Session = Depends(get_db)
):
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_token(user)
    refresh_token = create_token(
        user, expires_in_minutes=settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES
    )
    response = Response(status_code=204)
    set_cookie(response, "access-token", str(token))
    set_cookie(
        response,
        "refresh-token",
        str(refresh_token),
        max_age=settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES,
    )
    return response
