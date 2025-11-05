from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.noteblock import NoteBlock
from src.repositories.noteblock import NoteBlockRepository
from src.schemas.requests.noteblock import NoteBlockCreate, NoteBlockUpdate

logger = get_logger(__name__)


class NoteBlockService(
    BaseService[NoteBlock, NoteBlockCreate, NoteBlockUpdate, NoteBlockRepository]
):
    def __init__(self, repository: NoteBlockRepository):
        super().__init__(NoteBlock, repository)

    async def create(self, entity: NoteBlockCreate) -> NoteBlock:
        result = await self.repository.create(entity)
        return result

    async def update(self, entity: NoteBlock, obj: NoteBlockUpdate) -> NoteBlock:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> NoteBlock:
        noteblock = await self.repository.get_by_id(id)
        if not noteblock:
            raise Exception("NoteBlock not found")
        return noteblock

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[NoteBlock]:
        noteblocks = await self.repository.get_all(skip, limit)
        return noteblocks
