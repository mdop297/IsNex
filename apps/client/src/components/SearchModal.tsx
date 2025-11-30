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
import {
  Search,
  MessageSquare,
  FileText,
  Highlighter,
  Clock,
} from 'lucide-react';
import { Badge } from './ui/badge';
import type { VariantProps } from 'class-variance-authority';
import { Combobox, type ComboboxProps } from './ui/combo-box';
import { Separator } from './ui/separator';

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

const fakeSearchResults = [
  {
    id: '1',
    type: 'chat',
    title: 'Discussion about AI integration',
    preview: 'How can we implement AI features into our application...',
    document: 'Project Overview.pdf',
    date: '2 days ago',
  },
  {
    id: '2',
    type: 'note',
    title: 'Key takeaways from ML research',
    preview: 'Machine learning models require proper data preprocessing...',
    document: 'Machine Learning Guide.pdf',
    date: '1 week ago',
  },
  {
    id: '3',
    type: 'highlight',
    title: 'Important definition',
    preview: 'Natural Language Processing (NLP) is a subset of AI that...',
    document: 'AI Fundamentals.pdf',
    date: '3 days ago',
  },
  {
    id: '4',
    type: 'chat',
    title: 'Database optimization tips',
    preview: 'Consider using indexes for frequently queried columns...',
    document: 'System Architecture.pdf',
    date: '5 days ago',
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
        <SidebarMenuButton className="flex justify-between rounded-lg px-3 bg-accent hover:bg-accent hover:cursor-pointer font-normal">
          <div className="flex items-center gap-2 justify-center">
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
      <DialogContent className="sm:max-w-5/6 h-5/6 p-0 rounded-md">
        <DialogHeader className="hidden">
          <DialogTitle className="sr-only">Search Modal</DialogTitle>
        </DialogHeader>
        <SearchModal />
      </DialogContent>
    </Dialog>
  );
}

function SearchModal() {
  const [selectedResult, setSelectedResult] = React.useState(
    fakeSearchResults[0],
  );
  const [searchTerm, setSearchTerm] = React.useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'note':
        return <FileText className="w-4 h-4" />;
      case 'highlight':
        return <Highlighter className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'chat':
        return 'default';
      case 'note':
        return 'secondary';
      case 'highlight':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className={cn('grid grid-rows-[auto_1fr_auto] h-full gap-0')}>
      {/* Header */}
      <div className="flex items-center justify-start p-4 gap-4 border-b">
        {/* <SearchIcon className="text-muted-foreground w-5 h-5" /> */}
        <div className="flex justify-center w-full ">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search documents..."
              className="pl-9 border-border bg-card text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Separator orientation="vertical" />
        <span className="text-sm text-muted-foreground">Source:</span>
        <Combobox options={sources} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[2fr_3fr] gap-0 overflow-hidden">
        {/* Left: Search Results List */}
        <div className="border-r overflow-y-auto">
          <div className="divide-y">
            {fakeSearchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => setSelectedResult(result)}
                className={cn(
                  'w-full text-left p-4 hover:bg-secondary transition-colors',
                  selectedResult.id === result.id && 'bg-secondary',
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-1 text-muted-foreground">
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {result.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {result.preview}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={getTypeBadgeVariant(result.type)}
                        className="text-xs"
                      >
                        {result.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {result.date}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Result Preview */}
        <div className="p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getTypeIcon(selectedResult.type)}
                <Badge variant={getTypeBadgeVariant(selectedResult.type)}>
                  {selectedResult.type}
                </Badge>
              </div>
              <h2 className="text-lg font-semibold">{selectedResult.title}</h2>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Preview
              </h3>
              <p className="text-sm leading-relaxed">
                {selectedResult.preview}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Details
              </h3>
              <div className="bg-secondary p-4 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Document:
                  </span>
                  <span className="text-sm font-medium">
                    {selectedResult.document}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Found:</span>
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedResult.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <Button className="flex-1" size="sm">
                Open
              </Button>
              <Button variant="outline" size="sm">
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Recent Searches */}
      <div className="border-t p-4 bg-secondary rounded-b-md">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Recent:</span>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-background"
            >
              ML basics
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-background"
            >
              Database
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-background"
            >
              API design
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
