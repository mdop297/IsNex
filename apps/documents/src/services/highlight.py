from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.highlight import Highlight
from src.repositories.highlight import HighlightRepository
from src.schemas.requests.highlight import HighlightCreate, HighlightUpdate

logger = get_logger(__name__)


class HighlightService(
    BaseService[Highlight, HighlightCreate, HighlightUpdate, HighlightRepository]
):
    def __init__(self, repository: HighlightRepository):
        super().__init__(Highlight, repository)

    async def create(self, entity: HighlightCreate) -> Highlight:
        result = await self.repository.create(entity)
        return result

    async def update(self, entity: Highlight, obj: HighlightUpdate) -> Highlight:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> Highlight:
        highlight = await self.repository.get_by_id(id)
        if not highlight:
            raise Exception("Highlight not found")
        return highlight

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Highlight]:
        highlights = await self.repository.get_all(skip, limit)
        return highlights
