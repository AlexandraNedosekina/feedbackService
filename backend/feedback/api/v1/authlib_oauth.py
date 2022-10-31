import fastapi

from feedback.core.config import settings
from fastapi import APIRouter, HTTPException, Request, Response
from authlib.integrations.starlette_client import OAuth, OAuthError
from feedback.core import jwt
from feedback.db.database import db
from feedback.core.OAuth2CookieChecker import get_current_user

router = APIRouter()

GITLAB_BASE_URL = "https://git.66bit.ru/"
GITLAB_BASE_API_URL = f"{GITLAB_BASE_URL}api/v4/"
GITLAB_AUTHORIZE_URL = f"{GITLAB_BASE_URL}oauth/authorize"
GITLAB_ACCESS_TOKEN_URL = f"{GITLAB_BASE_URL}oauth/token"
GITLAB_SCOPES = ["openid", "read_user", "profile", "email"]
GITLAB_OIDC_SCHEME_URL = (
    "http://localhost:8000/auth/openid-configuration"  # Change if 66bit have this
)

oauth = OAuth()
oauth.register(
    name="gitlab",
    client_id=settings.GITLAB_CLIENT_ID,
    client_secret=settings.GITLAB_CLIENT_SECRET,
    access_token_url=GITLAB_ACCESS_TOKEN_URL,
    authorize_url=GITLAB_AUTHORIZE_URL,
    api_base_url=GITLAB_BASE_API_URL,
    client_kwargs={"scope": " ".join(GITLAB_SCOPES)},
    server_metadata_url=GITLAB_OIDC_SCHEME_URL,
)


@router.get("/signin-gitlab")
async def signin(request: Request):
    request.session.pop("user", None)
    gitlab = oauth.gitlab
    return await gitlab.authorize_redirect(
        request, "http://localhost:8000/auth/authorize-gitlab"
    )


@router.get("/authorize-gitlab")
async def authorize(request: Request, response: Response) -> jwt.Token | HTTPException:
    gitlab = oauth.gitlab
    try:
        token = await gitlab.authorize_access_token(request)
    except OAuthError as e:
        print(e)
        return HTTPException(
            status_code=401, detail="State missmatched or request error"
        )

    user = dict(token.get("userinfo"))
    if not user:
        return HTTPException(status_code=401, detail="Could not get userinfo")

    db_user = db.get(user["email"])
    if not db_user:
        await register_user(token)

    # Create jwt
    request.session.pop("user", None)
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


async def register_user(token):
    resp = await oauth.gitlab.get("user", token=token)
    resp.raise_for_status()
    user_data = resp.json()
    # Пример данных
    # {'id': 240, 'username': 'andreya', 'name': 'Andrey Andreev', 'state': 'active', 'avatar_url': 'https://secure.gravatar.com/avatar/112a93549ef349c4d107412a2a58fc38?s=80&d=identicon', 'web_url': 'https://git.66bit.ru/andreya', 'created_at': '2022-10-08T19:26:23.428Z', 'bio': '', 'location': None, 'public_email': None, 'skype': '', 'linkedin': '', 'twitter': '', 'website_url': '', 'organization': None, 'job_title': '', 'pronouns': None, 'bot': False, 'work_information': None, 'followers': 0, 'following': 0, 'is_followed': False, 'local_time': None, 'last_sign_in_at': '2022-10-23T18:08:13.563Z', 'confirmed_at': '2022-10-08T19:26:23.368Z', 'last_activity_on': '2022-10-24', 'email': 'andreya@gmail.com', 'theme_id': 1, 'color_scheme_id': 1, 'projects_limit': 0, 'current_sign_in_at': '2022-10-24T12:38:26.389Z', 'identities': [], 'can_create_group': False, 'can_create_project': False, 'two_factor_enabled': False, 'external': True, 'private_profile': False, 'commit_email': 'andreya@gmail.com'}

    db[user_data["email"]] = {
        "email": user_data["email"],
        "username": user_data["username"],
        "full_name": user_data["name"],
    }


@router.get("/me")
async def get_cur_user(user=fastapi.Depends(get_current_user)):
    return user


@router.get("/openid-configuration")
async def openid_configuration():
    return {
        "issuer": "https://git.66bit.ru",
        "authorization_endpoint": "https://git.66bit.ru/oauth/authorize",
        "token_endpoint": "https://git.66bit.ru/oauth/token",
        "revocation_endpoint": "https://git.66bit.ru/oauth/revoke",
        "introspection_endpoint": "https:///git.66bit.ru/oauth/introspect",
        "userinfo_endpoint": "https://git.66bit.ru/oauth/userinfo",
        "jwks_uri": "https://git.66bit.ru/oauth/discovery/keys",
        "scopes_supported": [
            "api",
            "read_api",
            "read_user",
            "read_repository",
            "write_repository",
            "read_registry",
            "write_registry",
            "sudo",
            "openid",
            "profile",
            "email",
        ],
        "response_types_supported": ["code"],
        "response_modes_supported": ["query", "fragment"],
        "grant_types_supported": [
            "authorization_code",
            "password",
            "client_credentials",
            "refresh_token",
        ],
        "token_endpoint_auth_methods_supported": [
            "client_secret_basic",
            "client_secret_post",
        ],
        "subject_types_supported": ["public"],
        "id_token_signing_alg_values_supported": ["RS256"],
        "claim_types_supported": ["normal"],
        "claims_supported": [
            "iss",
            "sub",
            "aud",
            "exp",
            "iat",
            "sub_legacy",
            "name",
            "nickname",
            "email",
            "email_verified",
            "website",
            "profile",
            "picture",
            "groups",
            "groups_direct",
            "https://git.66bit.ru/claims/groups/owner",
            "https://git.66bit.ru/claims/groups/maintainer",
            "https://git.66bit.ru/claims/groups/developer",
        ],
    }
