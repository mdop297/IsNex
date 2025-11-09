from uuid import UUID
from fastapi import APIRouter, Request

from src.api.depends.factory import WorkspaceServiceDep
from src.core.utils.logger import get_logger
from src.modules.workspace.dtos.request_dtos import WorkspaceCreate, WorkspaceUpdate
from src.modules.workspace.dtos.response_dtos import WorkspaceResponse


logger = get_logger(__name__)

ws_router = APIRouter(
    prefix="/workspace",
    tags=["Workspace"],
    responses={404: {"description": "Not found"}},
)


# create workspace
@ws_router.post("/", response_model=WorkspaceResponse)
async def create(
    request: Request, data: WorkspaceCreate, ws_service: WorkspaceServiceDep
):
    result = await ws_service.create(user_id=request.user.id, entity=data)
    return result


# get all workspace by user
@ws_router.get("/", response_model=list[WorkspaceResponse])
async def get_all(request: Request, ws_service: WorkspaceServiceDep):
    result = await ws_service.get_all(user_id=request.user.id)
    return result


# get/load workspace (load documents, conversations, notes)
@ws_router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def get(request: Request, workspace_id: UUID, ws_service: WorkspaceServiceDep):
    result = await ws_service.get_by_id(user_id=request.user.id, id=workspace_id)
    return result


# update workspace
@ws_router.patch("/{workspace_id}", response_model=WorkspaceResponse)
async def update(
    request: Request,
    workspace_id: UUID,
    data: WorkspaceUpdate,
    ws_service: WorkspaceServiceDep,
):
    result = await ws_service.update(user_id=request.user.id, id=workspace_id, obj=data)
    return result


# add document to workspace
@ws_router.post(
    "/{workspace_id}/document/{document_id}", response_model=WorkspaceResponse
)
async def add_document_to_workspace(
    request: Request,
    workspace_id: UUID,
    document_id: UUID,
    ws_service: WorkspaceServiceDep,
):
    result = await ws_service.add_document_to_workspace(
        user_id=request.user.id, workspace_id=workspace_id, document_id=document_id
    )
    return result


# remove document from workspace

# add conversation to workspace

# remove conversation from workspace

# delete workspace

# open a workspace

# close a workspace
