from pydantic import BaseModel
from langchain.messages import AIMessage, HumanMessage, ToolMessage, SystemMessage
from langchain.messages import (
    AIMessageChunk,
    ToolCallChunk,
    ServerToolCallChunk,
    InvalidToolCall,
)
from langchain_core.messages import BaseMessage, BaseMessageChunk
from langchain_core.messages import content


class Message(BaseMessageChunk):
    content_block: list[content.ContentBlock] = []
