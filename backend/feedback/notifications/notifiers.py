import logging
from abc import ABC, abstractmethod

from feedback import crud, schemas


class AbstractNotifier(ABC):
    @abstractmethod
    def send(self, user_id, message, subject, **kwargs):
        pass


class PersistentNotifier(AbstractNotifier):
    """
    Notifications that saved in db, so user could see them when he logs in
    """

    def send(self, user_id, message, subject: str, db):
        notification = schemas.NotificationCreate(
            user_id=user_id, message=message, subject=subject
        )
        crud.notification.create(db, obj_in=notification)


web_notifier = PersistentNotifier()
