from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.workspace.model import Workspace
from src.modules.workspace.repository import WorkspaceRepository
from src.modules.workspace.dtos.request_dtos import WorkspaceCreate, WorkspaceUpdate
from src.modules.workspace.dtos.response_dtos import WorkspaceResponse

logger = get_logger(__name__)


class WorkspaceService(
    BaseService[
        Workspace,
        WorkspaceCreate,
        WorkspaceUpdate,
        WorkspaceResponse,
        WorkspaceRepository,
    ]
):
    def __init__(self, repository: WorkspaceRepository):
        super().__init__(Workspace, repository)

    async def create(self, entity: WorkspaceCreate) -> WorkspaceResponse:
        result = await self.repository.create(entity)
        return WorkspaceResponse.model_validate(result)

    async def update(
        self, entity: Workspace, obj: WorkspaceUpdate
    ) -> WorkspaceResponse:
        result = await self.repository.update(entity, obj)
        return WorkspaceResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> WorkspaceResponse:
        workspace = await self.repository.get_by_id(id)
        if not workspace:
            raise Exception("Workspace not found")
        return WorkspaceResponse.model_validate(workspace)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[WorkspaceResponse]:
        workspaces = await self.repository.get_all(skip, limit)
        result = [
            WorkspaceResponse.model_validate(workspace) for workspace in workspaces
        ]
        return result
