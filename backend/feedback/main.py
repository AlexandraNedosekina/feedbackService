import logging

import sentry_sdk
import uvicorn
from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from feedback import models
from feedback.api.v1.api import api_router
from feedback.core.config import settings
from feedback.core.logger import configure_logger
from feedback.db.session import engine


def main():
    configure_logger()
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
    app.add_middleware(CorrelationIdMiddleware)

    if settings.SENTRY_DSN and settings.BACKEND_URL.host != "localhost":
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            traces_sample_rate=1.0,
        )
    else:
        logger.info("Sentry logging is not enabled")

    models.Base.metadata.create_all(bind=engine)

    uvicorn.run(app, host="0.0.0.0", port=settings.APP_PORT)


if __name__ == "__main__":
    main()
