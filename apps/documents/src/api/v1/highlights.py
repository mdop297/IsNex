from fastapi import APIRouter, Request
from src.api.depends.factory import HighlightServiceDep
from src.core.utils.logger import get_logger
from src.schemas.requests.highlight import HighlightCreate
from src.schemas.responses.highlight import HighlightResponse


logger = get_logger(__name__)

highlight_router = APIRouter(prefix="/highlights", tags=["highlights"])


@highlight_router.post("/")
async def create_highlight(
    request: Request, data: HighlightCreate, highlight_service: HighlightServiceDep
):
    await highlight_service.create(request.user.id, data)
    return
