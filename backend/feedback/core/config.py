from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl, BaseSettings, Field, validator

ENV_FILE_DIR = Path(__file__).absolute().parent.parent.parent


class Settings(BaseSettings):
    # App
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "DEBUG"
    APP_PORT: int = 8000  # Current
    APP_HOST: str = "localhost"  # Current
    SECRET_KEY: str
    FRONTEND_URL: AnyHttpUrl = Field("http://localhost:3000")  # Gloabl url
    BACKEND_URL: AnyHttpUrl = "http://localhost:8000"  # Global url
    CORS_ORIGINS: list[AnyHttpUrl]
    CHECK_FEEDBACK_IN_SECONDS: int = (
        10  # Check and update feedback status every _ secods
    )

    # Jwt
    REFRESH_TOKEN_EXPIRES_IN_SECONDS: int = 60 * 60 * 720  # 30 days
    ACCESS_TOKEN_EXPIRES_IN_SECONDS: int = 60 * 60 * 2  # 2 hours

    # Errors Monitoring
    SENTRY_DSN: AnyHttpUrl | None = "https://f166f9262c3d4138be4f47962a16a4bb@o4504875728764928.ingest.sentry.io/4504875737546752"

    # Gitlab Auth
    GITLAB_CLIENT_ID: str
    GITLAB_CLIENT_SECRET: str
    GITLAB_HOST_URL: AnyHttpUrl = "https://git.66bit.ru"
    GITLAB_SCOPES: list[str] = ["openid", "read_user", "profile", "email"]

    GITLAB_AUTHORIZE_URL: AnyHttpUrl = GITLAB_HOST_URL + "/oauth/authorize"
    GITLAB_TOKEN_URL: AnyHttpUrl = GITLAB_HOST_URL + "/oauth/token"
    GITLAB_API_URL: AnyHttpUrl = GITLAB_HOST_URL + "/api/v4/"
    GITLAB_CALLBACK_URL: AnyHttpUrl = ""

    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    @validator("GITLAB_CALLBACK_URL", pre=True)
    def assemble_callback_url(cls, v: str, values: dict) -> str:
        backend_url: str = values.get("BACKEND_URL")
        backend_url = backend_url.strip("/")
        return f"{backend_url}/auth/authorize-gitlab"

    class Config:
        case_sensitive = (True,)
        env_file = ENV_FILE_DIR / ".env"


settings = Settings()
