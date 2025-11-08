from fastapi import APIRouter, Request
from src.api.depends.factory import PromptServiceDep
from src.core.utils.logger import get_logger
from src.modules.prompt.dtos.request_dtos import PromptCreate
from src.modules.prompt.dtos.response_dtos import PromptResponse


logger = get_logger(__name__)

prompt_router = APIRouter(prefix="/prompts", tags=["prompts"])


@prompt_router.post("/", response_model=PromptResponse)
async def create_prompt(
    request: Request, data: PromptCreate, prompt_service: PromptServiceDep
):
    result = await prompt_service.create(request.user.id, data)
    return result
