import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  ArrowDownToLine,
  ChevronDown,
  EllipsisVertical,
  Eraser,
  Highlighter,
  Maximize2,
  Menu,
  Minus,
  Plus,
  Search,
} from 'lucide-react';
import React from 'react';

const Toolbar = () => {
  return (
    <div className="p-2 border-b bg-muted-foreground rounded-t-md">
      <div className="w-full flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-3 text-sm">
          <div className="rounded-full hover:bg-neutral-500 aspect-square p-1.5">
            <Menu className="size-5" />
          </div>
          <Input className="w-12 h-fit rounded-sm px-2 text-sm" />
          <span>/ 1234</span>
          <div className="rounded-full hover:bg-neutral-500 aspect-square p-1.5">
            <Search className="size-5" />
          </div>
        </div>
        {/* Center section */}

        <div className="flex items-center space-x-1 text-sm h-5">
          <div className="rounded-full hover:bg-neutral-500 aspect-square p-1.5">
            <Plus className="size-5 aspect-square" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5 p-1" aria-label="zoom" variant="ghost">
                <span>{100}%</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Fit Page</DropdownMenuItem>
              <DropdownMenuItem>Fit Width</DropdownMenuItem>
              <DropdownMenuItem>100%</DropdownMenuItem>
              <DropdownMenuItem>150%</DropdownMenuItem>
              <DropdownMenuItem>200%</DropdownMenuItem>
              <DropdownMenuItem>250%</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="rounded-full hover:bg-neutral-500 aspect-square p-1.5">
            <Minus className="size-5" />
          </div>

          <Separator orientation="vertical" className="mx-3 bg-foreground " />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5 p-1" aria-label="zoom" variant="ghost">
                <Highlighter className="size-5" />
                Highlight
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Fit Page</DropdownMenuItem>
              <DropdownMenuItem>Fit Width</DropdownMenuItem>
              <DropdownMenuItem>100%</DropdownMenuItem>
              <DropdownMenuItem>150%</DropdownMenuItem>
              <DropdownMenuItem>200%</DropdownMenuItem>
              <DropdownMenuItem>250%</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="gap-1.5 p-1" aria-label="zoom" variant="ghost">
            <Eraser className="size-5" />
            Erase
          </Button>
        </div>
        {/* Right section */}

        <div className="flex items-center space-x-1 text-sm h-5">
          <div className="rounded-full hover:bg-neutral-500 aspect-square p-1.5">
            <ArrowDownToLine className="size-5" />
          </div>
          <div className="rounded-full hover:bg-neutral-500 aspect-square p-1.5">
            <Maximize2 className="size-5" />
          </div>
          <div className="rounded-full hover:bg-neutral-500 aspect-square p-1.5">
            <EllipsisVertical className="size-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
