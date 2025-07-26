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
  id?: string;
  parentId?: string;
  title: string;
  icon: string;
  level?: number;
  hasChildren: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

/*
TODO:
  Item: 
   - input: level, icon, title, hasChild 
   - actions: select, expand/collapse, (edit, delete), add  
On Going: expand/ collapse
  - icon
  - level
  - children pages
  - onToggle()
DONE: hover, expand/collapse
*/

const Item = ({
  title,
  icon,
  level,
  hasChildren,
  expanded,
  onToggle,
}: ItemProps) => {
  const handleExpand = () => {
    console.log('toggle button clicked');
    onToggle?.();
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
          >
            <Link href={'#'}>
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
