from jose import jwt
from datetime import datetime, timedelta
from feedback.core.config import settings
from pydantic import BaseModel, ValidationError
from fastapi import HTTPException

ALGORITHM = "HS256"
JWT_EXPIRE_IN_MINUTES = 120


class Token(BaseModel):
    access_token: str
    token_type: str

    def __str__(self):
        return f"{self.token_type} {self.access_token}"


class TokenPayload(BaseModel):
    sub: str
    email: str
    name: str
    roles: list[str]


def create_access_token(payload: TokenPayload, expires_delta: timedelta = None) -> str:
    to_encode = payload.dict()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_IN_MINUTES)

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> TokenPayload | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        return None
    return token_data
