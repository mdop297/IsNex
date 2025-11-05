from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.message import Message
from src.repositories.message import MessageRepository
from src.schemas.requests.message import MessageCreate, MessageUpdate

logger = get_logger(__name__)


class MessageService(
    BaseService[Message, MessageCreate, MessageUpdate, MessageRepository]
):
    def __init__(self, repository: MessageRepository):
        super().__init__(Message, repository)

    async def create(self, entity: MessageCreate) -> Message:
        result = await self.repository.create(entity)
        return result

    async def update(self, entity: Message, obj: MessageUpdate) -> Message:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> Message:
        message = await self.repository.get_by_id(id)
        if not message:
            raise Exception("Message not found")
        return message

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Message]:
        messages = await self.repository.get_all(skip, limit)
        return messages
