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

import DropdownMenuSubItem from './DropdownSubItem';

const items = [
  {
    title: 'Library',
    url: '#',
    icon: LibraryBig,
    subitems: [
      { label: 'Notes', url: '/library/notes' },
      { label: 'Documents', url: '/library/docs' },
      { label: 'Annotations', url: '/library/annos' },
    ],
    subaction: false,
  },
  {
    title: 'Workspace',
    url: '/workspace',
    icon: FolderOpenDot,
    subitems: [
      { label: 'Workspace 1', url: '/workspace/1/overview' },
      { label: 'Workspace 2', url: '/workspace/2/overview' },
      { label: 'Workspace 3', url: '/workspace/3/overview' },
      { label: 'Workspace 4', url: '/workspace/4/overview' },
    ],
    subaction: true,
  },
  {
    title: 'History',
    url: '#',
    icon: HistoryIcon,
    subitems: [
      {
        label: 'This is a very long name of chat session 1',
        url: '/conversations/1',
      },
      { label: 'Chat session 2', url: '/conversations/2' },
      { label: 'Chat session 3', url: '/conversations/3' },
      { label: 'Chat session 4', url: '/conversations/4', isActive: false },
      {
        label: 'This is a very long name of chat session 5',
        url: '/conversations/5',
      },
      { label: 'Chat session 6', url: '/conversations/6' },
      { label: 'Chat session 7', url: '/conversations/7' },
      { label: 'Chat session 8', url: '/conversations/8', isActive: false },
    ],
    subaction: true,
  },
];

const CollapsibleNav = () => {
  return (
    <>
      {items.map((item, index) => {
        return (
          <Collapsible
            key={item.title}
            defaultOpen={index === 2}
            className="group/collapsible [&[data-state=open]>li>a>button>svg]:rotate-90"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span> {item.title}</span>
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
                  {item.subitems.map((subitem) => (
                    <SidebarMenuSubItem key={subitem.label}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subitem.url}>
                          <span>{subitem.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                      {item.subaction && <DropdownMenuSubItem />}
                    </SidebarMenuSubItem>
                  ))}
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
