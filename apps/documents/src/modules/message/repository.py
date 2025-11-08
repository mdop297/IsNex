from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.modules.message.model import Message
from src.modules.message.dtos.request import MessageCreate, MessageUpdate


logger = get_logger(__name__)


class MessageRepository(BaseRepository[Message, MessageCreate, MessageUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session
