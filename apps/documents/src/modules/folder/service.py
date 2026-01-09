from typing import Optional, Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.folder.model import Folder
from src.modules.folder.repository import FolderRepository
from src.modules.folder.dtos.request_dtos import FolderCreate, FolderUpdate
from src.modules.folder.dtos.response_dtos import FolderResponse

logger = get_logger(__name__)


class FolderService(
    BaseService[Folder, FolderCreate, FolderUpdate, FolderResponse, FolderRepository]
):
    def __init__(self, repository: FolderRepository):
        super().__init__(Folder, repository)

    async def create(self, user_id: UUID, entity: FolderCreate) -> FolderResponse:
        # Validate parent folder exists and belongs to user
        if entity.parent_id:
            await self.__validate_folder(entity.parent_id, user_id)

        result = await self.repository.create(entity)
        return FolderResponse.model_validate(result)

    async def update(
        self, user_id: UUID, id: UUID, obj: FolderUpdate
    ) -> FolderResponse:
        # Get folder with minimal fields
        folder = await self.__validate_folder(id, user_id)
        if not folder:
            raise Exception("Folder not found")
        if folder.user_id != user_id:
            raise Exception("Folder does not belong to user")

        # Only validate parent_id if it changes
        if obj.parent_id is not None and obj.parent_id != folder.parent_id:
            await self.__validate_folder(obj.parent_id, user_id)
            # Prevent circular reference
            await self.__validate_no_circular_reference(id, obj.parent_id)

        result = await self.repository.update(folder, obj)
        return FolderResponse.model_validate(result)

    async def delete(self, user_id: UUID, id: UUID) -> bool:
        await self.__validate_folder(id, user_id)
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, user_id: UUID, id: UUID) -> FolderResponse:
        folder = await self.__validate_folder(id, user_id)
        return FolderResponse.model_validate(folder)

    async def get_all(
        self, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> Sequence[FolderResponse]:
        folders = await self.repository.get_all_by_user_id(user_id, skip, limit)
        results = [FolderResponse.model_validate(folder) for folder in folders]
        return results

    async def __validate_folder(self, id: UUID, user_id: UUID) -> Folder:
        """Validate folder exists and belongs to user"""
        folder = await self.repository.get_by_id(id)
        if not folder:
            raise Exception("Folder not found")
        if folder.user_id != user_id:
            raise Exception("Folder does not belong to user")
        return folder

    async def __validate_no_circular_reference(
        self, folder_id: UUID, new_parent_id: UUID
    ) -> None:
        """Prevent folder from being its own ancestor"""
        current_id: Optional[UUID] = new_parent_id
        visited: set[UUID] = set()

        while current_id is not None:
            if current_id == folder_id:
                raise Exception(
                    "Circular reference detected: folder cannot be its own ancestor"
                )

            if current_id in visited:
                break

            visited.add(current_id)

            parent = await self.repository.get_by_id(current_id, fields=["parent_id"])
            current_id = parent.parent_id if parent else None
