/* eslint-disable */
'use client';

import { useState, useRef } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Loader } from '@/components/ai-elements/loader';
import { Copy } from 'lucide-react';
import { coreApi } from '@/lib/api';

interface MessagePart {
  type: 'text' | 'reasoning' | 'tool';
  text?: string;
  toolName?: string;
  toolArgs?: any;
  toolResult?: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  parts: MessagePart[];
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    if (!hasText || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text: message.text }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    abortControllerRef.current = new AbortController();
    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/agent/stream_chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.parts.find((p) => p.type === 'text')?.text || '',
            })),
          }),
          signal: abortControllerRef.current.signal,
          credentials: 'include',
        },
      );

      // const response = await coreApi.chat({
      //   messages: [...messages, userMessage].map((m) => ({
      //     role: m.role,
      //     content: m.parts.find((p) => p.type === 'text')?.text || '',
      //   })),
      //   headers: { 'Content-Type': 'application/json' },
      //   signal: abortControllerRef.current.signal,
      // });

      console.log(response);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        parts: [],
      };

      let currentTextPart = '';
      let currentReasoningPart = '';
      let toolCalls: any[] = [];

      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);

                // Handle content
                if (parsed.choices?.[0]?.delta?.content) {
                  currentTextPart += parsed.choices[0].delta.content;
                }

                // Handle reasoning tokens
                if (parsed.choices?.[0]?.delta?.reasoning) {
                  currentReasoningPart += parsed.choices[0].delta.reasoning;
                }

                // Handle tool calls
                if (parsed.choices?.[0]?.delta?.tool_calls) {
                  const toolCall = parsed.choices[0].delta.tool_calls[0];
                  if (toolCall) {
                    if (toolCall.index !== undefined) {
                      if (!toolCalls[toolCall.index]) {
                        toolCalls[toolCall.index] = {
                          name: toolCall.function?.name || '',
                          args: '',
                          result: null,
                        };
                      }
                      if (toolCall.function?.arguments) {
                        toolCalls[toolCall.index].args +=
                          toolCall.function.arguments;
                      }
                    }
                  }
                }

                // Handle tool results
                if (parsed.tool_result) {
                  const { tool_call_id, result } = parsed.tool_result;
                  const toolCall = toolCalls.find((t) => t.id === tool_call_id);
                  if (toolCall) {
                    toolCall.result = result;
                  }
                }

                // Update message parts
                const newParts: MessagePart[] = [];

                if (currentReasoningPart) {
                  newParts.push({
                    type: 'reasoning',
                    text: currentReasoningPart,
                  });
                }

                if (toolCalls.length > 0) {
                  toolCalls.forEach((tool) => {
                    newParts.push({
                      type: 'tool',
                      toolName: tool.name,
                      toolArgs: tool.args,
                      toolResult: tool.result,
                    });
                  });
                }

                if (currentTextPart) {
                  newParts.push({
                    type: 'text',
                    text: currentTextPart,
                  });
                }

                assistantMessage.parts = newParts;

                // Update UI
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { ...assistantMessage };
                  return newMessages;
                });
              } catch (e) {
                console.error('Parse error:', e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted by user');
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'assistant' && lastMsg.parts.length > 0) {
            const lastPart = lastMsg.parts[lastMsg.parts.length - 1];
            if (lastPart.type === 'text') {
              lastPart.text += '\n\n_[Interrupted by user]_';
            }
          }
          return newMessages;
        });
      } else {
        console.error('Error:', error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chat with AI</h1>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showReasoning}
            onChange={(e) => setShowReasoning(e.target.checked)}
            className="cursor-pointer"
          />
          <span className="text-sm">Show reasoning</span>
        </label>
      </div>

      {/* Conversation */}
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'reasoning':
                    return showReasoning ? (
                      <Reasoning
                        key={`${message.id}-${i}`}
                        className="w-full mb-3"
                        isStreaming={
                          isLoading && message.id === messages.at(-1)?.id
                        }
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text!}</ReasoningContent>
                      </Reasoning>
                    ) : null;

                  case 'tool':
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded text-sm"
                      >
                        <div className="font-semibold text-purple-800 mb-1">
                          🔧 Tool: {part.toolName}
                        </div>
                        <div className="text-purple-900">
                          <div className="mb-1">
                            <span className="font-medium">Args:</span>
                            <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                              {typeof part.toolArgs === 'string'
                                ? part.toolArgs
                                : JSON.stringify(
                                    JSON.parse(part.toolArgs || '{}'),
                                    null,
                                    2,
                                  )}
                            </pre>
                          </div>
                          {part.toolResult && (
                            <div>
                              <span className="font-medium">Result:</span>
                              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(part.toolResult, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    );

                  case 'text':
                    return (
                      <Message key={`${message.id}-${i}`} from={message.role}>
                        <MessageContent>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                        {message.role === 'assistant' && (
                          <MessageActions>
                            <MessageAction
                              onClick={() =>
                                navigator.clipboard.writeText(part.text || '')
                              }
                              label="Copy"
                            >
                              <Copy className="size-3" />
                            </MessageAction>
                          </MessageActions>
                        )}
                      </Message>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          ))}
          {isLoading && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input */}
      <PromptInput onSubmit={handleSubmit} className="mt-4">
        <PromptInputBody>
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Type a message..."
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputSubmit
            disabled={!input && !isLoading}
            status={isLoading ? 'streaming' : 'ready'}
            // onStop={handleStop}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
