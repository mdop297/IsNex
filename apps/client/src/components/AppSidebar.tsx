'use client';

import {
  SquarePen,
  Settings,
  Text,
  CircleUserRound,
  LogOut,
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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import ChatSearch from './SearchModal';

import CollapsibleNav from '@/components/CollapsibleNav';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Menu items.
const items = [
  {
    title: 'Ask AI',
    url: '/chats',
    icon: SquarePen,
    cn: '',
  },

  { title: 'Summarizer', url: '/summarizer', icon: Text, cn: '' },
  // { title: 'Scanner', url: '/home/scanner', icon: ScanText },
  // { title: 'Tasks', url: '/home/tasks', icon: ClipboardCheck },
];

const menuItems = [
  { icon: CircleUserRound, label: 'Profile' },
  { icon: Settings, label: 'Setting' },
  { icon: LogOut, label: 'Logout', destructive: true },
];

export default function AppSidebar() {
  const router = useRouter();
  const { user } = useAuth();
  const { state, isMobile, toggleSidebar } = useSidebar();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return (
    user && (
      <Sidebar
        collapsible="icon"
        className="hover:cursor-e-resize "
        onClick={toggleSidebar}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <SidebarHeader>
          <div className=" flex flex-row justify-between items-center">
            <Avatar
              className={cn(
                'rounded-md items-center justify-center',
                'hover:bg-sidebar-accent hover:ring-3 ring-accent cursor-pointer',
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
          </div>
          {/* SEARCH AREA */}
          <SidebarMenuItem
            className="list-none"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatSearch />
          </SidebarMenuItem>
        </SidebarHeader>
        {/* SIDEBAR CONTENT */}
        <SidebarContent className="hide-scrollbar">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu onClick={(e) => e.stopPropagation()}>
                {/* MENU ITEMS */}

                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      className={item.cn}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {/* COLLAPSIBLE ITEMS */}
                <CollapsibleNav />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {/* FOOTER */}
        <SidebarFooter onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size={'lg'} className="cursor-pointer">
                <Avatar className={cn('h-8 w-8')}>
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
    )
  );
}
