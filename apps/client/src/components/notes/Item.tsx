'use client';
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import React from 'react';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

import Link from 'next/link';

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
  const handleExpand = () => {
    onToggle?.();
  };

  function handleClick(id: string) {
    onSelect(id);
    onClick?.();
  }
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
          <SidebarMenuAction
            showOnHover
            className="bg-sidebar-accent text-sidebar-accent-foreground right-7"
          >
            <MoreHorizontal />
          </SidebarMenuAction>
          <SidebarMenuAction
            showOnHover
            className="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <Plus />
          </SidebarMenuAction>
        </SidebarMenuItem>
      </div>
    </>
  );
};

export default Item;
