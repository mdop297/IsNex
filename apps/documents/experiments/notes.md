# UI cần data schemas như nào?

# Langchain, Langgraph, DeepAgent

## invoke khác gì stream

**invoke**:

- input: 1 hoặc 1 list messages
- output: AIMessage
  **Stream**:
- input: string,
- output: multiple AIMessageChunk objects

## How to get text reponse

- How to get reasoning tokens
- How to get tool calls token
- How to get tool calls failed
- How to get source url
- How to get source document
- How to get file or link to file
- How to display image in chat conversation box
- How to make model return structure output
- How to get usage metadata
- Input của chat route là gì
- Output của model có dạng gì
- Nếu trong 1 phản hồi, llm cần dùng nhiều tool và reasoning, thì làm sao stream mấy loại token đó về frontend.
- Làm sao để stream response về frontend

# Advanced

- Làm sao để retry
- Làm sao để user stop khi llm đang phản hồi
- How to open note and write into it
- How to edit content saved in some note.
- Làm sao để agent có thể lấy thông tin của notes rồi tạo flash cards, câu hỏi trắc nghiệm?

# Notes

- IMPORTANT BUG: làm sao xử lý trường hợp structured output không đủ thông tin. (đang bị call loop vô cực => hết credits) => dùng ProviderStrategy (cách này dùng llm có hỗ trợ structured output của riêng nó để check, chứ không phụ thuộc tool nên không lặp vô hạn.)
-

# OOP classes

- nhiều agent khác nhau

```bash
Agent
├── Identity (id, version)
├── Prompt (system, dynamic context)
├── Models
│   ├── routing
│   └── fallback
├── Execution
│   ├── strategy
│   └── lifecycle hooks
├── Tools
│   ├── registry
│   └── policy
├── Memory
│   ├── short-term
│   └── long-term
├── State
├── Guardrails
├── Middleware
├── Output Schema
├── Telemetry
└── Security
```
