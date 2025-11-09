from uuid import UUID
from sqlmodel import func, select
from src.core.repository.base import BaseRepository
from src.core.utils.logger import get_logger
from sqlmodel.ext.asyncio.session import AsyncSession

from src.modules.conversation.model import Conversation
from src.modules.conversation.dtos.request_dtos import (
    ConversationCreate,
    ConversationUpdate,
)


logger = get_logger(__name__)


class ConversationRepository(
    BaseRepository[Conversation, ConversationCreate, ConversationUpdate]
):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def count_by_workspace_id(self, workspace_id: UUID) -> int:
        stmt = select(func.count()).where(Conversation.workspace_id == workspace_id)
        result = await self.session.exec(stmt)
        return result.one()
