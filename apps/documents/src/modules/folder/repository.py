from uuid import UUID

from sqlmodel import select
from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.modules.folder.model import Folder
from src.modules.folder.dtos.request_dtos import FolderCreate, FolderUpdate


logger = get_logger(__name__)


class FolderRepository(BaseRepository[Folder, FolderCreate, FolderUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session

    def get_all_by_user_id(self, user_id: UUID, skip: int = 0, limit: int = 100):
        query = (
            select(self.model_class)
            .where(self.model_class.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return self.session.exec(query)
