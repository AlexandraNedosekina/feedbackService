from datetime import datetime

from pydantic import BaseModel


class OAuthTokenData(BaseModel):
    iss: str
    sub: str
    aud: str
    exp: datetime
    iat: datetime
    auth_time: datetime
    sub_legacy: str
    email: str
    email_verified: bool
    groups_direct: list


class OAuthUserInfo(BaseModel):
    username: str
    name: str
    email: str
    # Не вся информация которую получаем


class OAuthToken(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    created_at: datetime
    id_token: str
    userinfo: OAuthTokenData
