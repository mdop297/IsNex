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
                <div className="flex-1 h-full flex justify-between">{pdf}</div>
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-ring" />
              <ResizablePanel>
                <Tabs
                  defaultValue={openTab}
                  onValueChange={(value) => {
                    setOpenTab(value as 'note' | 'chat');
                  }}
                  className="flex flex-col h-screen gap-0.5! bg-background"
                >
                  {/* Header có h-fit - tự động điều chỉnh theo nội dung */}
                  <div className="flex flex-row items-center justify-center h-fit w-full bg-secondary shrink-0 gap-1 p-1">
                    <Button
                      variant={'ghost'}
                      className="hover:bg-item-hover hover:cursor-pointer rounded-md"
                      size={'icon-sm'}
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
                      size={'icon-sm'}
                    >
                      <Maximize2 />
                    </Button>
                  </div>

                  {/* Content sẽ chiếm phần còn lại của màn hình do flex-1 */}
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
            </ResizablePanelGroup>
          </>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel>{chat}</ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>{note}</ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceMode;
