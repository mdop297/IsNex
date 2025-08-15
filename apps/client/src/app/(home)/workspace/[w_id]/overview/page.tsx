'use client';

import { AIMessage, UserMessage } from '@/components/chat/Messages';
import PDFPreview from '@/components/pdf/PDFViewer/PDFPreview';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Conversation, Document } from '@/types';
import {
  ExternalLink,
  FileText,
  MessageSquare,
  Plus,
  SlidersVertical,
} from 'lucide-react';
import React, { use, useEffect, useState } from 'react';

function Workspace({ params }: { params: Promise<{ w_id: string }> }) {
  const { w_id } = use(params);
  const [openPreview, setOpenPreview] = useState(false);
  const [isPreviewDoc, setIsPreviewDoc] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Document | Conversation>();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [data, setData] = useState<{
    documents: Document[];
    conversations: Conversation[];
  } | null>(null);

  const handleDocPreview = (item: Document) => {
    setOpenPreview(true);
    setIsPreviewDoc(true);
    setSelectedItem(item);
    setSelectedItemId(item.id);
  };

  const handleChatPreview = (item: Conversation) => {
    setOpenPreview(true);
    setIsPreviewDoc(false);
    setSelectedItem(item);
    setSelectedItemId(item.id);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setSelectedItemId(null);
  };

  useEffect(() => {
    fetch('/api/fake-data')
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="flex-1 flex flex-row h-screen gap-1 p-1 !overflow-y-hidden ">
      <div
        className={`flex flex-col bg-500 h-full border-1 rounded-md p-2 gap-4 min-w-[500px] ${openPreview ? 'w-1/2' : 'w-full'} transition-all `}
      >
        <div className="mb-3">
          <h1 className="text-2xl font-bold mb-2">Workspace {w_id} Content</h1>
          <p className="font-light italic">
            Manage your documents and conversations
          </p>
        </div>
        {/* System instructions */}
        <div className="flex justify-between items-center w-full h-fit rounded-lg p-4 bg-input border-1 border-ring">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold"> System Instructions</h3>
            <p className="text-sm italic">
              Set up your instructions in this projects
            </p>
          </div>
          <Button className="h-fit w-fit">
            Configure
            <span>
              <SlidersVertical />
            </span>
          </Button>
        </div>
        <Separator />
        {/* tab */}
        <Tabs defaultValue="documents" className="w-full h-full">
          <div className="flex flex-row justify-between items-center ">
            <TabsList className="bg-input">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="chats">Conversations</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    Add Files
                    <Plus />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Choose From Library</DropdownMenuItem>
                  <DropdownMenuItem>Upload New Files</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                New Session
                <ExternalLink />
              </Button>
            </div>
          </div>
          {/* Document items */}
          <TabsContent value="documents" className="flex-1 overflow-auto">
            {data.documents.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center justify-between mb-1 rounded-md p-1.5
                   ${selectedItemId === item.id ? 'bg-item-selected' : 'bg-input hover:bg-item-hover'}`}
              >
                {/* File name */}
                <div className="flex items-center flex-1 min-w-0 gap-2">
                  <FileText className="size-5 shrink-0" />
                  <div className="truncate text-base">{item.name}</div>
                </div>

                {/* Info */}
                <div className="flex gap-2 text-xs group-hover:hidden whitespace-nowrap shrink-0">
                  <span>{item.pages} pgs</span>
                  <span>• {item.size}</span>
                  <span>
                    •{' '}
                    {new Date(item.uploadedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Preview button */}
                <div className="hidden group-hover:block h-full shrink-0">
                  <Button
                    className="!px-1.5 !py-[1px] h-fit !text-sm"
                    onClick={() => handleDocPreview(item)}
                  >
                    Preview <ExternalLink />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          {/* Conversation items */}
          <TabsContent value="chats" className="flex-1 overflow-auto">
            {data.conversations.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center justify-between mb-1 rounded-md p-1.5
                  ${selectedItemId === item.id ? 'bg-item-selected' : 'bg-input hover:bg-item-hover'}`}
              >
                <div className="flex items-center flex-1 min-w-0 gap-2">
                  <MessageSquare className="size-5 shrink-0" />
                  <div className="truncate text-base">{item.name}</div>
                </div>

                <div className="flex items-center gap-2 text-xs group-hover:hidden whitespace-nowrap">
                  <span>{item.messageCount} msg</span>
                  <span>• {item.status}</span>
                  <span>
                    •{' '}
                    {new Date(item.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="hidden group-hover:block h-full items-center justify-center">
                  <Button
                    className="!px-1.5 !py-[1px] h-fit !text-sm"
                    onClick={() => handleChatPreview(item)}
                  >
                    Preview <ExternalLink />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      {/* preview panel */}
      {openPreview && (
        <div className="flex-1 flex flex-col justify-between w-1/2 p-2 border-1 rounded-md gap-1">
          {isPreviewDoc ? (
            <>
              {/* header */}
              <div className="flex justify-between items-center w-full h-1/14 ">
                <h1 className="text-lg truncate font-semibold">
                  {selectedItem!.name}
                </h1>
                <Button onClick={handleClosePreview}>Close preview</Button>
              </div>
              {/* content */}
              <PDFPreview fileUrl={(selectedItem as Document).url} />
            </>
          ) : (
            <>
              <div className="flex justify-between items-center w-full h-1/14 ">
                <h1 className="text-lg truncate font-semibold">
                  {selectedItem!.name}
                </h1>
                <Button onClick={handleClosePreview}>Close preview</Button>
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar">
                {(selectedItem as Conversation).messages.map((item) => (
                  <div key={item.id}>
                    {item.sender === 'bot' ? (
                      <AIMessage
                        id={item.id}
                        content={item.content}
                      ></AIMessage>
                    ) : (
                      <UserMessage
                        id={item.id}
                        content={item.content}
                      ></UserMessage>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center h-1/14 ">
                <Button className="w-80">
                  Open in workspace
                  <ExternalLink />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Workspace;
