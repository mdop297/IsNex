'use client';
import React from 'react';
import { Page } from 'react-pdf';
import { useViewer } from './PDFProvider';

const Canvas = () => {
  const { numPages } = useViewer();
  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-neutral-700 flex flex-col justify-center items-center">
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              className={'my-1'}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Canvas;
