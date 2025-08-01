'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const PDFPage = dynamic(() => import('./PDFPage'), { ssr: false });

const Canvas = () => {
  return (
    <ScrollArea className="h-full overflow-auto">
      <div className="w-full bg-neutral-700 flex justify-center">
        <PDFPage />
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default Canvas;
