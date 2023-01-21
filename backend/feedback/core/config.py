from pathlib import Path
from typing import Any

from pydantic import AnyUrl, BaseSettings, Field, PostgresDsn, validator

ENV_FILE_DIR = Path(__file__).absolute().parent.parent.parent


class Settings(BaseSettings):
    # App
    APP_PORT: int = 8000
    APP_HOST: str = "localhost"
    SECRET_KEY: str = Field(...)
    CORS_ORIGINS: set[AnyUrl] = {"http://localhost:3000", "http://localhost:8000"}

    # JWT
    REFRESH_TOKEN_EXPIRES_IN_MINUTES: int = 60 * 60 * 720  # 30 days
    ACCESS_TOKEN_EXPIRES_IN_MINUTES: int = 60 * 60 * 2  # 2 hours

    # Gitlab Auth
    GITLAB_CLIENT_ID: str = Field(...)
    GITLAB_CLIENT_SECRET: str = Field(...)
    GITLAB_HOST_URL: str = "https://git.66bit.ru/"
    GITLAB_SCOPES: list[str] = ["openid", "read_user", "profile", "email"]

    GITLAB_AUTHORIZE_URL: str = GITLAB_HOST_URL + "oauth/authorize"
    GITLAB_TOKEN_URL: str = GITLAB_HOST_URL + "oauth/token"
    GITLAB_API_URL: str = GITLAB_HOST_URL + "api/v4/"
    GITLAB_CALLBACK_URL: str = "http://localhost:8000/auth/authorize-gitlab"

    # Database
    DATABASE_USER: str = Field(...)
    DATABASE_PASSWORD: str = Field(...)
    DATABASE_HOST: str = Field(...)
    DATABASE_PORT: int = Field(...)
    DATABASE_NAME: str = Field(...)
    SQLALCHEMY_DATABASE_URI: PostgresDsn | None = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: str, values: dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+psycopg2",
            user=values.get("DATABASE_USER"),
            password=values.get("DATABASE_PASSWORD"),
            host=f'{values.get("DATABASE_HOST")}:{values.get("DATABASE_PORT")}',
            path=f"/{values.get('DATABASE_NAME') or ''}",
        )

    class Config:
        case_sensitive = (True,)
        env_file = ENV_FILE_DIR / ".env"
        env_file_encoding = "utf-8"


settings = Settings(_env_file=None)
