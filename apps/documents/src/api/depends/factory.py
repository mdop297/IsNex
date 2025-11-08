# factory.py
from typing import Annotated
from fastapi import Depends

from src.core.database.session import get_session
from src.modules.conversation.repository import ConversationRepository
from src.modules.document.repository import DocumentRepository
from src.modules.folder.repository import FolderRepository
from src.modules.highlight.repository import HighlightRepository
from src.modules.message.repository import MessageRepository
from src.modules.message.service import MessageService
from src.modules.note.repository import NoteRepository
from src.modules.note.service import NoteService
from src.modules.workspace.repository import WorkspaceRepository
from src.modules.conversation.service import ConversationService
from src.modules.document.service import DocumentService
from src.modules.folder.service import FolderService
from src.modules.highlight.service import HighlightService
from src.modules.object_storage.service import (
    MinioService,
    get_minio_session,
    MinioSession,
)


class Factory:
    """Factory with proper dependency injection"""

    def get_document_service(
        self, db_session=Depends(get_session), minio_session=Depends(get_minio_session)
    ) -> DocumentService:
        return DocumentService(
            DocumentRepository(db_session),
            MinioService(minio_session),
        )

    def get_storage_service(
        self, minio_session: MinioSession = Depends(get_minio_session)
    ) -> MinioService:
        """Fixed type hint"""
        return MinioService(minio_session)

    def get_folder_service(self, db_session=Depends(get_session)) -> FolderService:
        return FolderService(repository=FolderRepository(db_session))

    def get_highlight_service(
        self, db_session=Depends(get_session)
    ) -> HighlightService:
        return HighlightService(
            repository=HighlightRepository(db_session),
            document_repository=DocumentRepository(db_session),
        )

    def get_conversation_service(
        self, db_session=Depends(get_session)
    ) -> ConversationService:
        return ConversationService(
            repository=ConversationRepository(db_session),
            workspace_repository=WorkspaceRepository(db_session),
        )

    def get_message_service(self, db_session=Depends(get_session)) -> MessageService:
        return MessageService(
            repository=MessageRepository(db_session),
            conversation_repository=ConversationRepository(db_session),
        )

    def get_note_service(self, db_session=Depends(get_session)) -> NoteService:
        return NoteService(repository=NoteRepository(db_session))


factory = Factory()

FolderServiceDep = Annotated[FolderService, Depends(factory.get_folder_service)]

DocumentServiceDep = Annotated[DocumentService, Depends(factory.get_document_service)]

HighlightServiceDep = Annotated[
    HighlightService, Depends(factory.get_highlight_service)
]

ConversationServiceDep = Annotated[
    ConversationService, Depends(factory.get_conversation_service)
]

MessageServiceDep = Annotated[MessageService, Depends(factory.get_message_service)]

NoteServiceDep = Annotated[NoteService, Depends(factory.get_note_service)]
