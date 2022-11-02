from fastapi import FastAPI

from feedback.api.v1.custom_auth import router
from fastapi.middleware.cors import CORSMiddleware
# from api.v1.authlib_oauth import router

from feedback.core.config import settings
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
origins = [
   "http://localhost:3000",
]
app.include_router(router, prefix="/auth", tags=["Auth"])

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)