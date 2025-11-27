'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, EllipsisVertical, Star, Trash } from 'lucide-react';
import { SidebarMenuSubAction, useSidebar } from './ui/sidebar';
import { useSidebarStore } from './useSidebarStore';

type DropdownMenuSubItemProps = {
  itemId: string;
  itemLabel: string;
  section: string;
};

export default function DropdownMenuSubItem({
  itemId,
  itemLabel,
  section,
}: DropdownMenuSubItemProps) {
  const { isMobile } = useSidebar();
  const { setRenameItem, setRenameValue, setRenameObject } = useSidebarStore();
  const onRenameClicked = () => {
    setRenameItem(itemId);
    setRenameValue(itemLabel);
    setRenameObject(section);
  };
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
          <Star />
          Favorite
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRenameClicked}>
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
