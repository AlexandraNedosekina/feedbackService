import base64
import json
import secrets
from typing import Any

from httpx_oauth.oauth2 import GetAccessTokenError, OAuth2

from feedback import schemas
from feedback.core.config import settings


class RequestError(Exception):
    """Error raised when receiving a request from provider API."""

    pass


class GitlabOauth(OAuth2):
    def __init__(
        self,
        client_id: str,
        client_secret: str,
        authorize_url: str,
        token_url: str,
        callback_url: str,
        api_url: str,
        scopes: list[str],
    ):
        super().__init__(
            client_id, client_secret, authorize_url, token_url, base_scopes=scopes
        )
        self.callback_url = callback_url
        self.api_url = api_url

    @staticmethod
    def create_state() -> str:
        return secrets.token_urlsafe(32)

    async def get_access_token(self, code: str) -> schemas.OAuthToken:
        token = await super().get_access_token(code, self.callback_url)

        if "openid" not in self.base_scopes:
            return token

        id_token = token.get("id_token")
        encoded_token_payload = id_token.split(".")[1]
        try:
            token_payload = base64.b64decode(
                bytes(encoded_token_payload, "utf-8") + b"=="
            ).decode("utf-8")
        except Exception:
            raise GetAccessTokenError("Error when decoding token id")

        userinfo = schemas.OAuthTokenData(**json.loads(token_payload))
        return schemas.OAuthToken(**token, userinfo=userinfo)

    async def get(self, endpoint: str, access_token: str) -> dict[str, Any]:
        async with self.get_httpx_client() as client:
            response = await client.get(
                self.api_url + endpoint,
                headers={
                    **self.request_headers,
                    "Authorization": f"Bearer {access_token}",
                },
            )
            if response.status_code >= 400:
                raise RequestError(response.json())
            return response.json()


gitlab = GitlabOauth(
    settings.GITLAB_CLIENT_ID,
    settings.GITLAB_CLIENT_SECRET,
    settings.GITLAB_AUTHORIZE_URL,
    settings.GITLAB_TOKEN_URL,
    settings.GITLAB_CALLBACK_URL,
    settings.GITLAB_API_URL,
    settings.GITLAB_SCOPES,
)
