import logging
from abc import ABC, abstractmethod

from sqlalchemy.orm import Session

from feedback import schemas
from feedback.crud.base import CRUDBase


class AbstractNotifier(ABC):
    @abstractmethod
    def send(self, user_id, message, subject, **kwargs):
        pass


class PersistentNotifier(AbstractNotifier):
    """
    Notifications that saved in db, so user could see them when he logs in
    """

    def __init__(self, notification_crud: CRUDBase) -> None:
        self.crud = notification_crud

    def send(self, user_id, message, subject: str, db: Session):
        notification = schemas.NotificationCreate(
            user_id=user_id, message=message, subject=subject
        )
        self.crud.create(db, obj_in=notification)


class LoggerNotifier(AbstractNotifier):
    """
    Just for test
    """

    def __init__(self) -> None:
        self.logger = logging.getLogger("logger notifier")

    def send(self, user_id, message, subject: str, **_):
        self.logger.debug(
            f"Sending notification ({subject}) to user_id={user_id} with message: '{message}'."
        )


class Notifiers(AbstractNotifier):
    """
    Class to store all variants of user notification
    SSE, Telegram etc.
    """

    def __init__(self, *notifiers: AbstractNotifier) -> None:
        self.notifiers = [*notifiers]

    def send(self, user_id, message, subject, db):
        for notifier in self.notifiers:
            notifier.send(user_id, message, subject, db=db)
