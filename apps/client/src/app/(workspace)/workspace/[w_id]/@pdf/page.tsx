import PdfViewer from '@/components/pdf/PDFViewer/PDFViewer';
import React from 'react';

const pdf = () => {
  return (
    <div className="w-full h-full">
      <PdfViewer fileUrl="https://arxiv.org/pdf/2510.26692" />;
    </div>
  );
};

export default pdf;
