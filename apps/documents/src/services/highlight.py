from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.highlight import Highlight
from src.repositories.document import DocumentRepository
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
        self, repository: HighlightRepository, document_repository: DocumentRepository
    ):
        super().__init__(Highlight, repository)
        self.document_repository = document_repository

    async def create(self, user_id: UUID, entity: HighlightCreate) -> HighlightResponse:
        await self.__validate_document(user_id, entity.document_id)
        result = await self.repository.create(entity)
        return HighlightResponse.model_validate(result)

    async def update(
        self, user_id: UUID, hl_id: UUID, data: HighlightUpdate
    ) -> HighlightResponse:
        hl_entity = await self.__get_user_highlight(user_id=user_id, hl_id=hl_id)
        result = await self.repository.update(hl_entity, data)
        return HighlightResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, user_id: UUID, id: UUID) -> HighlightResponse:
        highlight = await self.__get_user_highlight(user_id=user_id, hl_id=id)
        return HighlightResponse.model_validate(highlight)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[HighlightResponse]:
        highlights = await self.repository.get_all(skip, limit)
        results = [
            HighlightResponse.model_validate(highlight) for highlight in highlights
        ]
        return results

    async def __validate_document(self, user_id: UUID, document_id: UUID):
        document = await self.document_repository.get_by_id(document_id)
        if not document:
            raise Exception("Document not found")
        if document.user_id != user_id:
            raise Exception("Document does not belong to user")

    async def __get_user_highlight(self, user_id: UUID, hl_id: UUID) -> Highlight:
        highlight = await self.repository.get_by_id(hl_id)
        if not highlight:
            raise Exception("Highlight not found")
        if highlight.user_id != user_id:
            raise Exception("Highlight does not belong to user")
        return highlight
