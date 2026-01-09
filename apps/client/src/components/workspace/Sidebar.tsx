'use client';

import {
  ArrowLeftFromLine,
  File,
  FileText,
  MessageSquare,
  MoreVertical,
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
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
} from '../ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useState } from 'react';

interface WorkspaceSidebarProps {
  href: string;
  isOpenViewer: boolean;
  toggleViewer: () => void;
  selectedDoc: string | null;
  onSelectDoc: (doc: string) => void;
}

// Mock data
const RECENT_DOCUMENTS = [
  {
    id: '1',
    name: 'Q3 Financial Report.pdf',
    type: 'pdf',
    time: '2 hours ago',
  },
  { id: '2', name: 'Project Proposal.pdf', type: 'pdf', time: '1 day ago' },
  { id: '3', name: 'Meeting Notes.pdf', type: 'pdf', time: '3 days ago' },
];

const RECENT_CHATS = [
  { id: 'c1', name: 'Q3 Analysis', type: 'chat', time: '1 hour ago' },
  { id: 'c2', name: 'Budget Discussion', type: 'chat', time: '2 days ago' },
];

export default function WorkspaceSidebar({
  href,
  isOpenViewer,
  toggleViewer,
  selectedDoc,
  onSelectDoc,
}: WorkspaceSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'documents' | 'chats'>(
    'documents',
  );

  const handleConfirmExit = () => {
    window.location.href = href;
  };

  const filteredDocs = RECENT_DOCUMENTS.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredChats = RECENT_CHATS.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="gap-3">
        {/* Header Actions */}
        <div
          className={`flex justify-between items-center transition-all ${
            state === 'expanded' ? 'gap-2' : 'flex-col gap-1'
          }`}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-foreground hover:text-foreground"
                title="Exit workspace"
              >
                <ArrowLeftFromLine size={20} className="text-foreground" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">
                  Exit workspace?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Unsaved changes will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-muted-foreground">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmExit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground"
            title={state === 'expanded' ? 'Collapse' : 'Expand'}
          >
            {state === 'expanded' ? (
              <PanelLeftClose size={18} className="text-foreground" />
            ) : (
              <PanelLeftOpen size={18} className="text-foreground" />
            )}
          </Button>
        </div>

        {/* Search Input */}
        {state === 'expanded' && (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8 h-9 bg-secondary border-border text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-4">
        <SidebarGroup>
          {/* Tabs for Documents/Chats */}
          {state === 'expanded' && (
            <div className="flex gap-1 rounded-md p-1">
              <Button
                variant={activeTab === 'documents' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => setActiveTab('documents')}
              >
                <FileText className="h-3 w-3" />
                Docs
              </Button>
              <Button
                variant={activeTab === 'chats' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 h-8 text-xs "
                onClick={() => setActiveTab('chats')}
              >
                <MessageSquare className="h-3 w-3" />
                Chats
              </Button>
            </div>
          )}

          <SidebarGroupLabel className="text-xs text-muted-foreground">
            {state === 'expanded' &&
              (activeTab === 'documents' ? 'Recent Documents' : 'Recent Chats')}
          </SidebarGroupLabel>

          <SidebarGroupContent className="gap-1">
            {/* Documents List */}
            {activeTab === 'documents' && (
              <>
                {filteredDocs.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2 py-4 text-center">
                    No documents found
                  </p>
                ) : (
                  filteredDocs.map((doc) => (
                    <SidebarMenuItem key={doc.id} className="list-none">
                      <SidebarMenuButton
                        isActive={selectedDoc === doc.name}
                        onClick={() => onSelectDoc(doc.name)}
                        className="relative group"
                      >
                        <File className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col">
                          <span className="truncate text-sm">{doc.name}</span>
                          {state === 'expanded' && (
                            <span className="text-xs text-muted-foreground">
                              {doc.time}
                            </span>
                          )}
                        </div>
                        {state === 'expanded' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded hover:bg-secondary cursor-pointer flex items-center justify-center transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </>
            )}

            {/* Chats List */}
            {activeTab === 'chats' && (
              <>
                {filteredChats.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2 py-4 text-center">
                    No chats found
                  </p>
                ) : (
                  filteredChats.map((chat) => (
                    <SidebarMenuItem key={chat.id} className="list-none">
                      <SidebarMenuButton className="group">
                        <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col">
                          <span className="truncate text-sm">{chat.name}</span>
                          {state === 'expanded' && (
                            <span className="text-xs text-muted-foreground">
                              {chat.time}
                            </span>
                          )}
                        </div>
                        {state === 'expanded' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded hover:bg-secondary cursor-pointer flex items-center justify-center transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Pin</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton onClick={toggleViewer}>
            {isOpenViewer ? (
              <>
                <File className="h-4 w-4" />
                {state === 'expanded' && <span>Hide Document</span>}
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                {state === 'expanded' && <span>Show Document</span>}
              </>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" />
            {state === 'expanded' && <span>Add Document</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
