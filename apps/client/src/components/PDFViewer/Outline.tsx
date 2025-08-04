import React, { useEffect, useState } from 'react';

import { PDFDocumentProxy } from 'pdfjs-dist';
import { useViewer } from './PDFProvider';
import TreeOutlineItem from './OutelineItem';
// https://github.com/wojtekmaj/react-pdf/issues/1829
type PDFOutline = Awaited<ReturnType<PDFDocumentProxy['getOutline']>>;

export type PDFOutlineItem = PDFOutline[number];

const TreeOutline = () => {
  const { pdf } = useViewer();
  const [outline, setOutline] = useState<PDFOutline>([]);

  useEffect(() => {
    const load = async () => {
      if (pdf) {
        setOutline((await pdf.getOutline()) || []);
      }
    };
    load();
  }, [pdf]);

  return (
    <div className="flex flex-col">
      {outline.map((item, i) => (
        <TreeOutlineItem key={i} item={item} />
      ))}
    </div>
  );
};

export default TreeOutline;
