# factory.py
from functools import lru_cache, partial
from fastapi import Depends

from src.core.database.session import get_session
from src.repositories.document import DocumentRepository
from src.services.document import DocumentService
from src.services.obj_storage import MinioService, get_minio_session, MinioSession


class Factory:
    """Factory with proper dependency injection"""

    document_repository = partial(DocumentRepository)

    def get_document_service(self, db_session=Depends(get_session)) -> DocumentService:
        return DocumentService(self.document_repository(db_session))

    def get_storage_service(
        self, minio_session: MinioSession = Depends(get_minio_session)
    ) -> MinioService:
        """Fixed type hint"""
        return MinioService(minio_session)


# Singleton factory instance
@lru_cache()
def get_factory() -> Factory:
    return Factory()
