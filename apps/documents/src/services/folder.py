from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.folder import Folder
from src.repositories.folder import FolderRepository
from src.schemas.requests.folder import FolderCreate, FolderUpdate
from src.schemas.responses.folder import FolderResponse

logger = get_logger(__name__)


class FolderService(
    BaseService[Folder, FolderCreate, FolderUpdate, FolderResponse, FolderRepository]
):
    def __init__(self, repository: FolderRepository):
        super().__init__(Folder, repository)

    async def create(self, user_id: UUID, entity: FolderCreate) -> FolderResponse:
        # check folder name exists (use constraint)
        # check parent_id belong to user_id
        if entity.parent_id:
            await self.validate_parent(entity.parent_id, user_id)

        result = await self.repository.create(entity)
        return FolderResponse.model_validate(result)

    async def update(self, entity: Folder, obj: FolderUpdate) -> FolderResponse:
        result = await self.repository.update(entity, obj)
        return FolderResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> FolderResponse:
        folder = await self.repository.get_by_id(id)
        if not folder:
            raise Exception("Folder not found")
        return FolderResponse.model_validate(folder)

    async def get_all(
        self, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> Sequence[FolderResponse]:
        folders = await self.repository.get_all_by_user_id(user_id, skip, limit)
        results = [FolderResponse.model_validate(folder) for folder in folders]
        return results

    async def validate_parent(self, parent_id: UUID, user_id: UUID):
        parent = await self.repository.get_by_id(parent_id)
        if not parent:
            raise Exception("Parent folder not found")
        if parent.user_id != user_id:
            raise Exception("Parent folder does not belong to user")
