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

import {
  useDeleteConversation,
  useGetConversations,
  useUpdateConversation,
} from '@/api/conversation';
import { useSidebarStore } from './useSidebarStore';
import DropdownMenuSubItem from './DropdownSubItem';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';

const CollapsibleNav = () => {
  const {
    isRename,
    isDeleting,
    currentItem,
    setIsDeleting,
    setCurrentItem,
    setIsRename,
    setCurrentValue,
  } = useSidebarStore();

  const { mutate: updateChat } = useUpdateConversation();
  const { mutate: deleteChat, isPending: isDeletingPending } =
    useDeleteConversation();
  const { data: HistoryData } = useGetConversations();

  const LibraryData = {
    section: 'Library',
    url: '#',
    icon: LibraryBig,
    subitems: [
      { id: '1', label: 'Notes', url: '/library/notes' },
      { id: '2', label: 'Documents', url: '/library/docs' },
      { id: '3', label: 'Annotations', url: '/library/annos' },
    ],
    subAction: false,
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
    subAction: true,
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
      subAction: true,
    },
  ];

  const handleRename = (id: string, title: string) => {
    updateChat({ id, title });
    setCurrentItem(null);
    setCurrentValue('');
    setIsRename(false);
  };
  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentItem) deleteChat(currentItem);
    setIsDeleting(false);
    toast.success('Chat deleted successfully');
  };

  const doubleClickItem = (id: string) => {
    setCurrentItem(id);
    setIsRename(true);
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

              {item.subAction && (
                <SidebarMenuAction showOnHover>
                  <Plus />
                </SidebarMenuAction>
              )}
              <CollapsibleContent>
                <SidebarMenuSub className="p-0 mr-0">
                  {item.subitems.map((subitem) => {
                    return (
                      <React.Fragment key={subitem.id}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            {
                              <Link
                                href={subitem.url}
                                contentEditable={
                                  currentItem === subitem.id && isRename
                                }
                                onDoubleClick={() =>
                                  doubleClickItem(subitem.id)
                                }
                                onBlur={(e) =>
                                  handleRename(
                                    subitem.id,
                                    e.currentTarget.textContent || '',
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRename(
                                      subitem.id,
                                      e.currentTarget.textContent || '',
                                    );
                                  }
                                }}
                              >
                                <span>{subitem.label}</span>
                              </Link>
                            }
                          </SidebarMenuSubButton>
                          {item.subAction && (
                            <DropdownMenuSubItem
                              itemId={subitem.id}
                              itemLabel={subitem.label}
                              section={item.section}
                            />
                          )}
                        </SidebarMenuSubItem>
                        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={handleCancelDelete}
                              >
                                Cancel
                              </Button>
                              <Button
                                disabled={isDeletingPending}
                                onClick={handleDelete}
                              >
                                {isDeletingPending ? 'Deleting...' : 'Delete'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </React.Fragment>
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
