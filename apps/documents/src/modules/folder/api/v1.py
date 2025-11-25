from uuid import UUID
from fastapi import APIRouter, Request
from src.api.depends.factory import FolderServiceDep
from src.core.utils.logger import get_logger
from src.modules.folder.dtos.request_dtos import FolderCreate, FolderUpdate
from src.modules.folder.dtos.response_dtos import FolderResponse


logger = get_logger(__name__)

folder_router = APIRouter(prefix="/folders", tags=["folders"])


@folder_router.post("/", response_model=FolderResponse)
async def create_folder(
    request: Request, data: FolderCreate, folder_service: FolderServiceDep
):
    # get user_id -> check folder name -> check parent_id belong to user_id -> create folder
    data.user_id = request.user.id
    result = await folder_service.create(request.user.id, data)
    return result


@folder_router.get("/", response_model=list[FolderResponse])
async def get_all_folders_by_user(request: Request, folder_service: FolderServiceDep):
    # eager load folders
    result = await folder_service.get_all(request.user.id)
    return result


@folder_router.get("/{id}", response_model=FolderResponse)
async def get_folder_by_id(request: Request, id: UUID, folder_service: FolderServiceDep):
    result = await folder_service.get_by_id(request.user.id, id)
    return result


@folder_router.patch("/{id}", response_model=FolderResponse)
async def update_folder(
    request: Request, id: UUID, data: FolderUpdate, folder_service: FolderServiceDep
):
    result = folder_service.update(request.user.id, id, data)
    return result


@folder_router.delete("/{id}")
async def delete_folder(request: Request, id: UUID, folder_service: FolderServiceDep):
    await folder_service.delete(request.user.id, id)
