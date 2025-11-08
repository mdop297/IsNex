from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.note.repository import NoteRepository
from src.modules.note.service import NoteService
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
    def __init__(
        self, repository: NoteBlockRepository, note_repository: NoteRepository
    ):
        super().__init__(NoteBlock, repository)
        self.note_repository = note_repository

    async def create(self, user_id: UUID, entity: NoteBlockCreate) -> NoteBlockResponse:
        await self.__validate_note_ownership(note_id=entity.note_id, user_id=user_id)
        if entity.parent_id:
            await self.__validate_parent_block(entity.parent_id, user_id)
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

    async def __validate_note_ownership(self, note_id: UUID, user_id: UUID):
        note = await self.note_repository.get_by_id(note_id, fields=["id", "user_id"])
        if not note:
            raise Exception("Note not found")
        if note.user_id != user_id:
            raise Exception("Note does not belong to the user")

    async def __validate_parent_block(self, parent_id: UUID, note_id: UUID):
        parent_block = await self.repository.get_by_id(
            parent_id, fields=["id", "note_id"]
        )
        if not parent_block:
            raise Exception("Parent block not found")
        if parent_block.note_id != note_id:
            raise Exception("Parent block does not belong to the note")

    async def __validate_noteblock(self, block_id: UUID, note_id: UUID) -> NoteBlock:
        noteblock = await self.repository.get_by_id(block_id)
        if not noteblock:
            raise Exception("NoteBlock not found")
        if noteblock.note_id != note_id:
            raise Exception("NoteBlock does not belong to the note")
        return noteblock
