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
import { ArrowLeft, Maximize2 } from 'lucide-react';
import React, { use, useState } from 'react';

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

  const toggleViewer = () => {
    setOpenViewer((prev) => !prev);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex-1 flex w-full h-screen">
        {/* document browser */}
        <WorkspaceSidebar
          href={`/workspace/${w_id}/overview`}
          isOpenViewer={openViewer}
          toggleViewer={toggleViewer}
        />
        {openViewer ? (
          <>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel>
                {/* pdf reader */}
                <div className="flex-1 h-full bg-green-800 flex justify-between">
                  {pdf}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="" />
              <ResizablePanel>
                <Tabs
                  defaultValue={openTab}
                  onValueChange={(value) => {
                    setOpenTab(value as 'note' | 'chat');
                  }}
                  className=" flex-col justify-center items-center gap-0 h-screen "
                >
                  <div className="flex flex-row w-full bg-neutral-700">
                    <Button
                      variant={'ghost'}
                      className="hover:bg-item-hover hover:cursor-pointer rounded-md"
                    >
                      <ArrowLeft className="text-white" />
                    </Button>
                    <TabsList className="w-full ">
                      <TabsTrigger value="chat">Conversation</TabsTrigger>
                      <TabsTrigger value="note">Note Editor</TabsTrigger>
                    </TabsList>
                    <Button
                      variant={'ghost'}
                      className="text-white hover:bg-item-hover hover:cursor-pointer"
                    >
                      <Maximize2 />
                    </Button>
                  </div>
                  <TabsContent value="chat" className="w-full h-full ">
                    {/* chat panel */}
                    <div className="flex-1 bg-secondary overflow-auto h-full w-full flex justify-center items-center">
                      {chat}
                    </div>
                  </TabsContent>
                  <TabsContent value="note" className="w-full h-full">
                    {/* note editor */}
                    <div className="flex-1 h-full bg-secondary w-full flex justify-center items-center">
                      {note}
                    </div>
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          </>
        ) : (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <div className="flex-1 h-full bg-secondary w-full flex justify-center items-center overflow-auto">
                {chat}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex-1 h-full bg-secondary w-full flex justify-center items-center">
                {note}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceMode;
