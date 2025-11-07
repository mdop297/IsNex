from fastapi import APIRouter, Request

from src.core.utils.logger import get_logger
from src.schemas.requests.conversation import ConversationCreate

logger = get_logger(__name__)

conv_router = APIRouter(prefix="/convs", tags=["conversations"])


@conv_router.post("/")
async def get_conversations(request: Request, data: ConversationCreate):
    data.user_id = request.user.id
    return
