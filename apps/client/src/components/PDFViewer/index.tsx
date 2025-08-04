'use client';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const PDFProvider = dynamic(() => import('./PDFProvider'), { ssr: false });

type ViewerProviderProps = {
  fileUrl: string;
  className?: string;
  children: ReactNode;
};

const ViewerProvider = ({
  fileUrl,
  className,
  children,
}: ViewerProviderProps) => {
  return (
    <PDFProvider fileUrl={fileUrl} className={className}>
      {children}
    </PDFProvider>
  );
};

export default ViewerProvider;
