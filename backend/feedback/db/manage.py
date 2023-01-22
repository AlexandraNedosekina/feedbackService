from feedback import models
from feedback.db.base import Base
from feedback.db.session import engine


def init_db():
    Base.metadata.create_all(bind=engine)
