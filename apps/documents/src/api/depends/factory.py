# factory.py
from typing import Annotated
from fastapi import Depends

from src.core.database.session import get_session
from src.repositories.document import DocumentRepository
from src.repositories.folder import FolderRepository
from src.repositories.highlight import HighlightRepository
from src.services.document import DocumentService
from src.services.folder import FolderService
from src.services.highlight import HighlightService
from src.services.obj_storage import MinioService, get_minio_session, MinioSession


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
        return HighlightService(repository=HighlightRepository(db_session))


factory = Factory()

FolderServiceDep = Annotated[FolderService, Depends(factory.get_folder_service)]

DocumentServiceDep = Annotated[DocumentService, Depends(factory.get_document_service)]

HighlightServiceDep = Annotated[
    HighlightService, Depends(factory.get_highlight_service)
]
