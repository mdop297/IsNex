from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.source import Source
from src.repositories.source import SourceRepository
from src.schemas.requests.source import SourceCreate, SourceUpdate

logger = get_logger(__name__)


class SourceService(BaseService[Source, SourceCreate, SourceUpdate, SourceRepository]):
    def __init__(self, repository: SourceRepository):
        super().__init__(Source, repository)

    async def create(self, entity: SourceCreate) -> Source:
        result = await self.repository.create(entity)
        return result

    async def update(self, entity: Source, obj: SourceUpdate) -> Source:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> Source:
        source = await self.repository.get_by_id(id)
        if not source:
            raise Exception("Source not found")
        return source

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Source]:
        sources = await self.repository.get_all(skip, limit)
        return sources
