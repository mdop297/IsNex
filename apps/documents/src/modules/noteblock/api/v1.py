from uuid import UUID
from fastapi import APIRouter, Request

from src.api.depends.factory import NoteBlockServiceDep
from src.core.utils.logger import get_logger
from src.modules.noteblock.dtos.request_dtos import NoteBlockCreate, NoteBlockUpdate
from src.modules.noteblock.dtos.response_dtos import NoteBlockResponse


logger = get_logger(__name__)

noteblock_router = APIRouter(prefix="/noteblocks", tags=["noteblocks"])


@noteblock_router.post("/", response_model=NoteBlockResponse)
async def create_noteblock(
    request: Request, data: NoteBlockCreate, noteblock_service: NoteBlockServiceDep
):
    result = await noteblock_service.create(request.user.id, data)
    return result


@noteblock_router.patch("/{id}", response_model=NoteBlockResponse)
async def update_noteblock(
    request: Request,
    id: UUID,
    data: NoteBlockUpdate,
    noteblock_service: NoteBlockServiceDep,
):
    result = await noteblock_service.update(user_id=request.user.id, id=id, obj=data)
    return result


@noteblock_router.delete("/{id}", response_model=bool)
async def delete_noteblock(
    request: Request, id: UUID, noteblock_service: NoteBlockServiceDep
):
    result = await noteblock_service.delete(user_id=request.user.id, id=id)
    return result


@noteblock_router.get("/{id}", response_model=NoteBlockResponse)
async def get_noteblock(
    request: Request, id: UUID, noteblock_service: NoteBlockServiceDep
):
    result = await noteblock_service.get_by_id(request.user.id, id)
    return result


@noteblock_router.get("/note/{note_id}", response_model=list[NoteBlockResponse])
async def get_all_noteblocks_of_note(
    request: Request, note_id: UUID, noteblock_service: NoteBlockServiceDep
):
    result = await noteblock_service.get_by_note_id(request.user.id, note_id)
    return result
