from fastapi import APIRouter
from src.modules.conversation.api.v1 import conv_router
from src.modules.document.api.v1 import document_router
from src.modules.folder.api.v1 import folder_router
from src.modules.highlight.api.v1 import highlight_router
from src.modules.message.api.v1 import message_router
from src.modules.note.api.v1 import note_router
from src.modules.noteblock.api.v1 import noteblock_router
from src.modules.prompt.api.v1 import prompt_router
from src.modules.workspace.api.v1 import ws_router

v1_router = APIRouter(prefix="/v1")

v1_router.include_router(document_router)
v1_router.include_router(folder_router)
v1_router.include_router(highlight_router)
v1_router.include_router(conv_router)
v1_router.include_router(message_router)
v1_router.include_router(note_router)
v1_router.include_router(noteblock_router)
v1_router.include_router(prompt_router)
v1_router.include_router(ws_router)
__all__ = ["v1_router"]
