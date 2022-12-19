import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from fastapi_utils.timing import add_timing_middleware
from starlette.middleware.sessions import SessionMiddleware

from feedback import models
from feedback.api.v1.api import api_router
from feedback.core.config import settings
from feedback.db.session import engine

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s;%(levelname)s;%(message)s")
logger = logging.getLogger(__name__)
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

# Profiling
# add_timing_middleware(app, record=logger.info, prefix="app")

models.Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"message": "Ok dude"}
