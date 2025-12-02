'use client';
import { Button } from '@/components/ui/button';
import { DocumentResponse } from '@/lib/generated/core/data-contracts';
import { formatDateTime } from '@/lib/utils';
import React, { forwardRef, useState } from 'react';
import { useDocumentStore } from '../../../../stores/document';
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
import { useDeleteDocument } from '../../../../api/document/useDeleteDocument';
import { toast } from 'sonner';
import RenameModal from './UpdateNameModal';
import { useUpdateDocuments } from '../../../../api/document/useUpdateDocuments';
import { Edit2, Eye, FileText } from 'lucide-react';

interface DocumentItemProps extends React.HTMLAttributes<HTMLDivElement> {
  document: DocumentResponse;
}

const DocumentItem = forwardRef<HTMLDivElement, DocumentItemProps>(
  ({ document, className, ...props }, ref) => {
    const selectedFiles = useDocumentStore((state) => state.selectedFiles);
    const openPreview = useDocumentStore((state) => state.openPreview);
    const toggleFileSelection = useDocumentStore(
      (state) => state.toggleFileSelection,
    );

    const { mutate: updateDocumentName } = useUpdateDocuments();
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
              className={`group relative my-1 p-1 cursor-pointer rounded border ${
                selectedFiles.has(document.name)
                  ? 'bg-item-selected '
                  : 'border-transparent hover:bg-item-hover'
              } ${className}`}
              {...props}
              ref={ref}
              onClick={handleClick}
            >
              <div className="flex items-center justify-between min-w-0">
                <p
                  className="truncate text-sm m-1 flex-1 min-w-0 flex gap-1"
                  // onDoubleClick={editName}
                >
                  <FileText size={18} className="text-gray-500" />
                  {document.name}
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

                <div className="gap-1 hidden group-hover:flex justify-center items-center ">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="group-hover:block hover:bg-input! shrink-0 text-xs m-0.5 py-0.5 rounded! h-6! px-2!"
                    onClick={editName}
                  >
                    <Edit2 />
                  </Button>

                  {/* Preview button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="group-hover:block hover:bg-input! shrink-0 text-xs m-0.5 rounded! h-6! px-2!"
                    onClick={handlePreview}
                  >
                    <Eye size={16} />
                  </Button>
                </div>
              </div>

              <RenameModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                currentName={document.name}
                entityId={document.id}
                onRename={(id, newName) =>
                  updateDocumentName({ id, data: { name: newName } })
                }
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {/* <ContextMenuItem onClick={handlePreview}>Preview</ContextMenuItem> */}
            <ContextMenuItem>Add to workspace</ContextMenuItem>
            <ContextMenuItem onClick={editName}>Rename</ContextMenuItem>
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
  },
);

DocumentItem.displayName = 'DocumentItem';

export default DocumentItem;
