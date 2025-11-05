from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.message import Message
from src.schemas.requests.message import MessageCreate, MessageUpdate


logger = get_logger(__name__)


class MessageRepository(BaseRepository[Message, MessageCreate, MessageUpdate]):
    def __init__(self, session: AsyncSession):
        self.session = session
