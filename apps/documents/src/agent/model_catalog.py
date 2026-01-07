from dataclasses import dataclass
from os import getenv
from pprint import pprint
from typing import ClassVar
from langchain.agents.middleware import wrap_model_call
from langchain.chat_models import init_chat_model, BaseChatModel
from langchain.agents.middleware import (
    AgentMiddleware,
    ModelRequest,
    ModelResponse,
    before_model,
)
from typing import Callable


def _init_model(model_name: str) -> BaseChatModel:
    """Initialize a chat model via OpenRouter."""
    return init_chat_model(
        model=model_name,
        model_provider="openai",  # OpenRouter uses OpenAI-compatible API
        base_url="https://openrouter.ai/api/v1",
        api_key=getenv("OPENROUTER_API_KEY"),
    )


class SupportedModels:
    """Centralized model identifiers with full provider paths."""

    MIMO_V2_FLASH_FREE = "mimo-v2-flash:free"
    DEVSTRAL_2512_FREE = "devstral-2512:free"
    DEEPSEEK_V3_1_NEX_N1_FREE = "deepseek-v3.1-nex-n1:free"
    NEMOTRON_3_NANO_30B_A3B_FREE = "nemotron-3-nano-30b-a3b:free"

    DEEPSEEK_V3_2 = "deepseek-v3.2"
    GEMINI_2_5_FLASH = "gemini-2.5-flash"
    GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite"
    GEMINI_3_FLASH_PREVIEW = "gemini-3-flash-preview"
    GPT_OSS_120B = "gpt-oss-120b"
    GPT_4_1_NANO = "gpt-4.1-nano"
    GPT_4O = "gpt-4o"
    GROK_CODE_FAST_1 = "grok-code-fast-1"
    GROK_4_1_FAST = "grok-4.1-fast"

    _FULL_NAME_MAPPING: ClassVar[dict[str, str]] = {
        MIMO_V2_FLASH_FREE: "xiaomi/mimo-v2-flash:free",
        DEVSTRAL_2512_FREE: "mistralai/devstral-2512:free",
        DEEPSEEK_V3_1_NEX_N1_FREE: "nex-agi/deepseek-v3.1-nex-n1:free",
        NEMOTRON_3_NANO_30B_A3B_FREE: "nvidia/nemotron-3-nano-30b-a3b:free",
        ##
        DEEPSEEK_V3_2: "deepseek/deepseek-v3.2",
        GEMINI_2_5_FLASH: "google/gemini-2.5-flash",
        GEMINI_2_5_FLASH_LITE: "google/gemini-2.5-flash-lite",
        GEMINI_3_FLASH_PREVIEW: "google/gemini-3-flash-preview",
        GPT_OSS_120B: "openai/gpt-oss-120b",
        GPT_4_1_NANO: "openai/gpt-4.1-nano",
        GPT_4O: "openai/gpt-4o-2024-08-06",
        GROK_CODE_FAST_1: "x-ai/grok-code-fast-1",
        GROK_4_1_FAST: "x-ai/grok-4.1-fast",
    }

    @classmethod
    def get_full_name(cls, model_name: str, default: str | None = None) -> str:
        """Resolve short model name to full OpenRouter model string."""
        if default is None:
            default = cls.MIMO_V2_FLASH_FREE
        return cls._FULL_NAME_MAPPING.get(model_name, default)


class ModelCatalog:
    """Thread-safe singleton cache for initialized models."""

    _cache: ClassVar[dict[str, BaseChatModel]] = {}

    @classmethod
    def get_model(cls, model_name: str) -> BaseChatModel:
        """Get or initialize a model by short name."""
        if model_name not in cls._cache:
            print("================ 4 ================")

            full_name = SupportedModels.get_full_name(model_name)
            cls._cache[model_name] = _init_model(full_name)
        return cls._cache[model_name]

    @classmethod
    def clear_cache(cls) -> None:
        """Useful for testing or reloading models."""
        cls._cache.clear()


@dataclass
class AgentContext:
    model_name: str = SupportedModels.MIMO_V2_FLASH_FREE
    user_girlfriend: str = "Jane Doe"


class ModelSelectorMiddleware(AgentMiddleware):
    """Middleware that dynamically selects the LLM based on context."""

    def _select_model(self, request: ModelRequest) -> BaseChatModel:
        model_name = getattr(
            request.runtime.context, "model_name", SupportedModels.MIMO_V2_FLASH_FREE
        )
        selected_model = ModelCatalog.get_model(model_name)
        return selected_model

    def wrap_model_call(self, request: ModelRequest, handler) -> ModelResponse:
        selected_model = self._select_model(request)
        request = request.override(model=selected_model)
        return handler(request)

    async def awrap_model_call(self, request: ModelRequest, handler) -> ModelResponse:
        selected_model = self._select_model(request)
        request = request.override(model=selected_model)
        return await handler(request)


@wrap_model_call
def model_selector(
    request: ModelRequest, handler: Callable[[ModelRequest], ModelResponse]
) -> ModelResponse:
    # request.runtime.context hiện tại đang là None
    model_name = getattr(
        request.runtime.context,
        "model_name",
        # SupportedModels.NEMOTRON_3_NANO_30B_A3B_FREE,
        SupportedModels.DEVSTRAL_2512_FREE,
    )
    print("================ 3 ================")

    print("======================== REQUEST ========================")
    pprint(request)
    print("======================== REQUEST ========================")
    print("======================== CONTEXT ========================")
    pprint(request.runtime.context)
    print("======================== CONTEXT ========================")

    selected_model = ModelCatalog.get_model(model_name)
    return handler(request.override(model=selected_model))


# Singleton instance for convenience
# model_selector = ModelSelectorMiddleware()
