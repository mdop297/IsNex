from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.modules.workspace.model import Workspace
from src.modules.workspace.dtos.request_dtos import WorkspaceCreate, WorkspaceUpdate


logger = get_logger(__name__)


class WorkspaceRepository(BaseRepository[Workspace, WorkspaceCreate, WorkspaceUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session
