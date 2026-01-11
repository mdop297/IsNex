'use client';

import { useStream } from '@langchain/langgraph-sdk/react';
import type { Message } from '@langchain/langgraph-sdk';
import { Send, StopCircle, Bot, User } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const [inputValue, setInputValue] = useState('');

  const thread = useStream<{ messages: Message[] }>({
    apiUrl: 'http://localhost:8000/api/v1/agent/chat',
    assistantId: 'agent',
    messagesKey: 'messages',
  });

  const handleSubmit = () => {
    if (!inputValue.trim() || thread.isLoading) return;
    thread.submit({ messages: [{ type: 'human', content: inputValue }] });
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Bot className="w-7 h-7 text-blue-600" />
          LangGraph Chat
        </h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {thread.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Start a conversation...</p>
            </div>
          </div>
        ) : (
          thread.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'human' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type !== 'human' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  message.type === 'human'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-800 shadow-sm border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.content as string}
                </p>
              </div>

              {message.type === 'human' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {thread.isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={thread.isLoading}
            className="flex-1 rounded-full border border-slate-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-800"
          />

          {thread.isLoading ? (
            <button
              type="button"
              onClick={() => thread.stop()}
              className="shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-3 font-medium transition-colors flex items-center gap-2 shadow-md"
            >
              <StopCircle className="w-5 h-5" />
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-3 font-medium transition-colors flex items-center gap-2 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
