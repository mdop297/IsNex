from fastapi import APIRouter

from src.core.utils.logger import get_logger

logger = get_logger(__name__)


source_router = APIRouter(prefix="/sources", tags=["sources"])
