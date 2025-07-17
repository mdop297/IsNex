import { ChatInput } from '@/components/chat/ChatInput';
import React from 'react';

const Chats = () => {
  return (
    <div className="flex flex-col gap-10 justify-center items-center h-full bg-secondary/30 px-8 mx-auto ">
      <div className="text-3xl font-sans">
        <p>What is on the agenda today?</p>
      </div>
      <ChatInput />
    </div>
  );
};

export default Chats;
