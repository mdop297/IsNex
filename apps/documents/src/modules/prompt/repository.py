from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.modules.prompt.model import Prompt
from src.modules.prompt.dtos.request_dtos import PromptCreate, PromptUpdate




class PromptRepository(BaseRepository[Prompt, PromptCreate, PromptUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session
