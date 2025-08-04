import { PDFDocumentProxy } from 'pdfjs-dist';
import { PDFOutlineItem } from './Outline';
import { useViewer } from './PDFProvider';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export class Ref {
  num: number;
  gen: number;

  constructor({ num, gen }: { num: number; gen: number }) {
    this.num = num;
    this.gen = gen;
  }

  toString() {
    let str = `${this.num}R`;
    if (this.gen !== 0) {
      str += this.gen;
    }
    return str;
  }
}

const TreeOutlineItem = ({ item }: { item: PDFOutlineItem }) => {
  const { pdf, setCurrentPageNumber } = useViewer();
  const [expanded, setExpanded] = useState(false);

  const getDestination = async (
    pdf: PDFDocumentProxy,
    item: PDFOutlineItem,
  ) => {
    if (typeof item.dest === 'string') {
      const dest = await pdf.getDestination(item.dest);
      console.log('this is new destination: ', dest);
      return dest;
    }
    return item.dest;
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleClick = async () => {
    if (!pdf || !setCurrentPageNumber) return;

    const destination = await getDestination(pdf, item);
    if (!destination) return;

    // const [ref, zoom, x, y, z] = destination;
    const [ref, , , y] = destination;
    const pageIndex = await pdf.getPageIndex(new Ref(ref));
    const pageNumber = pageIndex + 1;

    setCurrentPageNumber(pageNumber);

    // Wait for the page to render (hacky delay or observer in prod)
    setTimeout(() => {
      const pageEl = document.querySelector(
        `[data-page-number="${pageNumber}"]`,
      ) as HTMLElement;
      if (pageEl) {
        pageEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Optionally scroll to Y-offset within page (PDFs are bottom-up in coords)
        if (typeof y === 'number') {
          pageEl.scrollTop = pageEl.scrollHeight - y;
        }
      }
    }, 300);
  };

  return (
    <div className="ml-1 my-1">
      <div className="flex items-center gap-1">
        {item.items?.length > 0 ? (
          <ChevronRight
            className={`size-3.5 shrink-0 ${expanded ? 'rotate-90' : ''}`}
            onClick={handleToggle}
          />
        ) : (
          <span className="size-3.5 inline-block shrink-0" />
        )}
        <button
          className="text-left text-sm  hover:underline"
          onClick={handleClick}
        >
          {item.title}
        </button>
      </div>
      {expanded && item.items?.length > 0 && (
        <div className="ml-2">
          {item.items.map((child, idx) => (
            <TreeOutlineItem key={idx} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeOutlineItem;
