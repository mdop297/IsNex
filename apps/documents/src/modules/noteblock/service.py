from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.noteblock.dtos.response_dtos import NoteBlockResponse
from src.modules.noteblock.model import NoteBlock
from src.modules.noteblock.repository import NoteBlockRepository
from src.modules.noteblock.dtos.request_dtos import NoteBlockCreate, NoteBlockUpdate

logger = get_logger(__name__)


class NoteBlockService(
    BaseService[
        NoteBlock,
        NoteBlockCreate,
        NoteBlockUpdate,
        NoteBlockResponse,
        NoteBlockRepository,
    ]
):
    def __init__(self, repository: NoteBlockRepository):
        super().__init__(NoteBlock, repository)

    async def create(self, entity: NoteBlockCreate) -> NoteBlockResponse:
        result = await self.repository.create(entity)
        return NoteBlockResponse.model_validate(result)

    async def update(
        self, entity: NoteBlock, obj: NoteBlockUpdate
    ) -> NoteBlockResponse:
        result = await self.repository.update(entity, obj)
        return NoteBlockResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> NoteBlockResponse:
        noteblock = await self.repository.get_by_id(id)
        if not noteblock:
            raise Exception("NoteBlock not found")
        return NoteBlockResponse.model_validate(noteblock)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[NoteBlockResponse]:
        noteblocks = await self.repository.get_all(skip, limit)
        result = [
            NoteBlockResponse.model_validate(noteblock) for noteblock in noteblocks
        ]
        return result
