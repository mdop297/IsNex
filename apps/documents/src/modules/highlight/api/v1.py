from uuid import UUID
from fastapi import APIRouter, HTTPException, Query, Request
from src.api.depends.factory import HighlightServiceDep
from src.core.utils.logger import get_logger
from src.modules.highlight.dtos.request_dtos import HighlightCreate, HighlightUpdate
from src.modules.highlight.dtos.response_dtos import (
    HighlightResponse,
    PaginatedHighlightResponse,
)


logger = get_logger(__name__)

highlight_router = APIRouter(prefix="/hls", tags=["highlights"])


@highlight_router.post("/", response_model=HighlightResponse)
async def create_highlight(
    request: Request, data: HighlightCreate, highlight_service: HighlightServiceDep
):
    data.user_id = request.user.id
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


@highlight_router.get("/{id}", response_model=HighlightResponse)
async def get_hl(request: Request, id: UUID, highlight_service: HighlightServiceDep):
    result = await highlight_service.get_by_id(request.user.id, id)
    return result


@highlight_router.get("/doc/{doc_id}", response_model=list[HighlightResponse])
async def get_hls_of_document(
    request: Request, doc_id: UUID, highlight_service: HighlightServiceDep
):
    result = await highlight_service.get_all_by_doc_id(request.user.id, doc_id)
    return result


@highlight_router.get("/user", response_model=PaginatedHighlightResponse)
async def get_all(
    request: Request,
    highlight_service: HighlightServiceDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
):
    try:
        result = await highlight_service.get_by_user_id(
            user_id=request.user.id, skip=skip, limit=limit
        )
        return result
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch highlights")


@highlight_router.delete("/{id}", response_model=bool)
async def delete_hl(request: Request, id: UUID, highlight_service: HighlightServiceDep):
    result = await highlight_service.delete(id)
    return result
