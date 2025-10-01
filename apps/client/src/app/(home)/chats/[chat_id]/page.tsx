import { ChatInput } from '@/components/chat/ChatInput';
import React from 'react';
import { sampleMessages } from './message_data';
import { AIMessage, UserMessage } from '@/components/chat/Messages';

const ChatSession = async () =>
  // { params,}: { params: Promise<{ chat_id: string }>; }
  {
    // const { chat_id } = await params;

    return (
      <>
        <div className="relative flex flex-col items-center px-4 w-full">
          {/* MESSAGE BOX */}
          <div className="flex-1 overflow-y-auto p-4 max-w-3xl">
            {sampleMessages.map((message) => (
              <div key={message.id}>
                {message.type === 'bot' ? (
                  <AIMessage
                    id={message.id}
                    content={message.content}
                    isLiked={message.isLiked}
                    isDisliked={message.isDisliked}
                    timeStamp={message.timestamp}
                  />
                ) : (
                  <UserMessage
                    id={message.id}
                    content={message.content}
                    timeStamp={message.timestamp}
                  />
                )}
              </div>
            ))}
          </div>

          {/* CHAT INPUT */}
          <div className="sticky bottom-0 z-50 flex justify-center items-center w-full pb-3 bg-secondary">
            <ChatInput className="" />
          </div>
        </div>
      </>
    );
  };

export default ChatSession;
