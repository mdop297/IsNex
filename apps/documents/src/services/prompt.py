from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.prompt import Prompt
from src.repositories.prompt import PromptRepository
from src.schemas.requests.prompt import PromptCreate, PromptUpdate

logger = get_logger(__name__)


class PromptService(BaseService[Prompt, PromptCreate, PromptUpdate, PromptRepository]):
    def __init__(self, repository: PromptRepository):
        super().__init__(Prompt, repository)

    async def create(self, entity: PromptCreate) -> Prompt:
        result = await self.repository.create(entity)
        return result

    async def update(self, entity: Prompt, obj: PromptUpdate) -> Prompt:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> Prompt:
        prompt = await self.repository.get_by_id(id)
        if not prompt:
            raise Exception("Prompt not found")
        return prompt

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Prompt]:
        prompts = await self.repository.get_all(skip, limit)
        return prompts
