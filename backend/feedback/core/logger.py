from logging.config import dictConfig

from feedback.core.config import settings


def configure_logger() -> None:
    dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "filters": {
                "correlation_id": {
                    "()": "asgi_correlation_id.CorrelationIdFilter",
                    "uuid_length": 8
                    if settings.BACKEND_URL.host == "localhost"
                    else 32,
                    "default_value": "-",
                },
            },
            "formatters": {
                "console": {
                    "class": "logging.Formatter",
                    "datefmt": "%H:%M:%S",
                    "format": "%(levelname)s:\t\b%(asctime)s %(name)s:%(lineno)d [%(correlation_id)s] %(message)s",
                },
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "filters": ["correlation_id"],
                    "formatter": "console",
                },
            },
            "loggers": {
                "root": {
                    "handlers": ["console"],
                    "level": settings.LOG_LEVEL,
                    "propagate": True,
                },
                "asgi_correlation_id": {"handlers": ["console"], "level": "WARNING"},
            },
        }
    )
