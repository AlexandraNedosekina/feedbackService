from fastapi import FastAPI

from feedback.api.v1.custom_auth import router

# from api.v1.authlib_oauth import router

from feedback.core.config import settings
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

app.include_router(router, prefix="/auth", tags=["Auth"])

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)
