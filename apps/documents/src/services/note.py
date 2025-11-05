from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.models.note import Note
from src.repositories.note import NoteRepository
from src.schemas.requests.note import NoteCreate, NoteUpdate

logger = get_logger(__name__)


class NoteService(BaseService[Note, NoteCreate, NoteUpdate, NoteRepository]):
    def __init__(self, repository: NoteRepository):
        super().__init__(Note, repository)

    async def create(self, entity: NoteCreate) -> Note:
        result = await self.repository.create(entity)
        return result

    async def update(self, entity: Note, obj: NoteUpdate) -> Note:
        result = await self.repository.update(entity, obj)
        return result

    async def delete(self, id: UUID) -> bool:
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, id: UUID) -> Note:
        note = await self.repository.get_by_id(id)
        if not note:
            raise Exception("Note not found")
        return note

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[Note]:
        notes = await self.repository.get_all(skip, limit)
        return notes
