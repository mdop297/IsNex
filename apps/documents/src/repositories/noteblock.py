from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.noteblock import NoteBlock
from src.schemas.requests.noteblock import NoteBlockCreate, NoteBlockUpdate


logger = get_logger(__name__)


class NoteBlockRepository(BaseRepository[NoteBlock, NoteBlockCreate, NoteBlockUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session
