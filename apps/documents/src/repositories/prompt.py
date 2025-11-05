from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.prompt import Prompt
from src.schemas.requests.prompt import PromptCreate, PromptUpdate


logger = get_logger(__name__)


class PromptRepository(BaseRepository[Prompt, PromptCreate, PromptUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session
