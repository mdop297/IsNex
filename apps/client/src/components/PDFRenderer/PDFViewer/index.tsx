'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const PDFPage = dynamic(() => import('./PDFPage'), { ssr: false });

const Canvas = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-neutral-700 min-h-full flex justify-center">
        <PDFPage />
      </div>
    </div>
  );
};

export default Canvas;
