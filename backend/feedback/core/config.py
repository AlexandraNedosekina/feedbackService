from pathlib import Path

from pydantic import BaseSettings

ENV_FILE_DIR = Path(__file__).absolute().parent.parent.parent


class Settings(BaseSettings):
    APP_PORT: int = 8000  # Current
    APP_HOST: str = "localhost"  # Current
    SECRET_KEY: str

    FRONTEND_URL: str = "http://localhost:3000"  # Gloabl url
    BACKEND_URL: str = "http://localhost:8000"  # Global url

    CORS_ORIGINS: list[str] = [FRONTEND_URL, BACKEND_URL]

    REFRESH_TOKEN_EXPIRES_IN_MINUTES: int = 60 * 60 * 720  # 30 days
    ACCESS_TOKEN_EXPIRES_IN_MINUTES: int = 60 * 60 * 2  # 2 hours

    GITLAB_CLIENT_ID: str
    GITLAB_CLIENT_SECRET: str
    GITLAB_HOST_URL: str = "https://git.66bit.ru/"
    GITLAB_SCOPES: list[str] = ["openid", "read_user", "profile", "email"]

    GITLAB_AUTHORIZE_URL: str = GITLAB_HOST_URL + "oauth/authorize"
    GITLAB_TOKEN_URL: str = GITLAB_HOST_URL + "oauth/token"
    GITLAB_API_URL: str = GITLAB_HOST_URL + "api/v4/"
    GITLAB_CALLBACK_URL: str = f"{BACKEND_URL}/auth/authorize-gitlab"

    class Config:
        case_sensitive = (True,)
        env_file = ENV_FILE_DIR / ".env"


settings = Settings()
