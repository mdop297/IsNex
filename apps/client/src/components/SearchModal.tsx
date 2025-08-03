'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { SidebarMenuButton } from './ui/sidebar';
import { Search, SearchIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { VariantProps } from 'class-variance-authority';
import { Combobox, ComboboxProps } from './ui/combo-box';
import { ChatComponents } from './chat/ChatComponents';

const sources: ComboboxProps[] = [
  {
    value: 'all',
    label: 'All sources',
  },
  {
    value: 'chats',
    label: 'Chats',
  },
  {
    value: 'documents',
    label: 'Documents',
  },
  {
    value: 'notes',
    label: 'Notes',
  },
];

export default function ChatSearch() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  function SearchTriggerButton({
    className,
    variant,
    size,
    ...props
  }: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }) {
    return (
      <Button
        asChild
        variant="outline"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        <SidebarMenuButton className="flex justify-between rounded-full px-3 bg-accent hover:bg-accent hover:cursor-pointer font-normal">
          <div className="flex items-center gap-2">
            <Search className="text-foreground w-4 h-4" />
            <span className="text-foreground ">Search</span>
          </div>
          <Badge variant="outline">Ctrl+K</Badge>
        </SidebarMenuButton>
      </Button>
    );
  }

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <SearchTriggerButton />
        </DrawerTrigger>
        <DrawerContent>
          <SearchModal />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SearchTriggerButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-5/6 h-5/6 p-0">
        <DialogHeader className="hidden">
          <DialogTitle className="sr-only">Search Modal</DialogTitle>
        </DialogHeader>
        <SearchModal />
      </DialogContent>
    </Dialog>
  );
}

function SearchModal() {
  return (
    <div className={cn('grid grid-rows-[auto_1fr_auto] h-full gap-0.5')}>
      {/* <!-- Header --> */}
      <div className="relative flex items-center justify-start p-4 gap-3 w-[96%]">
        <SearchIcon className="text-muted-foreground" />
        <Input
          type="text"
          className="w-[90%] border-0 "
          placeholder="Search..."
        />
        <span>Source: </span>
        <Combobox options={sources} />
      </div>

      {/* <!-- Main Content --> */}
      <div className="grid grid-cols-[2fr_3fr] gap-0.5">
        <div className="bg-red-400 p-4">
          <ChatComponents />
        </div>
        <div className="bg-blue-400 p-4">03</div>
      </div>

      {/* <!-- Footer --> */}
      <div className="bg-pink-400 p-4">04</div>
    </div>
  );
}
