from confluent_kafka import Message

from notify.events.handlers.base_handler import EventHandler
from notify.events.schemas.event_types import EventType
from notify.utils.logger import get_custom_logger

logger = get_custom_logger(__name__)


class EventManager:
    def __init__(self, service_name: str = "notification-svc") -> None:
        self._handlers: dict[EventType, EventHandler] = {}
        self.service_name = service_name

    def register_handler(self, handler: EventHandler) -> None:
        """Register a single event handler by event type saved in itself"""
        self._handlers[handler.get_event_type()] = handler

    def register_handlers(self, handlers: list[EventHandler]) -> None:
        """Register multiple handlers by event type"""
        for handler in handlers:
            self.register_handler(handler)

    async def process_event(self, message: Message) -> bool:
        """Route event to appropriate handler by event type"""
        value = self.get_message_value(message)
        event_type = self.get_event_type(message)
        handler = self._handlers.get(event_type)
        if handler:
            schema = handler.get_event_schema()
            event = schema.FromString(value)
            return await handler.handle(event)

        return False

    def get_event_type(self, message: Message) -> EventType:
        headers = dict(message.headers() or [])
        event_type_header = headers.get("event-type")
        if event_type_header is None:
            logger.error(
                "Received message with no event type in headers."
                + "Skipping event processing."
            )
            raise Exception(
                "Received message with no event type in headers"
                + "Skipping event processing."
            )
        return EventType(event_type_header.decode())

    def get_message_value(self, message: Message):
        value = message.value()
        if value is None:
            logger.error(
                "Received message with no value (None). Skipping event processing."
            )
            raise Exception(
                "Received message with no value (None)." + "Skipping event processing."
            )
        return value

    def send_to_dlq(self, message: Message) -> None:
        pass
