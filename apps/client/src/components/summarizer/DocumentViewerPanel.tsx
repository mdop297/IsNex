'use client';

import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface Document {
  id: string;
  name: string;
  url: string;
  pages: number;
}

interface DocumentViewerPanelProps {
  document: Document;
}

export default function DocumentViewerPanel({
  document,
}: DocumentViewerPanelProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Card className="flex-1 flex flex-col overflow-hidden border rounded-md py-0!">
      {/* Document Viewer - Scrollable */}
      <div className="flex-1 overflow-auto relative bg-muted/20">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="flex flex-col items-center gap-2">
              <Spinner />
              <p className="text-sm text-muted-foreground">
                Loading document...
              </p>
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        <iframe
          src={document.url}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          title={`Preview of ${document.name}`}
        />
      </div>
    </Card>
  );
}
