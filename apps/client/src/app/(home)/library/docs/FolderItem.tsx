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
import React, { useRef, useState } from 'react';
import RenameModal from './UpdateNameModal';
import { useDeleteFolder, useUpdateFolder } from './useFolders';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';

const FolderItem = ({ folder }: { folder: FolderResponse }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmText, setConfirmText] = useState('');

  const { mutate: updateFolderName } = useUpdateFolder();
  const { mutate: deleteFolder, isPending: isPendingDeletingFolder } =
    useDeleteFolder();

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleDelete = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    deleteFolder(folder.id);
    // TODO: toggle all files in this folder
    toast.success(`${folder.name} is deleted successfully`);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            key={folder.id}
            className={`group relative my-1 cursor-pointer rounded border transition-all border-transparent hover:bg-item-hover
        `}
          >
            <div className="flex items-center justify-between min-w-0">
              <p className="truncate text-sm m-1 flex-1 min-w-0">
                📁 {folder.name}
              </p>

              {/* Date */}
              <div className="flex gap-3 pr-2">
                <p className="text-xs text-muted-foreground whitespace-nowrap  shrink-0">
                  {formatDateTime(folder.updated_at)}
                </p>
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
};

export default FolderItem;
