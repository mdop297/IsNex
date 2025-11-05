from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.folder import Folder
from src.repositories.folder import FolderRepository
from src.schemas.requests.folder import FolderCreate, FolderUpdate

logger = get_logger(__name__)


class FolderService(BaseService[Folder, FolderCreate, FolderUpdate, FolderRepository]):
    def __init__(self, repository: FolderRepository):
        super().__init__(Folder, repository)

    async def create(self, entity: FolderCreate) -> Folder:
        result = await self.repository.create(entity)
        return result

    async def update(self, entity: Folder, obj: FolderUpdate) -> Folder:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> Folder:
        folder = await self.repository.get_by_id(id)
        if not folder:
            raise Exception("Folder not found")
        return folder

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Folder]:
        folders = await self.repository.get_all(skip, limit)
        return folders
