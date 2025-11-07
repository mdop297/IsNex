from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.prompt.model import Prompt
from src.modules.prompt.repository import PromptRepository
from src.modules.prompt.dtos.request_dtos import PromptCreate, PromptUpdate
from src.modules.prompt.dtos.response_dtos import PromptResponse

logger = get_logger(__name__)


class PromptService(
    BaseService[Prompt, PromptCreate, PromptUpdate, PromptResponse, PromptRepository]
):
    def __init__(self, repository: PromptRepository):
        super().__init__(Prompt, repository)

    async def create(self, entity: PromptCreate) -> PromptResponse:
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
