'use client';
import { useState } from 'react';
import {
  Highlight,
  PdfHighlighter,
  PdfLoader,
  PdfScaleValue,
} from './react-pdf-highlighter';
import HighlightContainer from './HighlightContainer';

interface PDFPreviewProps {
  fileUrl: string;
}

const PDFPreview = ({ fileUrl }: PDFPreviewProps) => {
  const [highlights] = useState<Array<Highlight>>([]);
  const [, setCurrentPage] = useState<number>(1);
  const [pdfScaleValue] = useState<PdfScaleValue | undefined>('page-width');
  return (
    <div className="App flex flex-col h-full">
      <div className="flex overflow-hidden h-full">
        <div className=" flex-1 relative ">
          <PdfLoader document={fileUrl}>
            {(pdfDocument) => (
              <PdfHighlighter
                enableAreaSelection={(event) => event.altKey}
                pdfDocument={pdfDocument}
                utilsRef={() => {}}
                selectionTip={undefined}
                highlights={highlights}
                pdfScaleValue={pdfScaleValue}
                setCurrentPage={setCurrentPage}
              >
                <HighlightContainer editHighlight={() => {}} />
              </PdfHighlighter>
            )}
          </PdfLoader>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
