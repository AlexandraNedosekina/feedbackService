import datetime

from fastapi import (APIRouter, Depends, HTTPException, Request, Response,
                     responses)
from fastapi.responses import RedirectResponse
from httpx_oauth.oauth2 import GetAccessTokenError
from sqlalchemy.orm import Session

from feedback import crud, models, schemas
from feedback.api.deps import get_current_user, get_db
from feedback.core import jwt
from feedback.core.config import settings
from feedback.core.OAuth2 import RequestError, gitlab

router = APIRouter()


async def register_user(token: schemas.OAuthToken, db: Session) -> models.User | None:
    try:
        user_data = await gitlab.get("user", access_token=token.access_token)
        user_data = schemas.OAuthUserInfo(**user_data)
    except RequestError:
        return None

    user_create_schema = schemas.UserCreate(
        email=user_data.email, full_name=user_data.name
    )
    db_user = crud.user.create(db, obj_in=user_create_schema)
    return db_user


def set_cookie(
    r: Response,
    key: str,
    val: str,
    domain: str = settings.APP_HOST,
    max_age: int = 60 * 60 * 2,
):
    r.set_cookie(key=key, domain=domain, value=val, max_age=max_age)
    return r


def create_token(
    user: models.User,
    expires_in_minutes: int = settings.ACCESS_TOKEN_EXPIRES_IN_MINUTES,
):
    token_payload = jwt.TokenPayload(
        sub=user.id,
        email=user.email,
        name=user.full_name,
        roles=[r.description for r in user.roles],
    )

    token = jwt.Token(
        access_token=jwt.create_access_token(
            token_payload, expires_delta=datetime.timedelta(minutes=expires_in_minutes)
        ),
        token_type="Bearer",
    )
    return token


@router.get("/signin-gitlab")
async def signin_gitlab(request: Request):
    state = gitlab.create_state()
    request.session["state"] = state
    authorize_url = await gitlab.get_authorization_url(gitlab.callback_url, state)
    return {"authorize_url": authorize_url}


@router.get("/authorize-gitlab")
async def authorize_gitlab(
    code: str,
    state: str,
    request: Request,
    db: Session = Depends(get_db),
) -> Response:
    if state != request.session.get("state"):
        raise HTTPException(
            status_code=401, detail="Error authorizing with gitlab. State mismatch"
        )
    if not code:
        raise HTTPException(
            status_code=401, detail="Error authorizing with gitlab. No code provided"
        )
    request.session.pop("state", None)

    try:
        token = await gitlab.get_access_token(code)
    except GetAccessTokenError:
        raise HTTPException(status_code=502, detail="Invalid code")
    user = crud.user.get_by_email(db, email=token.userinfo.email)
    if not user:
        user = await register_user(token, db)
        if not user:
            raise HTTPException(status_code=500, detail="Error when creating user")

    token = create_token(user)
    refresh_token = create_token(
        user, expires_in_minutes=settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES
    )
    response = RedirectResponse("http://localhost:3000", status_code=302)
    set_cookie(response, "access-token", str(token))
    set_cookie(
        response,
        "refresh-token",
        str(refresh_token),
        max_age=settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES,
    )
    return response


@router.get("/refresh")
async def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token_request = request.cookies.get("refresh-token")

    if not refresh_token_request:
        raise HTTPException(status_code=400, detail="No refresh token provided")

    refresh_token = refresh_token_request.split(" ")
    if not len(refresh_token) > 1:
        raise HTTPException(status_code=400, detail="Invalid token")
    refresh_token = refresh_token[1]

    refresh_token_payload = jwt.decode_token(refresh_token)
    user = crud.user.get(db, refresh_token_payload.sub)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    token = create_token(user)
    refresh_token = create_token(
        user, expires_in_minutes=settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES
    )
    set_cookie(response, "access-token", str(token))
    set_cookie(
        response,
        "refresh-token",
        str(refresh_token),
        max_age=settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES,
    )
    response.status_code = 200
    return response


@router.get("/signout")
async def logout(response: Response, _: models.User = Depends(get_current_user)):
    response.delete_cookie("access-token")
    response.delete_cookie("refresh-token")
    response.status_code = 200
    return response
