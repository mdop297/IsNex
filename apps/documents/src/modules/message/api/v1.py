from fastapi import APIRouter, Request

from src.api.depends.factory import MessageServiceDep
from src.core.utils.logger import get_logger
from src.modules.message.dtos.request_dtos import MessageCreate
from src.modules.message.dtos.response_dtos import MessageResponse


logger = get_logger(__name__)

message_router = APIRouter(prefix="/messages", tags=["messages"])


@message_router.post("/", response_model=MessageResponse)
async def create_message(
    request: Request, data: MessageCreate, message_service: MessageServiceDep
):
    data.user_id = request.user.id
    message = await message_service.create(request.user.id, data)
    return message
