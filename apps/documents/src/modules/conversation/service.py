from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.conversation.model import Conversation
from src.modules.conversation.repository import ConversationRepository
from src.modules.workspace.repository import WorkspaceRepository
from src.modules.conversation.dtos.request_dtos import (
    ConversationCreate,
    ConversationUpdate,
)
from src.modules.conversation.dtos.response_dtos import (
    ConversationResponse,
    PaginatedConversationResponse,
)

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
        entity.user_id = user_id
        result = await self.repository.create(entity)
        return ConversationResponse.model_validate(result)

    async def update(
        self, user_id: UUID, id: UUID, obj: ConversationUpdate
    ) -> ConversationResponse:
        conv_entity = await self.__get_user_conversation(
            conversation_id=id, user_id=user_id
        )
        result = await self.repository.update(conv_entity, obj)
        return ConversationResponse.model_validate(result)

    async def delete(self, user_id: UUID, id: UUID) -> bool:
        await self.__get_user_conversation(id, user_id)
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, user_id: UUID, id: UUID) -> ConversationResponse:
        conversation = await self.__get_user_conversation(id, user_id)
        return ConversationResponse.model_validate(conversation)

    async def get_by_user_id(
        self, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> PaginatedConversationResponse:
        convs = await self.repository.get_by(
            field="user_id", value=user_id, skip=skip, limit=limit
        )

        if not convs:
            return PaginatedConversationResponse(
                items=[], total=0, skip=skip, limit=limit
            )

        total = await self.repository.count_by(field="user_id", value=user_id)

        return PaginatedConversationResponse(
            items=[ConversationResponse.model_validate(conv) for conv in convs],
            total=total,
            skip=skip,
            limit=limit,
        )

    async def get_by_workspace_id(
        self, user_id: UUID, workspace_id: UUID, skip: int = 0, limit: int = 10
    ) -> PaginatedConversationResponse:
        await self.__validate_workspace_ownership(workspace_id, user_id)
        convs = await self.repository.get_by(
            field="workspace_id", value=workspace_id, skip=skip, limit=limit
        )

        if not convs:
            return PaginatedConversationResponse(
                items=[], total=0, skip=skip, limit=limit
            )

        total = await self.repository.count_by(field="workspace_id", value=workspace_id)

        return PaginatedConversationResponse(
            items=[ConversationResponse.model_validate(conv) for conv in convs],
            total=total,
            skip=skip,
            limit=limit,
        )

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
