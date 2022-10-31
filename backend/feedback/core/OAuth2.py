import secrets
from feedback.core.config import settings
from httpx_oauth.oauth2 import OAuth2, GetAccessTokenError
import base64
import json
from typing import Any


class RequestError(Exception):
    """Error raised when recieving a request from provider API."""

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

    def create_state(self) -> str:
        return secrets.token_urlsafe(32)

    async def get_access_token(self, code: str) -> dict[str, Any]:
        token = await super().get_access_token(code, self.callback_url)

        if not "openid" in self.base_scopes:
            return token

        id_token = token.get("id_token")
        encoded_token_payload = id_token.split(".")[1]
        try:
            token_payload = base64.b64decode(
                bytes(encoded_token_payload, "utf-8") + b"=="
            ).decode("utf-8")
        except Exception:
            raise GetAccessTokenError("Error when decoding token id")

        token["userinfo"] = json.loads(token_payload)
        return token

    async def get(self, endpoint: str, token: str) -> dict[str, Any]:
        async with self.get_httpx_client() as client:
            response = await client.get(
                self.api_url + endpoint,
                headers={**self.request_headers, "Authorization": f"Bearer {token}"},
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
