from typing import AsyncGenerator, Callable, Literal

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from feedback import crud, models
from feedback.core.jwt import decode_token
from feedback.core.OAuth2CookieChecker import OAuth2PasswordBearerWithCookie
from feedback.db.session import SessionLocal

oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="auth/signin-gitlab")


async def get_db() -> AsyncGenerator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> models.User:
    token_payload = decode_token(token)
    user = crud.user.get_by_email(db, email=token_payload.email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


class GetUserWithRoles:
    def __init__(self, permitted_roles: list[str]):
        self.roles = permitted_roles

    def __call__(
        self, current_user: models.User = Depends(get_current_user)
    ) -> models.User:
        current_user_roles = current_user.get_roles
        for role in current_user_roles:
            if role in self.roles:
                return current_user
        raise HTTPException(status_code=401, detail="Not enough permissions")


def is_allowed(
    current_user: models.User,
    target_user_id: int | None,
    permitted_roles: list[
        Literal[
            "HR", "manager", "employee", "trainee", "boss", "mentor", "self", "admin"
        ]
    ],
) -> bool:
    current_user_roles = current_user.get_roles

    for role in current_user_roles:
        if role in permitted_roles:
            return True

    if "self" in permitted_roles and target_user_id:
        if current_user.id == target_user_id:
            return True
    return False
