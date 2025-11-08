from uuid import UUID
from fastapi import APIRouter, Request

from src.api.depends.factory import NoteServiceDep
from src.core.utils.logger import get_logger
from src.modules.note.dtos.request_dtos import NoteCreate, NoteUpdate
from src.modules.note.dtos.response_dtos import NoteResponse

logger = get_logger(__name__)

note_router = APIRouter(
    prefix="/note",
    tags=["note"],
)


@note_router.post("/", response_model=NoteResponse)
async def create_note(request: Request, data: NoteCreate, note_service: NoteServiceDep):
    data.user_id = request.user.id
    note = await note_service.create(request.user.id, data)
    return note


@note_router.patch("/{id}", response_model=NoteResponse)
async def update_note(
    request: Request, id: UUID, data: NoteUpdate, note_service: NoteServiceDep
):
    result = await note_service.update(request.user.id, id, data)
    return result
