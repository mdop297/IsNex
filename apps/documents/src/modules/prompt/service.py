from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.prompt.model import Prompt
from src.modules.prompt.repository import PromptRepository
from src.modules.prompt.dtos.request_dtos import PromptCreate, PromptUpdate
from src.modules.prompt.dtos.response_dtos import PromptResponse
from src.modules.workspace.repository import WorkspaceRepository

logger = get_logger(__name__)


class PromptService(
    BaseService[Prompt, PromptCreate, PromptUpdate, PromptResponse, PromptRepository]
):
    def __init__(
        self, repository: PromptRepository, workspace_repository: WorkspaceRepository
    ):
        super().__init__(Prompt, repository)
        self.workspace_repository = workspace_repository

    async def create(self, user_id: UUID, entity: PromptCreate) -> PromptResponse:
        if entity.workspace_id:
            await self.__validate_workspace_ownership(entity.workspace_id, user_id)
        entity.user_id = user_id
        result = await self.repository.create(entity)
        return PromptResponse.model_validate(result)

    async def update(self, entity: Prompt, obj: PromptUpdate) -> PromptResponse:
        result = await self.repository.update(entity, obj)
        return PromptResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> PromptResponse:
        prompt = await self.repository.get_by_id(id)
        if not prompt:
            raise Exception("Prompt not found")
        return PromptResponse.model_validate(prompt)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[PromptResponse]:
        prompts = await self.repository.get_all(skip, limit)
        result = [PromptResponse.model_validate(prompt) for prompt in prompts]
        return result

    async def __validate_workspace_ownership(self, workspace_id: UUID, user_id: UUID):
        workspace = await self.workspace_repository.get_by_id(workspace_id)
        if not workspace:
            raise Exception("Workspace not found")
        if workspace.user_id != user_id:
            raise Exception("You are not the owner of this workspace")

    async def __validate_prompt_ownership(self, prompt_id: UUID, user_id: UUID):
        prompt = await self.repository.get_by_id(prompt_id)
        if not prompt:
            raise Exception("Prompt not found")
        if prompt.user_id != user_id:
            raise Exception("You are not the owner of this prompt")
