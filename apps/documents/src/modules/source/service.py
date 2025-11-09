from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.source.model import Source
from src.modules.source.repository import SourceRepository
from src.modules.source.dtos.request_dtos import SourceCreate, SourceUpdate
from src.modules.source.dtos.response_dtos import SourceResponse

logger = get_logger(__name__)


class SourceService(
    BaseService[Source, SourceCreate, SourceUpdate, SourceResponse, SourceRepository]
):
    def __init__(self, repository: SourceRepository):
        super().__init__(Source, repository)

    async def create(self, entity: SourceCreate) -> SourceResponse:
        result = await self.repository.create(entity)
        return SourceResponse.model_validate(result)

    async def update(self, entity: Source, obj: SourceUpdate) -> SourceResponse:
        result = await self.repository.update(entity, obj)
        return SourceResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> SourceResponse:
        source = await self.repository.get_by_id(id)
        if not source:
            raise Exception("Source not found")
        return SourceResponse.model_validate(source)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[SourceResponse]:
        sources = await self.repository.get_all(skip, limit)
        result = [SourceResponse.model_validate(source) for source in sources]
        return result
