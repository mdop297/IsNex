'use client';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';

import PDFPreview from '@/components/pdf/PDFViewer/PDFPreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SetupInstructionsModal from '@/components/workspace/InstructionsModal';
import type { Conversation as ConversationType, Document } from '@/types';
import {
  ExternalLink,
  FileText,
  MessageSquare,
  MessageSquareIcon,
  Plus,
  Search,
  SlidersVertical,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

function Workspace({ params }: { params: Promise<{ w_id: string }> }) {
  const { w_id } = use(params);
  const [openPreview, setOpenPreview] = useState(false);
  const [isPreviewDoc, setIsPreviewDoc] = useState(true);
  const [selectedItem, setSelectedItem] = useState<
    Document | ConversationType
  >();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);

  const [data, setData] = useState<{
    documents: Document[];
    conversations: ConversationType[];
  } | null>(null);

  const handleDocPreview = (item: Document) => {
    setOpenPreview(true);
    setIsPreviewDoc(true);
    setSelectedItem(item);
    setSelectedItemId(item.key);
  };

  const handleChatPreview = (item: ConversationType) => {
    setOpenPreview(true);
    setIsPreviewDoc(false);
    setSelectedItem(item);
    setSelectedItemId(item.key);
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

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen gap-2 p-2 bg-background text-foreground">
      <div
        className={`flex flex-col bg-background rounded-md border shadow-sm overflow-hidden transition-all duration-300 ${
          openPreview ? 'w-1/2' : 'w-full'
        }`}
      >
        {/* Header Section */}
        <div className="border-b px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Workspace {w_id}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your documents and conversations
          </p>
        </div>

        {/* System Instructions Card */}
        <div className="px-4 py-4">
          <Card className="bg-secondary/40 border-secondary/60">
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-foreground">
                  System Instructions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Configure project-wide instructions
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 bg-transparent"
                onClick={() => setIsInstructionsModalOpen(true)}
              >
                <SlidersVertical className="size-4 mr-2" />
                Configure
              </Button>
            </div>
          </Card>
        </div>

        {/* Tabs Section */}
        <div className="flex-1 flex flex-col overflow-hidden px-4">
          <Tabs defaultValue="documents" className="flex flex-col h-full">
            {/* Tab Header with Actions */}
            <div className="flex items-center justify-between gap-4 my-4">
              <TabsList className="h-9 bg-background border">
                <TabsTrigger value="documents" className="gap-2">
                  <FileText className="size-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="chats" className="gap-2">
                  <MessageSquare className="size-4" />
                  Conversations
                </TabsTrigger>
              </TabsList>
              <div className="flex justify-center w-full ">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search "
                    className="pl-9 border-border bg-background! rounded-lg text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="size-4 mr-2" />
                      Add
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Choose From Library</DropdownMenuItem>
                    <DropdownMenuItem>Upload New File</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" variant="outline" asChild>
                  <Link href={`/workspace/${w_id}`}>
                    <ExternalLink className="size-4 mr-1.5" />
                    New Session
                  </Link>
                </Button>
              </div>
            </div>

            {/* Document Tab */}
            <TabsContent value="documents" className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {data.documents.length > 0 ? (
                  data.documents.map((item) => (
                    <DocumentItem
                      key={item.key}
                      item={item}
                      isSelected={selectedItemId === item.key}
                      onPreview={() => handleDocPreview(item)}
                    />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    No documents yet
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Conversation Tab */}
            <TabsContent value="chats" className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {data.conversations.length > 0 ? (
                  data.conversations.map((item) => (
                    <ConversationItem
                      key={item.key}
                      item={item}
                      isSelected={selectedItemId === item.key}
                      onPreview={() => handleChatPreview(item)}
                    />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    No conversations yet
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {openPreview && (
        <div className="flex-1 flex flex-col rounded-md border bg-background shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
          {isPreviewDoc ? (
            <>
              {/* PDF Preview Header */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-foreground truncate">
                    {selectedItem!.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(selectedItem as Document).pages} pages
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClosePreview}
                  className="shrink-0"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* PDF Content */}
              <div className="flex-1 overflow-auto">
                <PDFPreview fileUrl={(selectedItem as Document).url} />
              </div>
            </>
          ) : (
            <>
              {/* Chat Preview Header */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-foreground truncate">
                    {selectedItem!.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(selectedItem as ConversationType).messageCount} messages
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClosePreview}
                  className="shrink-0"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Chat Messages */}
              <Conversation className="relative size-full">
                <ConversationContent>
                  {(selectedItem as ConversationType).messageCount === 0 ? (
                    <ConversationEmptyState
                      description="Messages will appear here as the conversation progresses."
                      icon={<MessageSquareIcon className="size-6" />}
                      title="Start a conversation"
                    />
                  ) : (
                    (selectedItem as ConversationType).messages.map(
                      (message) => (
                        <Message from={message.from} key={`${message.key}`}>
                          <div>
                            <MessageContent>
                              <MessageResponse>{message.value}</MessageResponse>
                            </MessageContent>
                          </div>
                        </Message>
                      ),
                    )
                  )}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>

              {/* Chat Footer */}
              <div className="border-t px-6 py-4">
                <Button className="w-full" asChild>
                  <Link href={`/workspace/${w_id}`}>
                    <ExternalLink className="size-4 mr-2" />
                    Open in Workspace
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <SetupInstructionsModal
        open={isInstructionsModalOpen}
        onOpenChange={setIsInstructionsModalOpen}
        workspaceId={w_id}
      />
    </div>
  );
}

/* New DocumentItem component for better organization */
function DocumentItem({
  item,
  isSelected,
  onPreview,
}: {
  item: Document;
  isSelected: boolean;
  onPreview: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 w-full px-3 py-2 rounded-md transition-colors cursor-pointer ${
        isSelected
          ? 'bg-accent text-accent-foreground'
          : 'bg-secondary/40 hover:bg-secondary/70'
      }`}
      onClick={onPreview}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText className="size-5 shrink-0 text-muted-foreground" />
        <div className="flex flex-col gap-0.5 min-w-0 text-left">
          <span className="font-medium text-sm truncate">{item.name}</span>
          <span className="text-xs text-muted-foreground">
            {item.pages} pages • {item.size}
          </span>
        </div>
      </div>
      <Button size="sm" variant="outline" className="shrink-0 bg-transparent">
        <ExternalLink className="size-3.5" />
      </Button>
    </div>
  );
}

/* New ConversationItem component for better organization */
function ConversationItem({
  item,
  isSelected,
  onPreview,
}: {
  item: ConversationType;
  isSelected: boolean;
  onPreview: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 w-full px-3 py-2 rounded-md transition-colors cursor-pointer ${
        isSelected
          ? 'bg-accent text-accent-foreground'
          : 'bg-secondary/40 hover:bg-secondary/70'
      }`}
      onClick={onPreview}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <MessageSquare className="size-5 shrink-0 text-muted-foreground" />
        <div className="flex flex-col gap-0.5 min-w-0 text-left">
          <span className="font-medium text-sm truncate">{item.name}</span>
          <span className="text-xs text-muted-foreground">
            {item.messageCount} messages • {item.status}
          </span>
        </div>
      </div>
      <Button size="sm" variant="outline" className="shrink-0 bg-transparent">
        <ExternalLink className="size-3.5" />
      </Button>
    </div>
  );
}

export default Workspace;
