'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import dynamic from 'next/dynamic';
import { PDFDocumentProxy } from 'pdfjs-dist';

const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  {
    ssr: false,
    loading: () => <div>Loading PDF...</div>,
  },
);

const setupPDFJS = async () => {
  const { pdfjs } = await import('react-pdf');

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  return pdfjs;
};

export type ViewerMode = 'preview' | 'full';

type ViewerContextType = {
  pdf: PDFDocumentProxy | null;
  setPdf: (pdf: PDFDocumentProxy) => void;
  numPages: number;
  setNumPages: (numPages: number) => void;
  currentPageNumber: number;
  setCurrentPageNumber: (page: number) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (prev: boolean) => void;
  fileUrl: string;
  setFileUrl: (url: string) => void;
  mode: ViewerMode;
  setMode: (m: ViewerMode) => void;
  // expandedMap: Record<string, boolean>;
  // setExpandedMap: (expandedMap: Record<string, boolean>) => void;
};

const ViewerContext = createContext<ViewerContextType | null>(null);

export const useViewer = () => {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error('useViewer must be used inside <PDFProvider>');
  return ctx;
};

const PDFProvider = ({
  children,
  className,
  fileUrl,
}: {
  children: React.ReactNode;
  className?: string;
  fileUrl: string;
}) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [url, setFileUrl] = useState<string>(fileUrl);
  const [mode, setMode] = useState<ViewerMode>('full');
  const [numPages, setNumPages] = useState<number>(0);
  // const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setupPDFJS();
  }, []);

  function onDocumentLoadSuccess(pdf: PDFDocumentProxy) {
    setNumPages(pdf.numPages);
    setCurrentPageNumber(1);
    setPdf(pdf);
    // console.log('THIS IS OUTLINE: ', pdf.getOutline());
  }

  return (
    <ViewerContext.Provider
      value={{
        fileUrl: url,
        pdf,
        setPdf,
        setFileUrl,
        numPages,
        setNumPages,
        currentPageNumber,
        setCurrentPageNumber,
        isSidebarOpen,
        setIsSidebarOpen,
        mode,
        setMode,
      }}
    >
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        className={className}
      >
        {children}
      </Document>
    </ViewerContext.Provider>
  );
};

export default PDFProvider;
