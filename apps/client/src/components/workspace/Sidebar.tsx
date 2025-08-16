'use client';

import {
  ArrowLeftFromLine,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
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
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { useState } from 'react';

interface WorkspaceSidebarProps {
  href: string;
}

export default function WorkspaceSidebar({ href }: WorkspaceSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleExitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmExit = () => {
    setShowConfirmDialog(false);
    window.location.href = href;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div
          className={`flex justify-between transition-all align-top ${state === 'expanded' ? 'flex-row items-center ' : 'flex-col gap-2 items-start'}`}
        >
          <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
          >
            <AlertDialogTrigger asChild>
              <button onClick={handleExitClick}>
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmExit}>
                  Exit
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
            <SidebarMenu>
              <Collapsible>
                <SidebarMenuItem>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
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
