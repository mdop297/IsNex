'use client';

import PdfViewer from '@/components/pdf/PDFViewer/PDFViewer';

const fileUrl1 = '/temp/48.pdf';
// const fileUrl2 = '/temp/4.pdf';

const DocumentPage = () => {
  return (
    <>
      <PdfViewer fileUrl={fileUrl1} />
    </>
  );
};

export default DocumentPage;
