'use client';
import { ChatInput } from '@/components/chat/ChatInput';
import React, { useEffect } from 'react';
import { sampleMessages } from './message_data';
import { AIMessage, UserMessage } from '@/components/chat/Messages';
import { useGetChat } from '@/components/chat/useChats';
import { useParams, useRouter } from 'next/navigation';
import { routes } from '@/lib/constants';
import { toast } from 'sonner';

const ChatSession = () => {
  const router = useRouter();
  const { chat_id } = useParams<{ chat_id: string }>();

  const { data: chat, isError: isChatError, isLoading } = useGetChat(chat_id);

  useEffect(() => {
    if (isChatError) {
      toast.error(`Unable to load conversation ${chat_id}`, {
        position: 'top-center',
        richColors: true,
      });
      router.replace(routes.HOME);
    }
  }, [isChatError, chat_id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  if (isChatError || !chat) {
    return null;
  }

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
