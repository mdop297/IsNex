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
        <div className=" relative z-50 flex flex-col items-center h-full bg-background p-4">
          {/* MESSAGE BOX */}
          <div className="flex-1  overflow-y-auto p-4 w-full max-w-3xl">
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
          <div className="sticky bottom-0 z-50 flex justify-center items-center w-full pb-3 bg-background">
            <ChatInput className="" />
          </div>
        </div>
      </>
    );
  };

export default ChatSession;
