from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from google.protobuf.message import Message

from notify.events.schemas.event_types import EventType

E = TypeVar("E", bound=Message)


class EventHandler(Generic[E], ABC):
    """Base class for event handlers"""

    @abstractmethod
    async def handle(self, event: E) -> bool:
        raise NotImplementedError("Subclasses must implement handle method")

    @abstractmethod
    def get_event_type(self) -> EventType:
        raise NotImplementedError("Subclasses must implement get_event_type method")

    @abstractmethod
    def get_event_schema(self) -> type[Message]:
        raise NotImplementedError("Subclasses must implement get_event_schema method")

    def get_handler_name(self) -> str:
        return self.__class__.__name__
