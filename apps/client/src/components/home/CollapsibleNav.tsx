'use client';
import React from 'react';
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubAction,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  ChevronRight,
  FolderOpenDot,
  HistoryIcon,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu';

const items = [
  {
    title: 'Workspace',
    url: '/home/workspace',
    icon: FolderOpenDot,
    subitems: [
      { label: 'Workspace 1', url: '#' },
      { label: 'Workspace 2', url: '#' },
      { label: 'Workspace 3', url: '#' },
      { label: 'Workspace 4', url: '#' },
    ],
  },
  {
    title: 'History',
    url: '/home/history',
    icon: HistoryIcon,
    subitems: [
      { label: 'This is a very long name of chat session 1', url: '#' },
      { label: 'Chat session 2', url: '#' },
      { label: 'Chat session 3', url: '#' },
      { label: 'Chat session 4', url: '#', isActive: false },
      { label: 'This is a very long name of chat session 5', url: '#' },
      { label: 'Chat session 6', url: '#' },
      { label: 'Chat session 7', url: '#' },
      { label: 'Chat session 8', url: '#', isActive: false },
    ],
  },
];

const CollapsibleNav = () => {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <Collapsible key={item.title}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span> {item.title}</span>
              </Link>
            </SidebarMenuButton>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction
                className="bg-sidebar-accent text-sidebar-accent-foreground left-2 data-[state=open]:rotate-90"
                showOnHover
              >
                <ChevronRight />
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <SidebarMenuAction showOnHover>
              <Plus />
            </SidebarMenuAction>
            <CollapsibleContent>
              <SidebarMenuSub className="p-0 mr-0">
                {item.subitems.map((subitem) => (
                  <SidebarMenuSubItem key={subitem.label}>
                    <SidebarMenuSubButton asChild>
                      <Link href={subitem.url}>
                        <span>{subitem.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuSubAction showOnHover>
                          <MoreHorizontal />
                        </SidebarMenuSubAction>
                      </DropdownMenuTrigger>
                    </DropdownMenu>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  );
};

export default CollapsibleNav;
