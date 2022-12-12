import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from feedback import models
from feedback.api.v1.api import api_router
from feedback.core.config import settings
from feedback.db.session import engine

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s;%(levelname)s;%(message)s")
app = FastAPI()

app.include_router(api_router)
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"message": "Ok dude"}
