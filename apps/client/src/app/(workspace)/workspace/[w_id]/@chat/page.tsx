import { sampleMessages } from '@/app/(home)/chats/[chat_id]/message_data';
import { ChatInput } from '@/components/chat/ChatInput';
import { AIMessage, UserMessage } from '@/components/chat/Messages';
import React from 'react';

const page = () => {
  return (
    <>
      <div className="relative flex flex-col items-center px-4 w-full">
        {/* MESSAGE BOX */}
        <div className=" overflow-y-auto p-4 max-w-3xl">
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

export default page;
