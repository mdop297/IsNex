'use client';

import {
  SquarePen,
  Search,
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
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { useState } from 'react';

// Menu items.
const items = [
  {
    title: 'Ask AI',
    url: '#',
    icon: SquarePen,
    cn: '',
  },
  {
    title: 'Dashboard',
    url: '#',
    icon: LayoutDashboard,
    cn: '',
  },
  {
    title: 'Documents',
    url: '#',
    icon: LibraryBig,
    cn: '',
  },
  {
    title: 'Workspace',
    url: '#',
    icon: FolderOpenDot,
  },
  { title: 'Tasks', url: '#', icon: ClipboardCheck },
  { title: 'Summerizer', url: '#', icon: Text, cn: '' },
  { title: 'Scanner', url: '#', icon: ScanText },
  {
    title: 'History',
    url: '#',
    icon: HistoryIcon,
  },
];

const user = {
  avatar: '...',
  username: 'Le Nhat Minh',
  email: 'lenhatminh297@gmail.com',
};

export default function AppSidebar() {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const [hovered, setHovered] = useState(false);
  return (
    <Sidebar
      collapsible="icon"
      className="hover:cursor-e-resize"
      onClick={toggleSidebar}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SidebarHeader className="flex-row justify-between items-center">
        <Avatar
          className={cn(
            'rounded-md items-center justify-center',
            'hover:bg-muted-foreground/30 hover:ring-3 ring-muted-foreground/30 cursor-pointer',
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
                <Button asChild variant={'outline'}>
                  <SidebarMenuButton
                    className={cn('flex justify-between rounded-full px-3')}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="text-muted-foreground w-4 h-4" />
                      <span className="text-sm">Search</span>
                    </div>
                    <Badge variant={'outline'}>Ctrl+K</Badge>
                  </SidebarMenuButton>
                </Button>
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
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem>
              <CircleUserRound className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4" /> Setting
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <LogOut className="h-4 w-4" />
              <span> Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
