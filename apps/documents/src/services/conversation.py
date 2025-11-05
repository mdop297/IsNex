from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.conversation import Conversation
from src.repositories.conversation import ConversationRepository
from src.schemas.requests.conversation import ConversationCreate, ConversationUpdate

logger = get_logger(__name__)


class ConversationService(
    BaseService[
        Conversation, ConversationCreate, ConversationUpdate, ConversationRepository
    ]
):
    def __init__(self, repository: ConversationRepository):
        super().__init__(Conversation, repository)

    async def create(self, entity: ConversationCreate) -> Conversation:
        result = await self.repository.create(entity)
        return result

    async def update(
        self, entity: Conversation, obj: ConversationUpdate
    ) -> Conversation:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> Conversation:
        conversation = await self.repository.get_by_id(id)
        if not conversation:
            raise Exception("Conversation not found")
        return conversation

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Conversation]:
        conversations = await self.repository.get_all(skip, limit)
        return conversations
