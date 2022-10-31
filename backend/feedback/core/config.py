from pydantic import BaseSettings
from pathlib import Path

ENV_FILE_DIR = Path(__file__).absolute().parent.parent.parent


class Settings(BaseSettings):
    APP_PORT: int = 8000
    APP_HOST: str = "localhost"
    SECRET_KEY: str

    GITLAB_CLIENT_ID: str
    GITLAB_CLIENT_SECRET: str
    GITLAB_HOST_URL: str = "https://git.66bit.ru/"
    GITLAB_SCOPES: list[str] = ["openid", "read_user", "profile", "email"]

    GITLAB_AUTHORIZE_URL: str = GITLAB_HOST_URL + "oauth/authorize"
    GITLAB_TOKEN_URL: str = GITLAB_HOST_URL + "oauth/token"
    GITLAB_API_URL: str = GITLAB_HOST_URL + "api/v4/"
    GITLAB_CALLBACK_URL: str = "http://localhost:8000/auth/authorize-gitlab"

    class Config:
        case_sensitive = (True,)
        env_file = ENV_FILE_DIR / ".env"


settings = Settings()
