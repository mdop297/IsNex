from fastapi import APIRouter
import json
from fastapi.responses import StreamingResponse
from langchain.messages import (
    HumanMessage,
    ToolMessage,
    AIMessageChunk as lc_AIMessageChunk,
)
import asyncio
import mlflow.langchain as lc_tracer
from pydantic import computed_field
from src.agent.isnex_agents import agent
from src.agent.tools import tools
from langchain_core.messages import content as types
from src.core.utils.logger import logger


agent_router = APIRouter(prefix="/agent", tags=["agent"])


class AIMessage(lc_AIMessageChunk):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @computed_field
    def content_block(self) -> list[types.ContentBlock]:
        return super().content_blocks


@agent_router.get("/")
async def index():
    return {"message": "Hello, World!"}


@agent_router.post("/chat", response_model=AIMessage)
async def chat(body: dict):
    messages = body.get("messages", [])

    # Convert to LangChain messages
    lc_messages: list[HumanMessage | AIMessage | ToolMessage] = []
    for msg in messages:
        if msg["role"] == "user":
            lc_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            lc_messages.append(AIMessage(content=msg["content"]))

    async def generate():
        try:
            for token, metadata in agent.stream(
                {"messages": [*lc_messages]}, stream_mode="messages"
            ):
                response_data = {"choices": [{"delta": {}}]}
                content_block = (
                    token.content_blocks[0] if token.content_blocks else None  # type: ignore
                )  # type: ignore

                # Handle content
                if content_block and content_block.get("type") == "text":
                    response_data["choices"][0]["delta"]["content"] = content_block.get(
                        "text"
                    )
                    yield f"data: {json.dumps(response_data)}\n\n"

            yield "data: [DONE]\n\n"

        except asyncio.CancelledError:
            print("Stream cancelled by client")
            yield "data: [DONE]\n\n"
        except Exception as e:
            print(f"Error: {e}")
            import traceback

            traceback.print_exc()
            error_response = {
                "choices": [{"delta": {"content": f"\n\n_[Error: {str(e)}]_"}}]
            }
            yield f"data: {json.dumps(error_response)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@agent_router.post("/stream_chat", response_model=AIMessage)
async def stream_chat(body: dict):
    messages = body.get("messages", [])

    # Convert to LangChain messages
    lc_messages: list[HumanMessage | AIMessage | ToolMessage] = []
    for msg in messages:
        if msg["role"] == "user":
            lc_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            lc_messages.append(AIMessage(content=msg["content"]))

    async def generate():
        lc_tracer.autolog()

        try:
            async for chunk in agent.astream(
                {"messages": [*lc_messages]}, stream_mode="messages"
            ):
                logger.info(chunk)
                yield chunk

        except asyncio.CancelledError:
            logger.warning("Stream cancelled by client")
        except Exception as e:
            logger.error(f"Error during streaming: {e}", exc_info=True)
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
