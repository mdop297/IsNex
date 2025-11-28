// import { ChatInput } from '@/components/chat/ChatInput';

import ChatInput from '@/components/chat/PromptInput';
import React from 'react';

const Chats = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col gap-10 justify-center items-center px-8 w-3xl mx-auto">
        <div className="text-3xl font-sans">
          <p>Let&apos;s get started?</p>
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default Chats;
