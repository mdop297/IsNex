from langchain.agents import create_agent
from src.agent.model_catalog import AgentContext, SupportedModels, _init_model
from src.agent.model_catalog import model_selector
from src.agent.tools import tools

model = _init_model(model_name=SupportedModels.DEEPSEEK_V3_1_NEX_N1_FREE)

agent = create_agent(
    model,
    tools=tools,
    system_prompt="You are a helpful assistant. Be concise and accurate. Only use tools when the query requires it.",
    middleware=[model_selector],  # type: ignore
    context_schema=AgentContext,
)
