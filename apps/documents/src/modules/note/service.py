from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.note.model import Note
from src.modules.note.repository import NoteRepository
from src.modules.note.dtos.request_dtos import NoteCreate, NoteUpdate
from src.modules.note.dtos.response_dtos import NoteResponse

logger = get_logger(__name__)


class NoteService(
    BaseService[Note, NoteCreate, NoteUpdate, NoteResponse, NoteRepository]
):
    def __init__(self, repository: NoteRepository):
        super().__init__(Note, repository)

    async def create(self, user_id: UUID, entity: NoteCreate) -> NoteResponse:
        if entity.parent_id:
            await self.__validate_parent_note_ownership(entity.parent_id, user_id)
        result = await self.repository.create(entity)
        return NoteResponse.model_validate(result)

    async def update(self, user_id: UUID, id: UUID, obj: NoteUpdate) -> NoteResponse:
        entity = await self.__validate_note_ownership(id, user_id)
        result = await self.repository.update(entity, obj)
        return NoteResponse.model_validate(result)

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> NoteResponse:
        note = await self.repository.get_by_id(id)
        if not note:
            raise Exception("Note not found")
        return NoteResponse.model_validate(note)

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[NoteResponse]:
        notes = await self.repository.get_all(skip, limit)
        result = [NoteResponse.model_validate(note) for note in notes]
        return result

    async def __validate_parent_note_ownership(self, parent_id: UUID, user_id: UUID):
        parent_note = await self.repository.get_by_id(parent_id)
        if not parent_note:
            raise Exception("Parent note not found")
        if parent_note.user_id != user_id:
            raise Exception("Parent note does not belong to the user")

    async def __validate_note_ownership(self, note_id: UUID, user_id: UUID) -> Note:
        note = await self.repository.get_by_id(note_id)
        if not note:
            raise Exception("Note not found")
        if note.user_id != user_id:
            raise Exception("Note does not belong to the user")
        return note
