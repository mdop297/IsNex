'use client';

import ChatInput from '@/components/chat/PromptInput';
import { useState, useEffect } from 'react';

const Chats = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative flex justify-center items-center h-full min-h-screen  overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.2), transparent 50%)`,
        }}
      />

      <div className="relative z-10 flex flex-col gap-10 justify-center items-center px-8 w-3xl mx-auto">
        <div className="text-3xl font-sans">
          <p>Let&apos;s get started?</p>
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default Chats;
