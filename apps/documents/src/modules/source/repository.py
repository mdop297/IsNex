from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.modules.source.model import Source
from src.modules.source.dtos.request_dtos import SourceCreate, SourceUpdate


class SourceRepository(BaseRepository[Source, SourceCreate, SourceUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session
