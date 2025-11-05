from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.workspace import Workspace
from src.repositories.workspace import WorkspaceRepository
from src.schemas.requests.workspace import WorkspaceCreate, WorkspaceUpdate

logger = get_logger(__name__)


class WorkspaceService(
    BaseService[Workspace, WorkspaceCreate, WorkspaceUpdate, WorkspaceRepository]
):
    def __init__(self, repository: WorkspaceRepository):
        super().__init__(Workspace, repository)

    async def create(self, entity: WorkspaceCreate) -> Workspace:
        result = await self.repository.create(entity)
        return result

    async def update(self, entity: Workspace, obj: WorkspaceUpdate) -> Workspace:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> Workspace:
        workspace = await self.repository.get_by_id(id)
        if not workspace:
            raise Exception("Workspace not found")
        return workspace

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Workspace]:
        workspaces = await self.repository.get_all(skip, limit)
        return workspaces
