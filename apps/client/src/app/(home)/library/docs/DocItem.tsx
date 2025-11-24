'use client';
import { Button } from '@/components/ui/button';
import { DocumentResponse } from '@/lib/generated/core/data-contracts';
import { formatDateTime } from '@/lib/utils';
import React, { useState } from 'react';
import { useDocumentStore } from './useDocumentStore';
import UpdateNameModal from './UpdateNameModal';
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
import { useDeleteDocument } from './useDeleteDocument';
import { toast } from 'sonner';

const DocumentItem = ({ document }: { document: DocumentResponse }) => {
  const selectedFiles = useDocumentStore((state) => state.selectedFiles);
  const openPreview = useDocumentStore((state) => state.openPreview);
  const toggleFileSelection = useDocumentStore(
    (state) => state.toggleFileSelection,
  );

  const { mutate: deleteDocument, isPending: isDeletingPending } =
    useDeleteDocument();

  const [isEditing, setIsEditing] = useState(false);
  const [, setNewFileName] = useState(document.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = () => {
    toggleFileSelection(document.name);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    openPreview(document.id, document.name);
  };

  const editName = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setNewFileName(document.name);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    deleteDocument(document.id);
    if (selectedFiles.has(document.name)) {
      toggleFileSelection(document.name);
    }
    toast.success('Document deleted successfully');
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            key={document.id}
            className={`group relative my-0.5 cursor-pointer rounded border transition-all ${
              selectedFiles.has(document.name)
                ? 'bg-item-selected '
                : 'border-transparent hover:bg-item-hover'
            }`}
            onClick={handleClick}
          >
            <div className="flex items-center justify-between">
              {/* File name - truncated when date is visible */}
              <p
                className="truncate min-w-0 text-sm max-w-[600px] m-2"
                onDoubleClick={editName}
              >
                📄 {document.name}
              </p>

              {/* Date */}
              <div className="flex gap-3 pr-2">
                <p className="text-xs text-muted-foreground whitespace-nowrap group-hover:hidden shrink-0">
                  {document.embedding_status}
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap group-hover:hidden shrink-0">
                  {formatDateTime(document.created_at)}
                </p>
              </div>

              <div className="gap-2 hidden group-hover:flex justify-center items-center pr-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="group-hover:block shrink-0 text-xs m-0.5 py-0.5"
                  onClick={editName}
                >
                  Edit
                </Button>

                {/* Preview button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="group-hover:block shrink-0 text-xs m-0.5 py-0.5"
                  onClick={handlePreview}
                >
                  Preview
                </Button>
              </div>
            </div>

            <UpdateNameModal
              isOpen={isEditing}
              onClose={() => setIsEditing(false)}
              currentName={document.name}
              documentId={document.id}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handlePreview}>Preview</ContextMenuItem>
          <ContextMenuItem>Add to workspace</ContextMenuItem>
          <ContextMenuItem onClick={editName}>Edit name</ContextMenuItem>
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
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button disabled={isDeletingPending} onClick={handleDelete}>
              {isDeletingPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentItem;
