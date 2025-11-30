'use client';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkspaceSidebar from '@/components/workspace/Sidebar';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import type React from 'react';
import { use, useState } from 'react';

const WorkspaceMode = ({
  pdf,
  chat,
  note,
  params,
}: {
  pdf: React.ReactNode;
  chat: React.ReactNode;
  note: React.ReactNode;
  params: Promise<{ w_id: string }>;
}) => {
  const { w_id } = use(params);
  const [openViewer, setOpenViewer] = useState(true);
  const [openTab, setOpenTab] = useState<'chat' | 'note'>('chat');
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const toggleViewer = () => {
    setOpenViewer((prev) => !prev);
  };

  const toggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex-1 flex w-full h-screen bg-background">
        {/* Sidebar - Document browser */}
        {!isMaximized && (
          <WorkspaceSidebar
            href={`/workspace/${w_id}/overview`}
            isOpenViewer={openViewer}
            toggleViewer={toggleViewer}
            selectedDoc={selectedDoc}
            onSelectDoc={setSelectedDoc}
          />
        )}
        {openViewer ? (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* PDF Reader Panel */}
            <ResizablePanel defaultSize={isMaximized ? 100 : 50} minSize={20}>
              <div className="flex-1 h-full flex flex-col bg-background ">
                {/* PDF Content */}
                <div className="flex-1 overflow-hidden">{pdf}</div>
              </div>
            </ResizablePanel>
            {!isMaximized && (
              <>
                <ResizableHandle withHandle className="bg-border" />
                {/* Chat & Note Panel */}
                <ResizablePanel defaultSize={50} minSize={20}>
                  <Tabs
                    defaultValue={openTab}
                    onValueChange={(value) => {
                      setOpenTab(value as 'note' | 'chat');
                    }}
                    className="flex flex-col h-screen gap-0 bg-background"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between h-10 px-3 py-0.5 bg-secondary shrink-0">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground"
                        title="Go back"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <TabsList className="bg-background w-full max-w-xs border border-border items-center">
                        <TabsTrigger value="chat" className="text-xs">
                          Chat
                        </TabsTrigger>
                        <TabsTrigger value="note" className="text-xs">
                          Notes
                        </TabsTrigger>
                      </TabsList>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={toggleMaximize}
                        className="text-muted-foreground hover:text-foreground"
                        title="Maximize chat panel"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Content */}
                    <TabsContent
                      value="chat"
                      className="flex-1 w-full overflow-hidden"
                    >
                      {chat}
                    </TabsContent>
                    <TabsContent
                      value="note"
                      className="flex-1 w-full overflow-hidden"
                    >
                      {note}
                    </TabsContent>
                  </Tabs>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        ) : (
          /* Fullscreen chat/note mode */
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={50} minSize={20}>
              <div className="flex flex-col h-full bg-background">
                <div className="flex items-center justify-between h-12 px-3 bg-secondary border-b border-border">
                  <span className="text-sm text-foreground font-medium">
                    Conversation
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleMaximize}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">{chat}</div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-border" />
            <ResizablePanel defaultSize={50} minSize={20}>
              <div className="flex flex-col h-full bg-background">
                <div className="flex items-center justify-between h-12 px-3 bg-secondary border-b border-border">
                  <span className="text-sm text-foreground font-medium">
                    Notes
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">{note}</div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceMode;
