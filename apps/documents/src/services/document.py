from typing import Sequence
from uuid import UUID
from src.core.service.base import BaseService
from src.models.document import Document
from src.repositories.document import DocumentRepository
from src.schemas.requests.document import DocumentCreate, DocumentUpdate


class DocumentService(BaseService[Document, DocumentCreate, DocumentUpdate]):
    def __init__(self, repository: DocumentRepository):
        super().__init__(Document, repository)

    async def create(self, entity: DocumentCreate) -> Document:
        result = await self.repository.create(entity)
        return result

    async def update(self, entity: Document, obj: DocumentUpdate) -> Document:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> Document:
        document = await self.repository.get_by_id(id)
        if not document:
            raise Exception("Document not found")
        return document

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Document]:
        documents = await self.repository.get_all(skip, limit)
        return documents
