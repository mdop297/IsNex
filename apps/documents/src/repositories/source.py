from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.source import Source
from src.schemas.requests.source import SourceCreate, SourceUpdate


logger = get_logger(__name__)


class SourceRepository(BaseRepository[Source, SourceCreate, SourceUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session
