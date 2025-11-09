from fastapi import APIRouter, Request

from src.api.depends.factory import WorkspaceServiceDep
from src.core.utils.logger import get_logger
from src.modules.workspace.dtos.request_dtos import WorkspaceCreate
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


# get all workspace

# get/load workspace

# update workspace

# add document to workspace

# remove document from workspace

# add conversation to workspace

# remove conversation from workspace

# delete workspace

# open a workspace

# close a workspace
