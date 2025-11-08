from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.note.repository import NoteRepository
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
            await self.__validate_parent_block(entity.parent_id, entity.note_id)
        result = await self.repository.create(entity)
        return NoteBlockResponse.model_validate(result)

    async def update(
        self, user_id: UUID, id: UUID, obj: NoteBlockUpdate
    ) -> NoteBlockResponse:
        block = await self.repository.get_by_id(
            id,
            fields=["id", "note_id", "parent_id"],
        )
        if not block:
            raise Exception("NoteBlock not found")

        # Validate ownership
        await self.__validate_note_ownership(note_id=block.note_id, user_id=user_id)

        # only validate parent_id if it changes
        if obj.parent_id is not None and obj.parent_id != block.parent_id:
            await self.__validate_parent_block(obj.parent_id, block.note_id)
            await self.__validate_no_circular_reference(id, obj.parent_id)

        # Update not null fields
        result = await self.repository.update(block, obj)
        return NoteBlockResponse.model_validate(result)

    async def delete(self, user_id: UUID, id: UUID) -> bool:
        # get block to get note_id
        block = await self.repository.get_by_id(id, fields=["id", "note_id"])
        if not block:
            raise ValueError("NoteBlock not found")

        # Validate note ownership
        note = await self.note_repository.get_by_id(
            block.note_id, fields=["id", "user_id"]
        )
        if not note:
            raise ValueError("Note not found")
        if note.user_id != user_id:
            raise PermissionError("Note does not belong to the user")

        return await self.repository.delete(block.id)

    async def get_by_id(self, user_id: UUID, id: UUID) -> NoteBlockResponse:
        noteblock = await self.repository.get_by_id(id)
        if not noteblock:
            raise Exception("NoteBlock not found")
        await self.__validate_note_ownership(note_id=noteblock.note_id, user_id=user_id)

        return NoteBlockResponse.model_validate(noteblock)

    async def get_by_note_id(
        self, user_id: UUID, note_id: UUID
    ) -> Sequence[NoteBlockResponse]:
        await self.__validate_note_ownership(note_id=note_id, user_id=user_id)
        noteblocks = await self.repository.get_by(field="note_id", value=note_id)
        if not noteblocks:
            return []
        result = [
            NoteBlockResponse.model_validate(noteblock) for noteblock in noteblocks
        ]
        return result

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

    async def __validate_no_circular_reference(
        self, block_id: UUID, new_parent_id: UUID
    ):
        """Prevent block from being its own ancestor"""
        current_id: UUID | None = new_parent_id
        visited: set[UUID] = set()

        while current_id:
            if current_id == block_id:
                raise Exception("Circular reference detected")
            if current_id in visited:
                break
            visited.add(current_id)

            parent = await self.repository.get_by_id(current_id, fields=["parent_id"])
            current_id = parent.parent_id if parent else None
