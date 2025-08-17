'use client';
import {
  ChevronDown,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react';
import React from 'react';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface ItemProps {
  id: string;
  parentId?: string;
  title: string;
  icon: string;
  level?: number;
  hasChildren: boolean;
  expanded?: boolean;
  selectedId: string;
  onToggle?: () => void;
  onClick?: () => void;
  onSelect: (pageId: string) => void;
}

/*
TODO:
  Item: 
   - input: level, icon, title, hasChild 
   - actions: select, (edit, delete), add  
On Going: select
  - isActive 
DONE: hover, expand/collapse
*/

const Item = ({
  id,
  title,
  icon,
  level,
  hasChildren,
  expanded,
  onToggle,
  onClick,
  onSelect,
  selectedId,
}: ItemProps) => {
  const { isMobile } = useSidebar();
  const handleExpand = () => {
    onToggle?.();
  };

  function handleClick(id: string) {
    onSelect(id);
    onClick?.();
  }
  const handleAddChild = () => {
    // TODO: Add logic for adding child
    console.log('This will add a child note');
  };
  const handleEdit = () => {
    // TODO: Add logic for Editing name
    console.log('This will edit note name');
  };

  const handleDelete = () => {
    // TODO: Add logic for deleting note
    console.log('This will delete the note');
  };
  return (
    <>
      <div className="select-none">
        <SidebarMenuItem>
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <SidebarMenuAction
              showOnHover
              className="bg-sidebar-accent text-sidebar-accent-foreground rounded-sm"
              style={{ left: level ? `${level + 0.5}rem` : '0.5rem' }}
              onClick={handleExpand}
            >
              {expanded ? <ChevronDown /> : <ChevronRight />}
            </SidebarMenuAction>
          )}

          {/* Emoji and Title*/}
          <SidebarMenuButton
            asChild
            className="px-2 py-1"
            style={{ paddingLeft: level ? `${level + 0.5}rem` : undefined }}
            onClick={() => handleClick(id)}
            isActive={selectedId === id}
          >
            <Link href={'#'} className="text-sm">
              <span>{icon}</span>
              <span>{title}</span>
            </Link>
          </SidebarMenuButton>
          {/* Action Buttons - chỉ hiển thị khi hover */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction
                showOnHover
                className="bg-sidebar-accent text-sidebar-accent-foreground right-7"
              >
                <MoreHorizontal />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={isMobile ? 'bottom' : 'right'}
              align={isMobile ? 'end' : 'start'}
            >
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="text-muted-foreground" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                <Trash className="text-muted-foreground" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SidebarMenuAction
            showOnHover
            className="bg-sidebar-accent text-sidebar-accent-foreground"
            onClick={handleAddChild}
          >
            <Plus />
          </SidebarMenuAction>
        </SidebarMenuItem>
      </div>
    </>
  );
};

export default Item;
