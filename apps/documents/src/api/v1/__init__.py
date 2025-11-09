from fastapi import APIRouter
from src.modules.document.api.v1 import document_router
from src.modules.folder.api.v1 import folder_router
from ...modules.highlight.api.v1 import highlight_router
from ...modules.conversation.api.v1 import conv_router

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(document_router)
v1_router.include_router(folder_router)
v1_router.include_router(highlight_router)
v1_router.include_router(conv_router)
__all__ = ["v1_router"]
