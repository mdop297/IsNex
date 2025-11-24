'use client';
import React from 'react';
import DocumentItem from './DocItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadIcon } from 'lucide-react';
import SelectedFilesPanel from './SelectedFilesPanel';
import { useDocumentStore } from './useDocumentStore';
import PreviewPanel from './PreviewPanel';
import { useDocuments } from './useDocuments';

const DocumentPage = () => {
  const selectedFiles = useDocumentStore((state) => state.selectedFiles);
  const isPreviewOpen = useDocumentStore((state) => state.isPreviewOpen);
  const previewFileId = useDocumentStore((state) => state.previewFileId);
  const previewFile = useDocumentStore((state) => state.previewFile);

  const { data: documents, isLoading, isError, error } = useDocuments();

  const showRightPanel = selectedFiles.size > 0 || isPreviewOpen;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex flex-1 h-full w-full p-2 gap-2 min-w-0 overflow-hidden">
        {/* Left Panel */}
        <div
          className={`flex flex-1 flex-col min-w-0 duration-300 transition-all`}
        >
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search documents..."
              className="flex-1 text-sm"
            />
            <Button size="sm" className="shrink-0">
              <UploadIcon />
              <span>Upload files</span>
            </Button>
          </div>

          <div>Breadcrumb</div>
          <div>Folders</div>
          <div className="overflow-auto">
            {documents &&
              documents.map((doc) => (
                <DocumentItem document={doc} key={doc.id} />
              ))}
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showRightPanel
              ? 'flex-1 max-w-[50%] opacity-100'
              : 'w-0 max-w-0 opacity-0'
          }`}
        >
          <div className="h-full w-full">
            {isPreviewOpen ? (
              <PreviewPanel fileId={previewFileId!} fileName={previewFile!} />
            ) : (
              selectedFiles.size > 0 && <SelectedFilesPanel />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPage;
