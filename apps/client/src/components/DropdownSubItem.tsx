'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import { SidebarMenuSubAction, useSidebar } from './ui/sidebar';

export default function DropdownMenuSubItem() {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuSubAction showOnHover>
          <EllipsisVertical />
        </SidebarMenuSubAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-auto rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align={isMobile ? 'end' : 'start'}
      >
        <DropdownMenuItem>
          <Edit />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
