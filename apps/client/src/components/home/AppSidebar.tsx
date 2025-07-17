'use client';

import {
  SquarePen,
  Settings,
  LayoutDashboard,
  LibraryBig,
  History as HistoryIcon,
  FolderOpenDot,
  Text,
  ScanText,
  CircleUserRound,
  LogOut,
  ClipboardCheck,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
} from 'lucide-react';

import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import ChatSearch from '../SearchModal';

// Menu items.
const items = [
  {
    title: 'Ask AI',
    url: '/home/chats',
    icon: SquarePen,
    cn: '',
  },
  {
    title: 'Dashboard',
    url: '/home/dashboard',
    icon: LayoutDashboard,
    cn: '',
  },
  {
    title: 'Documents',
    url: '/home/documents',
    icon: LibraryBig,
    cn: '',
  },
  {
    title: 'Workspace',
    url: '/home/workspace',
    icon: FolderOpenDot,
    subitems: [
      { label: 'Workspace 1' },
      { label: 'Workspace 2' },
      { label: 'Workspace 3' },
      { label: 'Workspace 4' },
    ],
  },
  { title: 'Tasks', url: '/home/tasks', icon: ClipboardCheck },
  { title: 'Summerizer', url: '/home/summerizer', icon: Text, cn: '' },
  { title: 'Scanner', url: '/home/scanner', icon: ScanText },
  {
    title: 'History',
    url: '/home/history',
    icon: HistoryIcon,
    subitems: [
      { label: 'Chat session 1' },
      { label: 'Chat session 2' },
      { label: 'Chat session 3' },
      { label: 'Chat session 4' },
    ],
  },
];

const user = {
  avatar: '...',
  username: 'Le Nhat Minh',
  email: 'lenhatminh297@gmail.com',
};

const menuItems = [
  { icon: CircleUserRound, label: 'Profile' },
  { icon: Settings, label: 'Setting' },
  { icon: LogOut, label: 'Logout', destructive: true },
];

export default function AppSidebar() {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const [hovered, setHovered] = useState(false);
  return (
    <Sidebar
      collapsible="icon"
      className="hover:cursor-e-resize "
      onClick={toggleSidebar}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SidebarHeader className=" flex flex-row justify-between items-center">
        <Avatar
          className={cn(
            'rounded-md items-center justify-center',
            'hover:bg-muted-foreground hover:ring-3 ring-muted-foreground/30 cursor-pointer',
          )}
          onClick={(e) => {
            if (state === 'expanded') {
              e.stopPropagation();
            }
          }}
        >
          {state === 'collapsed' ? (
            hovered ? (
              <ChevronsRight />
            ) : (
              <AvatarImage src="/logo.svg" />
            )
          ) : (
            <AvatarImage src="/logo.svg" />
          )}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <ChevronsLeft
          className="hover:cursor-pointer hover:bg-muted-foreground/30 rounded-md"
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
        />
      </SidebarHeader>
      {/* SIDEBAR CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu onClick={(e) => e.stopPropagation()}>
              {/* SEARCH AREA */}
              <SidebarMenuItem>
                <ChatSearch />
              </SidebarMenuItem>
              {/* MENU ITEMS */}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={item.cn}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* FOOTER */}
      <SidebarFooter onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size={'lg'}>
              <Avatar
                className={cn(
                  'h-8 w-8',
                  'hover:ring-3 ring-blue-500/50 cursor-pointer',
                )}
              >
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ">
                <span className="truncate font-medium">{user.username}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'top'}
            align="end"
            sideOffset={4}
          >
            {menuItems.map(({ icon: Icon, label, destructive }) => (
              <DropdownMenuItem
                key={label}
                variant={destructive ? 'destructive' : undefined}
              >
                <Icon className="h-4 w-4" />
                <span className={label === 'Logout' ? 'ml-1' : 'ml-2'}>
                  {label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
