from typing import Sequence
from uuid import UUID

from sqlmodel import select
from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.highlight import Highlight
from src.schemas.requests.highlight import HighlightCreate, HighlightUpdate


logger = get_logger(__name__)


class HighlightRepository(BaseRepository[Highlight, HighlightCreate, HighlightUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all_by_doc_id(self, doc_id: UUID) -> Sequence[Highlight]:
        stmt = select(Highlight).where(Highlight.document_id == doc_id)
        results = await self.session.exec(stmt)
        return results.all()
