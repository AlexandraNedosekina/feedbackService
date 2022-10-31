from httpx_oauth.oauth2 import GetAccessTokenError
from feedback.core.OAuth2 import gitlab, RequestError
from fastapi import APIRouter, Request, HTTPException, Response
from fastapi.responses import RedirectResponse
from feedback.core import jwt
from feedback.db.database import db

router = APIRouter()


async def register_user(token):
    try:
        user_data = await gitlab.get("user", token=token["access_token"])
    except RequestError:
        return None
    # Пример данных
    # {'id': 240, 'username': 'andreya', 'name': 'Andrey Andreev', 'state': 'active', 'avatar_url': 'https://secure.gravatar.com/avatar/112a93549ef349c4d107412a2a58fc38?s=80&d=identicon', 'web_url': 'https://git.66bit.ru/andreya', 'created_at': '2022-10-08T19:26:23.428Z', 'bio': '', 'location': None, 'public_email': None, 'skype': '', 'linkedin': '', 'twitter': '', 'website_url': '', 'organization': None, 'job_title': '', 'pronouns': None, 'bot': False, 'work_information': None, 'followers': 0, 'following': 0, 'is_followed': False, 'local_time': None, 'last_sign_in_at': '2022-10-23T18:08:13.563Z', 'confirmed_at': '2022-10-08T19:26:23.368Z', 'last_activity_on': '2022-10-24', 'email': 'andreya@gmail.com', 'theme_id': 1, 'color_scheme_id': 1, 'projects_limit': 0, 'current_sign_in_at': '2022-10-24T12:38:26.389Z', 'identities': [], 'can_create_group': False, 'can_create_project': False, 'two_factor_enabled': False, 'external': True, 'private_profile': False, 'commit_email': 'andreya@gmail.com'}

    db[user_data["email"]] = {
        "email": user_data["email"],
        "username": user_data["username"],
        "full_name": user_data["name"],
    }
    return db[user_data["email"]]


@router.get("/signin-gitlab")
async def signin_gitlab(request: Request):
    state = gitlab.create_state()
    request.session["state"] = state
    authorize_url = await gitlab.get_authorization_url(gitlab.callback_url, state)
    return RedirectResponse(authorize_url)


@router.get("/authorize-gitlab")
async def authorize_gitlab(
    code: str, state: str, request: Request, response: Response
) -> HTTPException | jwt.Token:
    if state != request.session.get("state"):
        return HTTPException(status_code=401, detail="State does not match.")
    if not code:
        return HTTPException(status_code=401, detail="No code")

    try:
        token = await gitlab.get_access_token(code)
    except GetAccessTokenError:
        return HTTPException(status_code=502, detail="Gitlab error")

    user = db.get(token.get("userinfo").get("email"))
    if not user:
        user = await register_user(token)
        if not user:
            return HTTPException(status_code=500, detail="Error when creating user")
    request.session.pop("state", None)

    token_payload = jwt.TokenPayload(
        sub="id", email=user["email"], name="name", roles=["Manager", "Employee"]
    )
    jwt_token = jwt.Token(
        access_token=jwt.create_access_token(token_payload), token_type="Bearer"
    )
    response.set_cookie(
        "access-token",
        value=str(jwt_token),
        domain="localhost",
        max_age=60 * 60 * 2,  # 2 hours
    )
    return jwt_token
