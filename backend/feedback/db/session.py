from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from feedback.core.config import settings

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
