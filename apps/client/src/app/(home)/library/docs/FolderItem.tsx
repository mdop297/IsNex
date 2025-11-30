'use client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FolderResponse } from '@/lib/generated/core/data-contracts';
import { formatDateTime } from '@/lib/utils';
import React, { forwardRef, useRef, useState } from 'react';
import RenameModal from './UpdateNameModal';
import { useDeleteFolder, useUpdateFolder } from './useFolders';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  FolderClosed,
  Plus,
  Upload,
} from 'lucide-react';
import { useFolderStore } from './useFolderStore';
import { useUploadFileStore } from '@/components/file-upload/useUploadFileStore';

interface FolderItemProps extends React.HTMLAttributes<HTMLDivElement> {
  folder: FolderResponse;
  isExpanded: boolean;
  hasChildren: boolean;
}

const FolderItem = forwardRef<HTMLDivElement, FolderItemProps>(
  ({ folder, isExpanded, hasChildren, className, ...props }, ref) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [confirmText, setConfirmText] = useState('');

    const { setIsCreatingFolder, setCurrentFolder } = useFolderStore();
    const { toggleUploadModal } = useUploadFileStore();

    const { mutate: updateFolderName } = useUpdateFolder();
    const { mutate: deleteFolder, isPending: isPendingDeletingFolder } =
      useDeleteFolder();

    const handleCancelDelete = () => {
      setIsDeleting(false);
    };

    const handleUpload = () => {
      toggleUploadModal();
      setCurrentFolder(folder.id);
    };

    const handleDelete = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      setIsDeleting(true);
      deleteFolder(folder.id);
      // TODO: toggle all files in this folder
      toast.success(`${folder.name} is deleted successfully`);
    };
    const handleCreateFolder = (folder: FolderResponse) => {
      setIsCreatingFolder(true);
      setCurrentFolder(folder.id);
    };

    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              key={folder.id}
              ref={ref}
              className={`group relative my-1 p-1 cursor-pointer rounded border transition-all border-transparent hover:bg-item-hover ${className || ''}`}
              {...props}
            >
              <div className="flex items-center justify-between min-w-0">
                <span className="w-4 h-4 flex items-center justify-center">
                  {hasChildren &&
                    (isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </span>
                <p className="truncate text-sm m-1 flex-1 min-w-0 flex gap-1">
                  <FolderClosed size={18} className="text-blue-500" />{' '}
                  {folder.name}
                </p>

                {/* Date */}
                <div className="flex gap-3 pr-2">
                  <p className="text-xs text-muted-foreground whitespace-nowrap group-hover:hidden shrink-0">
                    {formatDateTime(folder.updated_at)}
                  </p>
                </div>

                <div className="gap-1 hidden group-hover:flex justify-center items-center ">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="group-hover:block hover:bg-input! shrink-0 text-xs m-0.5 rounded! h-6! px-2!"
                    onClick={handleUpload}
                  >
                    <Upload />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="group-hover:block hover:bg-input! shrink-0 text-xs m-0.5 py-0.5 rounded! h-6! px-2!"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 />
                  </Button>

                  {/* Preview button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="group-hover:block hover:bg-input! shrink-0 text-xs m-0.5 rounded! h-6! px-2!"
                    onClick={() => handleCreateFolder(folder)}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              <RenameModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                currentName={folder.name}
                entityId={folder.id}
                onRename={(id, newName) =>
                  updateFolderName({ id, data: { name: newName } })
                }
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleCreateFolder(folder)}>
              New folder
            </ContextMenuItem>
            <ContextMenuItem onClick={handleUpload}>New file</ContextMenuItem>
            <ContextMenuItem>Add to workspace</ContextMenuItem>
            <ContextMenuItem onClick={() => setIsEditing(true)}>
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              variant="destructive"
              onClick={() => setIsDeleting(true)}
            >
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                folder and all its contents.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder={`Type "${folder.name}" to confirm`}
              ref={inputRef}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (
                  e.key === 'Enter' &&
                  confirmText === folder.name &&
                  !isPendingDeletingFolder
                ) {
                  handleDelete(e);
                }
              }}
            />
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button
                disabled={
                  isPendingDeletingFolder ||
                  inputRef.current?.value !== folder.name
                }
                onClick={handleDelete}
              >
                {isPendingDeletingFolder ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
);
FolderItem.displayName = 'FolderItem';

export default FolderItem;
