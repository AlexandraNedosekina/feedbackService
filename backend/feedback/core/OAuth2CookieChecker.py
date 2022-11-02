import typing

import fastapi
import starlette
from fastapi import HTTPException
from fastapi.security.utils import get_authorization_scheme_param


class OAuth2PasswordBearerWithCookie(fastapi.security.OAuth2):
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: str = None,
        scopes: dict = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = fastapi.openapi.models.OAuthFlows(
            password={"tokenUrl": tokenUrl, "scopes": scopes}
        )
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(
        self, request: starlette.requests.Request
    ) -> typing.Optional[str]:
        cookie_authorization: str = request.cookies.get("access-token")
        cookie_scheme, cookie_param = get_authorization_scheme_param(
            cookie_authorization
        )

        if cookie_scheme.lower() == "bearer":
            authorization = True
            scheme = cookie_scheme
            param = cookie_param
        else:
            authorization = False

        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(
                    status_code=starlette.status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                return None
        return param
