from fastapi import APIRouter
from .document import document_router
from .folder import folder_router
from .highlight import highlight_router
from .conversation import conv_router

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(document_router)
v1_router.include_router(folder_router)
v1_router.include_router(highlight_router)
v1_router.include_router(conv_router)
__all__ = ["v1_router"]
