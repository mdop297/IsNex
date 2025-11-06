from typing import Sequence
from uuid import UUID

from pydantic import Field

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
            await self.__validate_folder(entity.parent_id, user_id)

        result = await self.repository.create(entity)
        return FolderResponse.model_validate(result)

    async def update(
        self, user_id: UUID, id: UUID, obj: FolderUpdate
    ) -> FolderResponse:
        folder = await self.__validate_folder(id, user_id)
        if obj.parent_id:
            await self.__validate_folder(obj.parent_id, user_id)

        result = await self.repository.update(folder, obj)
        return FolderResponse.model_validate(result)

    async def delete(self, user_id: UUID, id: UUID) -> bool:
        await self.__validate_folder(id, user_id)
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, user_id: UUID, id: UUID) -> FolderResponse:
        folder = await self.repository.get_by_id(id)
        if not folder:
            raise Exception("Folder not found")
        if folder.user_id != user_id:
            raise Exception("Folder does not belong to user")
        return FolderResponse.model_validate(folder)

    async def get_all(
        self, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> Sequence[FolderResponse]:
        folders = await self.repository.get_all_by_user_id(user_id, skip, limit)
        results = [FolderResponse.model_validate(folder) for folder in folders]
        return results

    async def __validate_folder(
        self,
        id: UUID = Field(description="folder id"),
        user_id: UUID = Field(description="user id"),
    ) -> Folder:
        folder = await self.repository.get_by_id(id)
        if not folder:
            raise Exception("Folder not found")
        if folder.user_id != user_id:
            raise Exception("Folder does not belong to user")
        return folder
