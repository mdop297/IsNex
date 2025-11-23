'use client';
import { Button } from '@/components/ui/button';
import { DocumentResponse } from '@/lib/generated/core/data-contracts';
import { formatDateTime } from '@/lib/utils';
import React from 'react';
import { useDocumentStore } from './useDocumentStore';

const DocumentItem = ({ document }: { document: DocumentResponse }) => {
  const selectedFiles = useDocumentStore((state) => state.selectedFiles);
  const openPreview = useDocumentStore((state) => state.openPreview);
  const toggleFileSelection = useDocumentStore(
    (state) => state.toggleFileSelection,
  );

  const handleClick = () => {
    toggleFileSelection(document.name);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    openPreview(document.id, document.name);
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
        <p className="truncate min-w-0 mr-2 text-sm max-w-[600px]">
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
  );
};

export default DocumentItem;
