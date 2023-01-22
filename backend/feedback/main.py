import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from fastapi_utils.timing import add_timing_middleware
from starlette.middleware.sessions import SessionMiddleware

from feedback.api.v1.api import api_router
from feedback.core.config import settings
from feedback.core.logging import configure_logger
from feedback.db.manage import init_db

logger = logging.getLogger(__name__)
configure_logger()

app = FastAPI()

app.include_router(api_router)
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)
# add_timing_middleware(app, record=logger.debug, prefix="app")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()
