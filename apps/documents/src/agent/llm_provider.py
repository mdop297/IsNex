from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel


from src.core.config import settings
from src.core.utils.logger import get_logger

logger = get_logger(__name__)


class LLMRegistry:
    LLMS = [
        {
            "name": "gpt-4.1-nano",
            "llm": ChatOpenAI(
                model="gpt-5-nano",
                api_key=settings.OPENAI_API_KEY,
                max_completion_tokens=settings.MAX_TOKENS,
            ),
        },
        {
            "name": "gpt-4.1-mini",
            "llm": ChatOpenAI(
                model="gpt-5-nano",
                api_key=settings.OPENAI_API_KEY,
                max_completion_tokens=settings.MAX_TOKENS,
                reasoning={"effort": "minimal"},
            ),
        },
        {
            "name": "gpt-5-nano",
            "llm": ChatOpenAI(
                model="gpt-5-nano",
                api_key=settings.OPENAI_API_KEY,
                max_completion_tokens=settings.MAX_TOKENS,
                reasoning={"effort": "minimal"},
            ),
        },
    ]

    @classmethod
    def get_model(cls, model_name: str, **kwargs) -> BaseChatModel:
        """Get an LLM by name with optional argument overrides.

        Args:
            model_name: Name of the model to retrieve
            **kwargs: Optional arguments to override default model configuration

        Returns:
            BaseChatModel instance

        Raises:
            ValueError: If model_name is not found in LLMS
        """
        # Find the model in the registry
        model_entry = None
        for entry in cls.LLMS:
            if entry["name"] == model_name:
                model_entry = entry
                break

        if not model_entry:
            available_models = [entry["name"] for entry in cls.LLMS]
            raise ValueError(
                f"model '{model_name}' not found in registry. available models: {', '.join(available_models)}"
            )

        # If user provides kwargs, create a new instance with those args
        if kwargs:
            logger.debug(
                "creating_llm_with_custom_args",
            )
            return ChatOpenAI(
                model=model_name, api_key=settings.OPENAI_API_KEY, **kwargs
            )

        # Return the default instance
        logger.debug("using_default_llm_instance")
        return model_entry["llm"]

    @classmethod
    def get_all_names(cls) -> list[str]:
        """Get all registered LLM names in order.

        Returns:
            List of LLM names
        """
        return [entry["name"] for entry in cls.LLMS]

    @classmethod
    def get_model_at_index(cls, index: int):
        """Get model entry at specific index.

        Args:
            index: Index of the model in LLMS list

        Returns:
            Model entry dict
        """
        if 0 <= index < len(cls.LLMS):
            return cls.LLMS[index]
        return cls.LLMS[0]


class LLMService:
    def __init__(self):
        self._llm = LLMRegistry.get_model(settings.DEFAULT_LLM_MODEL)
        logger.info(
            "llm_service_initialized",
            default_model=settings.DEFAULT_LLM_MODEL,
            environment=settings.ENVIRONMENT.value,
        )
