from pprint import pprint
from fastapi import APIRouter
import json
from fastapi.responses import StreamingResponse
from langchain_openai import ChatOpenAI
from langchain.messages import (
    HumanMessage,
    ToolMessage,
    AIMessageChunk as lc_AIMessageChunk,
)
import asyncio
import mlflow.langchain as lc_tracer
from pydantic import computed_field
from src.agent.tools import tools
from langchain_core.messages import content as types
from langchain.agents import create_agent
from langchain.chat_models import init_chat_model
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


model = init_chat_model(
    model="gpt-4.1-nano",
    max_completion_tokens=2048,
    timeout=30,
)
agent = create_agent(
    model,
    tools=tools,
    system_prompt="You are a helpful assistant. Be concise and accurate.",
)


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
        # lc_tracer.autolog()

        # llm_with_tools = llm.bind_tools(tools)

        try:
            tool_call_index = 0

            for token, metadata in agent.stream(
                {"messages": [*lc_messages]},
                stream_mode="messages",
                config={"configurable": {"model": "gpt-5-nano"}},
            ):
                response_data = {"choices": [{"delta": {}}]}
                pprint(token)
                pprint(f"METADATA {metadata}")
                pprint(f"CONTENT_BLOCK: {token.content_blocks}")  # type:ignore
                content_block = (
                    token.content_blocks[0] if token.content_blocks else None
                )  # type: ignore

                # if tool_call_index == 0 and content_block.text and len(chunk.content) < 10:
                #     response_data["choices"][0]["delta"]["reasoning"] = "Analyzing the user's request and determining the best approach..."

                #     yield f'data: {json.dumps(response_data)}\n\n'
                #     response_data = {"choices": [{"delta": {}}]}

                # Handle content
                if content_block and content_block.get("type") == "text":
                    response_data["choices"][0]["delta"]["content"] = content_block.get(
                        "text"
                    )
                    yield f"data: {json.dumps(response_data)}\n\n"

                await asyncio.sleep(0.01)

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

        llm = ChatOpenAI(model="gpt-4.1-nano", streaming=True, temperature=0.7)

        llm_with_tools = llm.bind_tools(tools)

        # Thu thập tất cả chunks để log
        collected_chunks = []
        full_response: str = ""
        tool_calls_made = []

        try:
            tool_call_index = 0

            async for chunk in llm_with_tools.astream(lc_messages):
                # Lưu chunk để log sau
                collected_chunks.append(
                    {
                        "chunk": chunk,
                        "reasoning": [
                            r
                            for r in chunk.content_blocks
                            if r.get("type") == "reasoning"
                        ]
                        if hasattr(chunk, "content_blocks")
                        else None,
                        "content": chunk.content if chunk.content else None,
                        "tool_calls": chunk.tool_calls
                        if hasattr(chunk, "tool_calls")
                        else None,
                    }
                )

                response_data = {"choices": [{"delta": {}}]}

                if tool_call_index == 0 and chunk.content and len(chunk.content) < 10:
                    response_data["choices"][0]["delta"]["reasoning"] = (
                        "Analyzing the user's request and determining the best approach..."
                    )
                    yield f"data: {json.dumps(response_data)}\n\n"
                    response_data = {"choices": [{"delta": {}}]}

                # Handle content
                if chunk.content:
                    # Ensure full_response remains a string; convert non-str content to JSON
                    full_response += (
                        chunk.content
                        if isinstance(chunk.content, str)
                        else json.dumps(chunk.content)
                    )
                    response_data["choices"][0]["delta"]["content"] = chunk.content
                    yield f"data: {json.dumps(response_data)}\n\n"

                # Handle tool calls
                if hasattr(chunk, "tool_calls") and chunk.tool_calls:
                    for tool_call in chunk.tool_calls:
                        # Lưu tool call để log
                        tool_calls_made.append(
                            {
                                "name": tool_call.get("name"),
                                "args": tool_call.get("args", {}),
                            }
                        )

                        # Send tool call info
                        response_data["choices"][0]["delta"]["tool_calls"] = [
                            {
                                "index": tool_call_index,
                                "function": {
                                    "name": tool_call.get("name", ""),
                                    "arguments": json.dumps(tool_call.get("args", {})),
                                },
                            }
                        ]
                        yield f"data: {json.dumps(response_data)}\n\n"

                        # Execute tool
                        tool_name = tool_call.get("name")
                        tool_args = tool_call.get("args", {})

                        # Find and execute tool
                        for t in tools:
                            if t.name == tool_name:
                                try:
                                    result = t.invoke(tool_args)

                                    # Send tool result
                                    tool_result_data = {
                                        "tool_result": {
                                            "tool_call_id": str(tool_call_index),
                                            "result": result,
                                        }
                                    }
                                    yield f"data: {json.dumps(tool_result_data)}\n\n"

                                    # Add tool result to messages and continue
                                    lc_messages.append(
                                        AIMessage(
                                            content="",
                                            additional_kwargs={
                                                "tool_calls": [tool_call]
                                            },
                                        )
                                    )

                                    # Create tool result message
                                    lc_messages.append(
                                        ToolMessage(
                                            content=str(result),
                                            tool_call_id=str(tool_call_index),
                                        )
                                    )

                                    # Stream follow-up response
                                    async for follow_chunk in llm.astream(lc_messages):
                                        # Lưu follow-up chunks
                                        collected_chunks.append(
                                            {
                                                "content": follow_chunk.content
                                                if follow_chunk.content
                                                else None,
                                                "is_follow_up": True,
                                            }
                                        )
                                        if follow_chunk.content:
                                            # Ensure appending a string; convert non-str content to JSON
                                            full_response += (
                                                follow_chunk.content
                                                if isinstance(follow_chunk.content, str)
                                                else json.dumps(follow_chunk.content)
                                            )
                                            follow_data = {
                                                "choices": [
                                                    {
                                                        "delta": {
                                                            "content": follow_chunk.content
                                                        }
                                                    }
                                                ]
                                            }
                                            yield f"data: {json.dumps(follow_data)}\n\n"
                                            yield f"data: {json.dumps(follow_data)}\n\n"

                                except Exception as e:
                                    error_data = {
                                        "tool_result": {
                                            "tool_call_id": str(tool_call_index),
                                            "result": f"Error: {str(e)}",
                                        }
                                    }
                                    yield f"data: {json.dumps(error_data)}\n\n"
                                break

                        tool_call_index += 1

            # Log sau khi hoàn thành streaming
            logger.info("=== Stream Completed ===")
            logger.info(f"Total chunks received: {len(collected_chunks)}")
            logger.info(f"Full response length: {len(full_response)} characters")
            logger.info(f"Tool calls made: {len(tool_calls_made)}")
            logger.info(f"Chunk object: {collected_chunks}")

            if tool_calls_made:
                logger.info(
                    f"Tool calls details: {json.dumps(tool_calls_made, indent=2)}"
                )

            logger.info(f"Complete response:\n{full_response}")

            # Hoặc log chi tiết từng chunk nếu cần debug
            # logger.debug(f"All chunks: {json.dumps(collected_chunks, indent=2)}")

            yield "data: [DONE]\n\n"

        except asyncio.CancelledError:
            logger.warning("Stream cancelled by client")
            logger.info(f"Partial response before cancellation: {full_response}")
            yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"Error during streaming: {e}", exc_info=True)
            logger.info(f"Partial response before error: {full_response}")
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
