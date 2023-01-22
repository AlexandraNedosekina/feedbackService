import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from feedback.core.config import settings

logger = logging.getLogger(__name__)

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    echo=settings.IS_DEBUG,
    pool_pre_ping=True,
)

session_local = sessionmaker(
    expire_on_commit=False, autocommit=False, autoflush=False, bind=engine
)
