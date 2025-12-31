from langchain.tools import tool


@tool
def get_weather(location: str) -> str:
    """Get the weather for a location"""
    # Fake weather data
    return f"The weather in {location} is sunny and 25°C"


@tool
def calculate(expression: str) -> str:
    """Calculate a mathematical expression"""
    try:
        result = eval(expression)
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {str(e)}"


@tool
def search_web(query: str) -> str:
    """Search the web for information"""
    return f"Search results for '{query}': Found 10 results about {query}"


tools = [get_weather, calculate, search_web]
