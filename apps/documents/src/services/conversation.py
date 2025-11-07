from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.conversation import Conversation
from src.repositories.conversation import ConversationRepository
from src.repositories.workspace import WorkspaceRepository
from src.schemas.requests.conversation import ConversationCreate, ConversationUpdate
from src.schemas.responses.conversation import ConversationResponse

logger = get_logger(__name__)


class ConversationService(
    BaseService[
        Conversation,
        ConversationCreate,
        ConversationUpdate,
        ConversationResponse,
        ConversationRepository,
    ]
):
    def __init__(
        self,
        repository: ConversationRepository,
        workspace_repository: WorkspaceRepository,
    ):
        super().__init__(Conversation, repository)
        self.workspace_repository = workspace_repository

    async def create(
        self, user_id: UUID, entity: ConversationCreate
    ) -> ConversationResponse:
        if entity.workspace_id:
            await self.__validate_workspace_ownership(entity.workspace_id, user_id)
        result = await self.repository.create(entity)
        return ConversationResponse.model_validate(result)

    async def update(
        self, entity: Conversation, obj: ConversationUpdate
    ) -> ConversationResponse:
        result = await self.repository.update(entity, obj)
        return ConversationResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> ConversationResponse:
        conversation = await self.repository.get_by_id(id)
        if not conversation:
            raise Exception("Conversation not found")
        return ConversationResponse.model_validate(conversation)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[ConversationResponse]:
        result = await self.repository.get_all(skip, limit)
        conversations = [
            ConversationResponse.model_validate(conversation) for conversation in result
        ]
        return conversations

    async def __validate_workspace_ownership(self, workspace_id: UUID, user_id: UUID):
        workspace = await self.workspace_repository.get_by_id(workspace_id)
        if not workspace:
            raise Exception("Workspace not found")
        if workspace.user_id != user_id:
            raise Exception("Workspace does not belong to user")

    async def __get_user_conversation(
        self, conversation_id: UUID, user_id: UUID
    ) -> Conversation:
        conv = await self.repository.get_by_id(conversation_id)
        if not conv:
            raise Exception("Conversation not found")
        if conv.user_id != user_id:
            raise Exception("Conversation does not belong to user")
        return conv
