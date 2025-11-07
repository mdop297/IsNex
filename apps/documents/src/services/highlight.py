from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.highlight import Highlight
from src.repositories.highlight import HighlightRepository
from src.schemas.requests.highlight import HighlightCreate, HighlightUpdate
from src.schemas.responses.highlight import HighlightResponse

logger = get_logger(__name__)


class HighlightService(
    BaseService[
        Highlight,
        HighlightCreate,
        HighlightUpdate,
        HighlightResponse,
        HighlightRepository,
    ]
):
    def __init__(
        self,
        repository: HighlightRepository,
    ):
        super().__init__(Highlight, repository)

    async def create(self, user_id: UUID, entity: HighlightCreate) -> HighlightResponse:
        # TODO: validate document belong to user using document repository
        result = await self.repository.create(entity)
        return HighlightResponse.model_validate(result)

    async def update(
        self, entity: Highlight, obj: HighlightUpdate
    ) -> HighlightResponse:
        result = await self.repository.update(entity, obj)
        return HighlightResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> HighlightResponse:
        highlight = await self.repository.get_by_id(id)
        if not highlight:
            raise Exception("Highlight not found")
        return HighlightResponse.model_validate(highlight)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[HighlightResponse]:
        highlights = await self.repository.get_all(skip, limit)
        results = [
            HighlightResponse.model_validate(highlight) for highlight in highlights
        ]
        return results

    # async def validate_document(self, )
