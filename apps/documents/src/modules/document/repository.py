from typing import Sequence
from uuid import UUID
from sqlmodel import  col, exists, select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from src.modules.document.model import Document
from src.modules.document.dtos.request_dtos import DocumentCreate, DocumentUpdate
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
            raise e

    async def get_documents_at_root_by_user(self, user_id: UUID)-> Sequence[Document]:
        try:
            stmt = select(self.model_class).where(
    (self.model_class.user_id == user_id) & (Document.folder_id == None))


            results = await self.session.exec(stmt)
            return results.all()
        except Exception as e:
            logger.error(f"Failed to get documents at root for user {user_id}")
            raise e