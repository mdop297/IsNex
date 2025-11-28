from uuid import UUID
from fastapi import APIRouter, Request

from src.api.depends.factory import ConversationServiceDep
from src.core.utils.logger import get_logger
from src.modules.conversation.dtos.request_dtos import (
    ConversationCreate,
    ConversationUpdate,
)
from src.modules.conversation.dtos.response_dtos import (
    ConversationResponse,
    PaginatedConversationResponse,
)

logger = get_logger(__name__)

conv_router = APIRouter(prefix="/convs", tags=["conversations"])


@conv_router.post("/", response_model=ConversationResponse)
async def create_conversation(
    request: Request, data: ConversationCreate, conv_service: ConversationServiceDep
):
    result = await conv_service.create(request.user.id, data)
    return result


@conv_router.patch("/{id}", response_model=ConversationResponse)
async def update_conversation(
    request: Request,
    id: UUID,
    data: ConversationUpdate,
    conv_service: ConversationServiceDep,
):
    result = await conv_service.update(request.user.id, id, data)
    return result

# we will get user_id from token, not from request param
@conv_router.get("/user", response_model=PaginatedConversationResponse)
async def get_all_conversations(request: Request, conv_service: ConversationServiceDep):
    result = await conv_service.get_by_user_id(user_id=request.user.id, skip=0, limit=20)
    return result

@conv_router.get("/{id}", response_model=ConversationResponse)
async def get_conversation(request: Request, id: UUID, conv_service: ConversationServiceDep):
    result = await conv_service.get_by_id(user_id=request.user.id, id=id)
    return result




@conv_router.get(
    "/workspace/{workspace_id}", response_model=PaginatedConversationResponse
)
async def get_conversations_by_workspace(
    req: Request, workspace_id: UUID, conv_service: ConversationServiceDep
):
    result = await conv_service.get_by_workspace_id(
        user_id=req.user.id, workspace_id=workspace_id, skip=0, limit=20
    )
    return result


@conv_router.delete("/{id}", response_model=bool)
async def delete_conversation(
    request: Request, id: UUID, conv_service: ConversationServiceDep
):
    result = await conv_service.delete(user_id=request.user.id, id=id)
    return result
