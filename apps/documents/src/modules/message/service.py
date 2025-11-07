from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.message.model import Message
from src.modules.message.repository import MessageRepository
from src.modules.message.dtos.request_dtos import MessageCreate, MessageUpdate
from src.modules.message.dtos.response_dtos import MessageResponse

logger = get_logger(__name__)


class MessageService(
    BaseService[
        Message, MessageCreate, MessageUpdate, MessageResponse, MessageRepository
    ]
):
    def __init__(self, repository: MessageRepository):
        super().__init__(Message, repository)

    async def create(self, entity: MessageCreate) -> MessageResponse:
        result = await self.repository.create(entity)
        return MessageResponse.model_validate(result)

    async def update(self, entity: Message, obj: MessageUpdate) -> MessageResponse:
        result = await self.repository.update(entity, obj)
        return MessageResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> MessageResponse:
        message = await self.repository.get_by_id(id)
        if not message:
            raise Exception("Message not found")
        return MessageResponse.model_validate(message)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[MessageResponse]:
        result = await self.repository.get_all(skip, limit)
        messages = [MessageResponse.model_validate(message) for message in result]
        return messages
