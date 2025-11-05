from typing import Sequence
from uuid import UUID

from sqlmodel import select
from sqlalchemy.orm import selectinload
from src.core.repository.base import BaseRepository
from src.models.note import Note
from src.schemas.requests.note import NoteCreate, NoteUpdate
from sqlmodel.ext.asyncio.session import AsyncSession


class NoteRepository(BaseRepository[Note, NoteCreate, NoteUpdate]):
    def __init__(self, db_session: AsyncSession):
        super().__init__(Note, db_session)

    async def get_by_id_with_children(self, id: UUID) -> Note | None:
        query = (
            select(Note).options(selectinload(Note.re_children)).where(Note.id == id)
        )
        result = await self.session.exec(query)
        return result.one_or_none()

    async def get_by_user_id(self, user_id: UUID) -> Sequence[Note]:
        query = select(self.model_class).where(
            self.model_class.user_id == user_id, self.model_class.parent_id is None
        )
        result = await self.session.exec(query)
        return result.all()

    async def get_by_parent_id(self, parent_id: UUID) -> Sequence[Note]:
        query = select(self.model_class).where(self.model_class.parent_id == parent_id)
        result = await self.session.exec(query)
        return result.all()
