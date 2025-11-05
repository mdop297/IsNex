from fastapi import APIRouter, Request
from src.api.depends.factory import FolderServiceDep
from src.core.utils.logger import get_logger
from src.schemas.requests.folder import FolderCreate
from src.schemas.responses.folder import FolderResponse


logger = get_logger(__name__)

folder_router = APIRouter(prefix="/folders", tags=["folders"])


@folder_router.post("/", response_model=FolderResponse)
def create(request: Request, data: FolderCreate, folder_service: FolderServiceDep):
    # get user_id -> check folder name -> check parent_id belong to user_id -> create folder
    result = folder_service.create(request.user.id, data)
    return result


@folder_router.get("/", response_model=list[FolderResponse])
def get_all(request: Request, folder_service: FolderServiceDep):
    # eager load folders
    result = folder_service.get_all(request.user.id)
    return result
