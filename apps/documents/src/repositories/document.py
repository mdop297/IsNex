from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.repository.base import BaseRepository
from src.models.document import Document
from src.schemas.requests.document import DocumentCreate, DocumentUpdate


class DocumentRepository(BaseRepository[Document, DocumentCreate, DocumentUpdate]):
    def __init__(self, db_session: AsyncSession):
        super().__init__(Document, db_session)

    async def create(self, entity: DocumentCreate):
        return await super().create(entity)
