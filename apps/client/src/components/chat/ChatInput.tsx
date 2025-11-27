'use client';
import React from 'react';
import { AutosizeTextarea } from '../ui/autosize-textarea';
import { cn } from '@/lib/utils';
import {
  Globe,
  ImageUp,
  Paperclip,
  Plus,
  Send,
  TextQuote,
  ToolCase,
} from 'lucide-react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { SelectGroup } from '@radix-ui/react-select';
import { useCreateChat } from './useChats';

interface ChatInputProps {
  className?: string;
}

export const ChatInput = ({ className }: ChatInputProps) => {
  const { mutate: createChat } = useCreateChat();
  const handleCreateChat = () => {
    createChat();
  };
  return (
    <div
      className={cn(
        'bg-accent text-foreground border-border flex flex-col container max-w-2xl min-w-72 rounded-2xl shadow-2xl p-2 gap-2 border',
        className,
      )}
    >
      <AutosizeTextarea
        className={cn(
          'bg-accent resize-none border-none text-md h-4',
          'no-focus-styles',
        )}
        maxHeight={300}
        minHeight={18}
        placeholder="Let's talk about your thoughts!"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCreateChat();
          }
        }}
      />

      <div className="flex justify-between items-center px-2">
        {/* CONTEXT AND TOOLS */}
        <div className="flex space-x-2">
          {/* ADD BUTTON */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Add context</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Paperclip />
                  Upload files
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ImageUp />
                  Add Image
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* TOOLS AND STYLES */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ToolCase />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Tools and Styles</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex justify-between"
                  onSelect={(e) => e.preventDefault()}
                >
                  <div className="flex items-center gap-2">
                    <Globe />
                    <span>Web Search</span>
                  </div>
                  <Switch id="web-search" />
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <TextQuote />
                    Response styles
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-40">
                    <DropdownMenuItem>History</DropdownMenuItem>
                    <DropdownMenuItem>Grouped History</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* MODEL, SUBMIT BUTTON */}
        <div className="flex gap-2">
          {/* MODEL SELECTOR */}
          <Select defaultValue="model-1">
            <SelectTrigger className="w-auto border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="">
              <SelectGroup>
                <SelectItem value="model-1">Model 1</SelectItem>
                <SelectItem value="model-2">Model 2</SelectItem>
                <SelectItem value="model-3">Model 3</SelectItem>
                <SelectItem value="model-4">Model 4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* CREATE CHAT */}
          <Button
            className="bg-blue-500"
            onClick={handleCreateChat}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateChat();
              }
            }}
          >
            <Send className="text-secondary-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
};
