from notify.core.config import app_settings
from notify.events.handlers.base_handler import EventHandler
from notify.events.schemas.auth_pb2 import UserCreatedEvent
from notify.events.schemas.event_types import EventType
from notify.services.notification import NotificationService
from notify.utils.logger import get_custom_logger

logger = get_custom_logger(__name__)


class UserCreatedHandler(EventHandler[UserCreatedEvent]):
    def __init__(self, notification_service: NotificationService):
        self.notification_service = notification_service

    async def handle(self, event: UserCreatedEvent) -> bool:
        user_id: str = event.userId
        email: str = event.email
        timestamp: int = event.timestamp
        token: str = event.urlToken

        await self.notification_service.send_email_with_template(
            recipients=[event.email],
            subject="Verify your email",
            context={
                "username": event.userId,
                # TODO: replace fixed prefix "/verify/"
                "verification_url": f"http://{app_settings.APP_DOMAIN}/verify/{event.urlToken}",
            },
            template_name="mail_email_verify.html",
        )

        logger.info(
            "✅ ĐÃ VÀO ĐƯỢC HÀM handle() rồi hahahaha: \n"
            f"✅ Consumed message: "
            f"ID={user_id}, "
            f"Email={email}, "
            f"Token={token}, "
            f"Timestamp={timestamp}"
        )

        return True

    def get_event_type(self) -> EventType:
        return EventType.USER_CREATED

    def get_event_schema(self) -> type[UserCreatedEvent]:
        return UserCreatedEvent
