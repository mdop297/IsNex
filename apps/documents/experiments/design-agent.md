# Agent

## Components

- LLM
- Tools
- Memory
- System Prompt
- Structured Output
- Middleware

## methods

- Invoke
- Stream
- Bind tools
- Call tools

# LLM service

- LLM Registry: nơi để lưu và trả về các LLM tùy theo nhu cầu.
- LLM service:
  - constructor:
    - model name
    - configs
  - methods:
    - stream
    - bind tools
    - invoke
    - call tools
    - get model name khác nhau theo từng request

# Design

- The agent should:
  - read the incoming client message
  - classify request to use normal response or note
  - Search relevant documentation to answer questions if needed
  - if normal tools:
    - create draft response
  - if use note edit tool:
    - create response with note structured output
    - wait for human approval
