from uuid import UUID
from fastapi import APIRouter, Request
from src.api.depends.factory import HighlightServiceDep
from src.core.utils.logger import get_logger
from src.schemas.requests.highlight import HighlightCreate, HighlightUpdate
from src.schemas.responses.highlight import HighlightResponse


logger = get_logger(__name__)

highlight_router = APIRouter(prefix="/highlights", tags=["highlights"])


@highlight_router.post("/", response_model=HighlightResponse)
async def create_highlight(
    request: Request, data: HighlightCreate, highlight_service: HighlightServiceDep
):
    highlight = await highlight_service.create(request.user.id, data)
    return highlight


@highlight_router.patch("/{id}", response_model=HighlightResponse)
async def update_hl(
    request: Request,
    id: UUID,
    data: HighlightUpdate,
    highlight_service: HighlightServiceDep,
):
    result = await highlight_service.update(request.user.id, id, data)
    return result
