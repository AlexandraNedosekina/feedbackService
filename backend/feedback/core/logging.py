import logging
from enum import Enum

from feedback.core.config import settings

LOG_FORMAT_DEBUG = "%(levelname)s:%(message)s:%(pathname)s:%(funcName)s:%(lineno)d"


class LogLevels(str, Enum):
    info = "INFO"
    warn = "WARNING"
    error = "ERROR"
    debug = "DEBUG"


def configure_logger():
    log_level = (settings.LOG_LEVEL).upper()
    log_levels = {level for level in LogLevels}

    if log_level not in log_levels:
        log_level = LogLevels.error

    if settings.IS_DEBUG:
        logging.basicConfig(level=log_level, format=LOG_FORMAT_DEBUG)
        return

    logging.basicConfig(level=log_level)
