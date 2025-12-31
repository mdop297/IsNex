from pydantic import BaseModel
from src.agent.llm_provider import LLMProvider
from langchain_core.tools import BaseTool


class Agent:
    def __init__(
        self,
        llm_provider: LLMProvider,
        tools: list[BaseTool],
        system_prompt: str = "You are a helpful assistant.",
        memory=None,
        output_schema=BaseModel,
        streaming=True,
    ):
        self.llm_provider = llm_provider
        self.tools = tools
        self.system_prompt = system_prompt
        self.memory = memory
        self.output_schema = output_schema
        self.streaming = streaming

    def stream(self, messages):
        pass
