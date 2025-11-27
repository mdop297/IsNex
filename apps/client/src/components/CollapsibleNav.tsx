'use client';
import React from 'react';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

import {
  ChevronRight,
  FolderOpenDot,
  HistoryIcon,
  LibraryBig,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

import { useGetChats, useUpdateChat } from './chat/useChats';
import { useSidebarStore } from './useSidebarStore';
import { Input } from './ui/input';
import DropdownMenuSubItem from './DropdownSubItem';

const CollapsibleNav = () => {
  const { renameItem, setRenameItem, renameValue, setRenameValue } =
    useSidebarStore();

  const { mutate: updateChat } = useUpdateChat();
  const { data: HistoryData } = useGetChats();
  const LibraryData = {
    section: 'Library',
    url: '#',
    icon: LibraryBig,
    subitems: [
      { id: '1', label: 'Notes', url: '/library/notes' },
      { id: '2', label: 'Documents', url: '/library/docs' },
      { id: '3', label: 'Annotations', url: '/library/annos' },
    ],
    subaction: false,
  };

  const WorkspaceData = {
    section: 'Workspace',
    url: '/workspace',
    icon: FolderOpenDot,
    subitems: [
      { id: '1', label: 'Workspace 1', url: '/workspace/1/overview' },
      { id: '2', label: 'Workspace 2', url: '/workspace/2/overview' },
      { id: '3', label: 'Workspace 3', url: '/workspace/3/overview' },
      { id: '4', label: 'Workspace 4', url: '/workspace/4/overview' },
    ],
    subaction: true,
  };

  const items = [
    LibraryData,
    WorkspaceData,
    {
      section: 'History',
      url: '#',
      icon: HistoryIcon,
      subitems: HistoryData
        ? HistoryData.items.map((item) => ({
            id: item.id,
            label: item.title,
            url: `/conversations/${item.id}`,
          }))
        : [],
      subaction: true,
    },
  ];
  const handleRename = (id: string, title: string) => {
    updateChat({ id, title });
    setRenameItem(null);
    setRenameValue('');
  };

  return (
    <>
      {items.map((item, index) => {
        return (
          <Collapsible
            key={item.section}
            defaultOpen={index === 2}
            className="group/collapsible [&[data-state=open]>li>a>button>svg]:rotate-90"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild tooltip={item.section}>
                  <Link href={item.url}>
                    <item.icon />
                    <span> {item.section}</span>
                    <SidebarMenuAction
                      className={`bg-sidebar-accent text-sidebar-accent-foreground left-2 `}
                      showOnHover
                    >
                      <ChevronRight />
                    </SidebarMenuAction>
                  </Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {item.subaction && (
                <SidebarMenuAction showOnHover>
                  <Plus />
                </SidebarMenuAction>
              )}
              <CollapsibleContent>
                <SidebarMenuSub className="p-0 mr-0">
                  {item.subitems.map((subitem) => {
                    return (
                      <SidebarMenuSubItem key={subitem.id}>
                        <SidebarMenuSubButton asChild>
                          {renameItem === subitem.id ? (
                            <Input
                              autoFocus
                              value={renameValue!}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleRename(subitem.id, renameValue!);
                                }
                                if (e.key === 'Escape') {
                                  setRenameItem(null);
                                }
                              }}
                              onBlur={() => {
                                handleRename(subitem.id, renameValue!);
                              }}
                            />
                          ) : (
                            <Link href={subitem.url}>
                              <span>{subitem.label}</span>
                            </Link>
                          )}
                        </SidebarMenuSubButton>
                        {item.subaction && (
                          <DropdownMenuSubItem
                            itemId={subitem.id}
                            itemLabel={subitem.label}
                            section={item.section}
                          />
                        )}
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </>
  );
};

export default CollapsibleNav;
