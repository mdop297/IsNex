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
import React, { use, useState } from 'react';

const WorkspaceMode = ({ params }: { params: Promise<{ w_id: string }> }) => {
  const { w_id } = use(params);
  const [openViewer, setOpenViewer] = useState(true);
  const [openTab, setOpenTab] = useState<'chat' | 'note'>('chat');

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex-1 flex w-full h-screen">
        {/* document browser */}
        <WorkspaceSidebar
          href={`/workspace/${w_id}/overview`}
          isOpenViewer={openViewer}
          setOpenViewer={setOpenViewer}
        />
        {/* pdf reader */}
        {openViewer ? (
          <>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel>
                <div className="flex-1 h-full bg-green-800 flex justify-between">
                  PDF viewer
                  <Button onClick={() => setOpenViewer(false)}>
                    Close viewer{' '}
                  </Button>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <Tabs
                  defaultValue={openTab}
                  onValueChange={(value) => {
                    setOpenTab(value as 'note' | 'chat');
                  }}
                  className="justify-center items-center gap-0 h-full"
                >
                  <TabsList>
                    <TabsTrigger value="chat">Conversation</TabsTrigger>
                    <TabsTrigger value="note">Note Editor</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chat" className="w-full">
                    {/* note editor */}
                    <div className="flex-1 h-full bg-blue-800 w-full flex justify-center items-center">
                      Chat with AI
                    </div>
                  </TabsContent>
                  <TabsContent value="note" className="w-full">
                    {/* chat panel */}
                    <div className="flex-1 h-full bg-yellow-800 w-full flex justify-center items-center">
                      Note Editor
                    </div>
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          </>
        ) : (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <div className="flex-1 h-full bg-blue-800 w-full flex justify-center items-center">
                Chat with AI
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex-1 h-full bg-yellow-800 w-full flex justify-center items-center">
                Note Editor
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceMode;
