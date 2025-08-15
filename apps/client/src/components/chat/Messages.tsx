import React from 'react';
import { Button } from '../ui/button';
import {
  ArrowRightFromLine,
  Copy,
  NotebookPen,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AIMessageProps {
  id: string;
  content: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  timeStamp?: Date;
}

interface UserMessageProps {
  id: string;
  content: string;
  timeStamp?: Date;
}

export const AIMessage = ({ content }: AIMessageProps) => {
  return (
    <div className="space-y-0.5  ">
      {/* CONTENT */}
      <div className="w-full bg-border rounded-lg p-2">
        <MarkdownRenderer>{content}</MarkdownRenderer>
      </div>
      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-start ">
        <Button variant={'ghost'} className="size-8">
          <Copy />
        </Button>
        <Button variant={'ghost'} className="size-8">
          <ThumbsUp />
        </Button>
        <Button variant={'ghost'} className="size-8">
          <ThumbsDown />
        </Button>
        <Button variant={'ghost'} className="size-8">
          <NotebookPen />
        </Button>
        <Button variant={'ghost'} className="size-8">
          <ArrowRightFromLine />
        </Button>
      </div>
    </div>
  );
};

export const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end ">
      <div className="max-w-[80%] p-3 space-y-0.5">
        {/* CONTENT */}
        <div className="w-full bg-blue-500 rounded-lg p-2">
          <MarkdownRenderer>{content}</MarkdownRenderer>
        </div>
        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end">
          <Button variant={'ghost'} className="size-8">
            <Copy />
          </Button>
        </div>
      </div>
    </div>
  );
};
