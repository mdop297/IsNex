import { Button } from '@/components/ui/button';
import React from 'react';
import { useDocumentStore } from './useDocumentStore';
import PDFPreview from '@/components/pdf/PDFViewer/PDFPreview';
import { useDocument } from './useDocuments';

const PreviewPanel = ({
  fileId,
  fileName,
}: {
  fileId: string;
  fileName: string;
}) => {
  const closePreview = useDocumentStore((state) => state.closePreview);

  const { data, isLoading, isError, error } = useDocument(fileId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <>
      <div className="border rounded p-3 flex flex-col flex-1 overflow-hidden h-full">
        <div className="mb-2 flex justify-between items-center gap-2 min-w-0">
          <h3 className="font-semibold text-base truncate mr-2 ">{fileName}</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={closePreview}
            className="shrink-0 items-center"
          >
            Close Preview <span>✕</span>
          </Button>
        </div>
        <div className="flex-1">
          <PDFPreview fileUrl={data} />
        </div>
      </div>
    </>
  );
};

export default PreviewPanel;
