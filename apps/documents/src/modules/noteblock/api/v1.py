from fastapi import APIRouter, Request

from src.api.depends.factory import NoteBlockServiceDep
from src.core.utils.logger import get_logger
from src.modules.noteblock.dtos.request_dtos import NoteBlockCreate
from src.modules.noteblock.dtos.response_dtos import NoteBlockResponse


logger = get_logger(__name__)

noteblock_router = APIRouter(prefix="/noteblocks", tags=["noteblocks"])


@noteblock_router.post("/", response_model=NoteBlockResponse)
async def create_nb(
    request: Request, data: NoteBlockCreate, noteblock_service: NoteBlockServiceDep
):
    result = await noteblock_service.create(request.user.id, data)
    return result
