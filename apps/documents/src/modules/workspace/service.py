from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.conversation.repository import ConversationRepository
from src.modules.document.repository import DocumentRepository
from src.modules.note.repository import NoteRepository
from src.modules.workspace.model import Workspace
from src.modules.workspace.repository import WorkspaceRepository
from src.modules.workspace.dtos.request_dtos import WorkspaceCreate, WorkspaceUpdate
from src.modules.workspace.dtos.response_dtos import (
    WorkspaceMetaResponse,
    WorkspaceResponse,
)

logger = get_logger(__name__)


class WorkspaceService(
    BaseService[
        Workspace,
        WorkspaceCreate,
        WorkspaceUpdate,
        WorkspaceResponse,
        WorkspaceRepository,
    ]
):
    def __init__(
        self,
        repository: WorkspaceRepository,
        document_repo: DocumentRepository,
        conversation_repository: ConversationRepository,
        note_repository: NoteRepository,
    ):
        super().__init__(Workspace, repository)
        self.document_repository = document_repo
        self.conversation_repository = conversation_repository
        self.note_repository = note_repository

    async def create(self, user_id: UUID, entity: WorkspaceCreate) -> WorkspaceResponse:
        entity.user_id = user_id
        result = await self.repository.create(entity)
        return WorkspaceResponse.model_validate(result)

    async def update(
        self, user_id: UUID, id: UUID, obj: WorkspaceUpdate
    ) -> WorkspaceResponse:
        entity = await self.__validate_workspace_ownership(user_id, id)
        if obj.active_conv is not None:
            await self.__validate_conversation_ownership(user_id, obj.active_conv)
        if obj.active_doc is not None:
            await self.__validate_document_ownership(user_id, obj.active_doc)
        if obj.active_note is not None:
            await self.__validate_note_ownership(user_id, obj.active_note)
        result = await self.repository.update(entity, obj)
        return WorkspaceResponse.model_validate(result)

    async def add_document_to_workspace(
        self, user_id: UUID, workspace_id: UUID, document_id: UUID
    ):
        await self.__validate_workspace_ownership(user_id, workspace_id)
        await self.__validate_document_ownership(user_id, document_id)
        return await self.repository.add_document_to_workspace(
            workspace_id, document_id
        )

    async def remove_document_from_workspace(
        self, user_id: UUID, workspace_id: UUID, document_id: UUID
    ):
        await self.__validate_workspace_ownership(user_id, workspace_id)
        await self.__validate_document_ownership(user_id, document_id)
        return await self.repository.remove_document_from_workspace(
            workspace_id, document_id
        )

    async def delete(self, user_id: UUID, id: UUID) -> bool:
        await self.__validate_workspace_ownership(user_id, id)
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, user_id: UUID, id: UUID) -> WorkspaceResponse:
        workspace = await self.__validate_workspace_ownership(user_id, id)
        return WorkspaceResponse.model_validate(workspace)

    async def get_meta(
        self, user_id: UUID, workspace_id: UUID
    ) -> WorkspaceMetaResponse:
        workspace = await self.__validate_workspace_ownership(user_id, workspace_id)
        num_docs = await self.repository.count_document(workspace_id)
        num_convs = await self.conversation_repository.count_by_workspace_id(
            workspace_id
        )
        workspace_dict = (
            workspace.model_dump()
            if hasattr(workspace, "model_dump")
            else workspace.__dict__
        )
        workspace_dict["num_documents"] = num_docs
        workspace_dict["num_conversations"] = num_convs

        result = WorkspaceMetaResponse.model_validate(workspace_dict)
        return result

    async def get_all(
        self, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> Sequence[WorkspaceResponse]:
        workspaces = await self.repository.get_by(
            field="user_id", value=user_id, skip=skip, limit=limit
        )
        result = [
            WorkspaceResponse.model_validate(workspace) for workspace in workspaces
        ]
        return result

    async def __validate_workspace_ownership(
        self, user_id: UUID, workspace_id: UUID
    ) -> Workspace:
        workspace = await self.repository.get_by_id(workspace_id)
        if not workspace:
            raise Exception("Workspace not found")
        if workspace.user_id != user_id:
            raise Exception("Workspace does not belong to user")
        return workspace

    async def __validate_document_ownership(self, user_id: UUID, document_id: UUID):
        document = await self.document_repository.get_by_id(document_id)
        if not document:
            raise Exception("Document not found")
        if document.user_id != user_id:
            raise Exception("Document does not belong to user")

    async def __validate_conversation_ownership(
        self, user_id: UUID, conversation_id: UUID
    ):
        conversation = await self.conversation_repository.get_by_id(conversation_id)
        if not conversation:
            raise Exception("Conversation not found")
        if conversation.user_id != user_id:
            raise Exception("Conversation does not belong to user")

    async def __validate_note_ownership(self, user_id: UUID, note_id: UUID):
        note = await self.note_repository.get_by_id(note_id)
        if not note:
            raise Exception("Note not found")
        if note.user_id != user_id:
            raise Exception("Note does not belong to user")
