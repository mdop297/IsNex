from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.conversation import Conversation
from src.schemas.requests.conversation import ConversationCreate, ConversationUpdate


logger = get_logger(__name__)


class ConversationRepository(
    BaseRepository[Conversation, ConversationCreate, ConversationUpdate]
):
    def __init__(self, session: AsyncSession):
        self.session = session
