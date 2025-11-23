'use client';
import { Button } from '@/components/ui/button';
import { DocumentResponse } from '@/lib/generated/core/data-contracts';
import { formatDateTime } from '@/lib/utils';
import React, { useState } from 'react';
import { useDocumentStore } from './useDocumentStore';
import UpdateNameModal from './UpdateNameModal';

const DocumentItem = ({ document }: { document: DocumentResponse }) => {
  const selectedFiles = useDocumentStore((state) => state.selectedFiles);
  const openPreview = useDocumentStore((state) => state.openPreview);
  const toggleFileSelection = useDocumentStore(
    (state) => state.toggleFileSelection,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [, setNewFileName] = useState(document.name);

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

  return (
    <div
      key={document.id}
      className={`group relative my-0.5 p-2 cursor-pointer rounded border transition-all ${
        selectedFiles.has(document.name)
          ? 'bg-item-selected '
          : 'border-transparent hover:bg-item-hover'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        {/* File name - truncated when date is visible */}
        <p
          className="truncate min-w-0 mr-2 text-sm max-w-[600px]"
          onDoubleClick={editName}
        >
          📄 {document.name}
        </p>

        {/* Date */}
        <div className="flex gap-3">
          <p className="text-xs text-muted-foreground whitespace-nowrap group-hover:hidden shrink-0">
            {document.embedding_status}
          </p>
          <p className="text-xs text-muted-foreground whitespace-nowrap group-hover:hidden shrink-0">
            {formatDateTime(document.created_at)}
          </p>
        </div>

        <div className="gap-2 hidden group-hover:flex">
          <Button
            size="sm"
            variant="ghost"
            className="group-hover:block shrink-0 text-xs h-fit py-0.5 hidden m-0"
            onClick={editName}
          >
            Edit
          </Button>

          {/* Preview button */}
          <Button
            size="sm"
            variant="ghost"
            className="group-hover:block shrink-0 text-xs h-fit py-0.5 hidden m-0"
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
  );
};

export default DocumentItem;
