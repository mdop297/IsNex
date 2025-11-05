from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.folder import Folder
from src.schemas.requests.folder import FolderCreate, FolderUpdate


logger = get_logger(__name__)


class FolderRepository(BaseRepository[Folder, FolderCreate, FolderUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session
