from uuid import UUID
from sqlmodel import col, exists, select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from src.models.document import Document
from src.schemas.requests.document import DocumentCreate, DocumentUpdate

logger = get_logger(__name__)


class DocumentRepository(BaseRepository[Document, DocumentCreate, DocumentUpdate]):
    def __init__(self, db_session: AsyncSession):
        super().__init__(Document, db_session)

    async def create(self, entity: DocumentCreate) -> Document:
        return await super().create(entity)

    async def check_exists_on_user(self, user_id: UUID, file_url: str) -> bool:
        try:
            stmt = select(
                exists().where(
                    (col(self.model_class.user_id) == user_id)
                    & (col(self.model_class.file_url) == file_url)
                )
            )
            logger.info(stmt)
            result = await self.session.exec(stmt)
            return result.first() is True
        except Exception as e:
            logger.error(f"Error checking existence: {e}")
            raise
