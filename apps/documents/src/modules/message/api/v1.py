from uuid import UUID
from fastapi import APIRouter, Request

from src.api.depends.factory import MessageServiceDep
from src.core.utils.logger import get_logger
from src.modules.message.dtos.request import MessageCreate, MessageUpdate
from src.modules.message.dtos.response import MessageResponse


logger = get_logger(__name__)

message_router = APIRouter(prefix="/messages", tags=["messages"])


@message_router.post("/", response_model=MessageResponse)
async def create_message(
    request: Request, data: MessageCreate, message_service: MessageServiceDep
):
    data.user_id = request.user.id
    message = await message_service.create(request.user.id, data)
    return message


@message_router.patch("/{id}", response_model=MessageResponse)
async def update_messae(
    request: Request, id: UUID, data: MessageUpdate, message_service: MessageServiceDep
):
    return await message_service.update(request.user.id, id, data)
