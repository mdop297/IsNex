'use client';
import { coreApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import DocumentItem from './DocItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadIcon } from 'lucide-react';
import SelectedFilesPanel from './SelectedFilesPanel';
import { useDocumentStore } from './useDocumentStore';
import PreviewPanel from './PreviewPanel';

const DocumentPage = () => {
  const selectedFiles = useDocumentStore((state) => state.selectedFiles);
  const isPreviewOpen = useDocumentStore((state) => state.isPreviewOpen);
  const previewFileId = useDocumentStore((state) => state.previewFileId);
  const previewFile = useDocumentStore((state) => state.previewFile);

  const {
    data: documents,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['docs'],
    queryFn: async () => {
      const res = await coreApi.getDocumentsByFolderId();
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.data;
    },
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex flex-1 h-full w-full p-2 gap-2">
        {/* Left Panel */}
        <div className="flex flex-1 flex-col w-full">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search documents..."
              // value={searchQuery}
              // onChange={onSearchChange}
              className="flex-grow text-sm"
            />
            <Button
              size="sm"
              onClick={() => alert('Upload coming soon!')}
              className="shrink-0"
            >
              <UploadIcon />
              <span>Upload files</span>
            </Button>
          </div>

          <div>Breadcrumb</div>
          <div>Folders</div>
          <div></div>
          <div>
            {documents &&
              documents.map((doc) => (
                <DocumentItem document={doc} key={doc.id} />
              ))}
          </div>
        </div>
        {/* Right Panel */}
        {(selectedFiles.size > 0 || isPreviewOpen) && (
          <div className="flex-1 h-full max-w-1/2">
            {isPreviewOpen && (
              <PreviewPanel fileId={previewFileId!} fileName={previewFile!} />
            )}
            {!isPreviewOpen && selectedFiles.size > 0 && <SelectedFilesPanel />}
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentPage;
