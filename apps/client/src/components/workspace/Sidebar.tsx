'use client';

import {
  ArrowLeftFromLine,
  Ellipsis,
  LayoutList,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface WorkspaceSidebarProps {
  href: string;
  isOpenViewer: boolean;
  toggleViewer: () => void;
}

export default function WorkspaceSidebar({
  href,
  isOpenViewer,
  toggleViewer,
}: WorkspaceSidebarProps) {
  const { state, toggleSidebar } = useSidebar();

  const handleConfirmExit = () => {
    window.location.href = href;
  };

  return (
    <Sidebar collapsible="icon" className="!border-0">
      <SidebarHeader>
        <div
          className={`flex justify-between transition-all align-top ${state === 'expanded' ? 'flex-row items-center ' : 'flex-col gap-2 items-start'}`}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button>
                <ArrowLeftFromLine className="icon-button" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">
                  Exit workspace?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Exit workspace? Unsaved changes will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmExit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {state === 'expanded' ? (
            <PanelLeftClose className="icon-button" onClick={toggleSidebar} />
          ) : (
            <PanelLeftOpen className="icon-button" onClick={toggleSidebar} />
          )}
        </div>
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton>
            <Search />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md  pr-3 py-2 text-sm shadow-sm focus:outline-none "
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Collapsible>
              <SidebarMenuItem className="list-none">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link href={'#'}>
                      <LayoutList />
                      <span> Choose document </span>
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton onClick={toggleViewer}>
            <Ellipsis />
            <span className={`${state === 'collapsed' ? 'hidden' : null}`}>
              {!isOpenViewer ? 'Open Viewer' : 'Close Viewer'}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-item-selected-indicator hover:cursor-pointer">
            <Plus />
            <span className={`${state === 'collapsed' ? 'hidden' : null}`}>
              Add documents
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
