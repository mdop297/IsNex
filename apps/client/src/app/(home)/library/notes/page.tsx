'use client';
import React, { useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import PageList from '@/components/notes/PageList';
import { Plus } from 'lucide-react';
import Editor from '@/components/notes/Editor';

const NotesPage = () => {
  const [selectedId, setSelectedId] = useState<string>('1');

  const handleSelect = (pageId: string) => {
    setSelectedId(pageId);
  };

  const handleAddNote = () => {
    // TODO: add logic for adding note at root level
    console.log('This will add note at root level');
  };
  return (
    <ResizablePanelGroup direction="horizontal" className="max-w-full flex-1">
      <ResizablePanel
        defaultSize={10}
        className="resizable-sidebar"
        minSize={10}
      >
        <SidebarMenu className="h-full">
          <SidebarContent>
            <SidebarGroup className="h-full overflow-auto hide-scrollbar">
              <SidebarGroupLabel>All Notes</SidebarGroupLabel>
              <SidebarGroupAction onClick={handleAddNote} role="button">
                <Plus />
              </SidebarGroupAction>
              <PageList onSelect={handleSelect} selectedId={selectedId} />
            </SidebarGroup>
          </SidebarContent>
        </SidebarMenu>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85}>
        <Editor />
        {/* <span>hi</span> */}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default NotesPage;
