import { useEffect, useState } from 'react';
import {
  ArrowDownToLine,
  EllipsisVertical,
  Highlighter,
  Menu,
  Minus,
  Plus,
  Search,
} from 'lucide-react';

import '../style/Toolbar.css';

import { type PdfScaleValue } from '../react-pdf-highlighter';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PRIMARY_PDF_URL } from '../PDFViewer';

interface ToolbarProps {
  setPdfScaleValue: (value: PdfScaleValue) => void;
  toggleHighlightPen: () => void;
  toggleSidebar: () => void;
  currentPage: number;
  totalPages: number;
  isSidebarOpen: boolean;
  searchTabOpen: boolean;
  toggleSearchBar: () => void;
  onPageChange: (page: number) => void;
}

const Toolbar = ({
  setPdfScaleValue,
  toggleHighlightPen,
  toggleSidebar,
  currentPage,
  totalPages,
  isSidebarOpen,
  searchTabOpen,
  toggleSearchBar,
  onPageChange,
}: ToolbarProps) => {
  const [zoom, setZoom] = useState<number | null>(null);
  const [isHighlightPen, setIsHighlightPen] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState(currentPage.toString());

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const zoomIn = () => {
    if (zoom) {
      if (zoom < 4) {
        setPdfScaleValue(zoom + 0.1);
        setZoom(zoom + 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  const zoomOut = () => {
    if (zoom) {
      if (zoom > 0.2) {
        setPdfScaleValue(zoom - 0.1);
        setZoom(zoom - 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  const zoomByOption = (value: PdfScaleValue | string) => {
    if (
      value === 'page-width' ||
      value === 'page-fit' ||
      value === 'page-actual' ||
      value === 'page-height' ||
      value === 'auto'
    ) {
      setPdfScaleValue(value);
      setZoom(null);
    } else if (typeof value === 'string') {
      const zoomNum = parseFloat(value);
      if (!isNaN(zoomNum)) {
        setPdfScaleValue(zoomNum / 100);
        setZoom(zoomNum / 100);
      }
    }
  };

  const downloadPDF = async () => {
    const res = await fetch(PRIMARY_PDF_URL);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'myfile.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="h-10 px-3 py-0.5  bg-secondary rounded-xs flex flex-row text-neutral-200 shrink-0">
      <div className="w-full flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-3 text-sm">
          <Button
            className="bg-secondary hover:bg-input text-foreground"
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
            size={'icon-sm'}
          >
            <Menu />
          </Button>
          <div className="flex gap-1 items-center justify-center">
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const page = Number(pageInput);
                  if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    onPageChange(page);
                  } else {
                    setPageInput(currentPage.toString());
                  }
                }
              }}
              onBlur={() => {
                const page = Number(pageInput);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                  onPageChange(page);
                } else {
                  setPageInput(currentPage.toString());
                }
              }}
              className="w-12 h-fit py-0.5 rounded-xs px-2 text-sm border-0 bg-input text-foreground text-right hide-spinner"
            />
            <span className="text-foreground">/ {totalPages}</span>
          </div>
          <Button
            className="bg-secondary hover:bg-input text-foreground"
            onClick={() => {
              toggleSearchBar();
              if (!isSidebarOpen) {
                toggleSidebar();
              }
            }}
            size={'icon-sm'}
          >
            <Search
              className={`size-4 ${searchTabOpen ? 'text-purple-500' : ''} `}
            />
          </Button>
        </div>
        {/* Center section */}

        <div className="flex items-center space-x-1 text-sm h-5 gap-1">
          <Button
            className="bg-secondary hover:bg-input text-foreground"
            size={'icon-sm'}
            title="Zoom in"
            onClick={zoomIn}
          >
            <Plus className="size-4 aspect-square" />
          </Button>
          <Select defaultValue="page-fit" onValueChange={zoomByOption}>
            <SelectTrigger className="border-none text-foreground" size={'sm'}>
              <SelectValue
                placeholder="auto"
                className="text-sm text-foreground"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="page-width">Page Width</SelectItem>
              <SelectItem value="page-height">Page Height</SelectItem>
              <SelectItem value="page-fit">Page Fit</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="150">150%</SelectItem>
              <SelectItem value="200">200%</SelectItem>
              <SelectItem value="250">250%</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-secondary hover:bg-input text-foreground"
            size={'icon-sm'}
            title="Zoom out"
            onClick={zoomOut}
          >
            <Minus className="size-4" />
          </Button>

          <Separator orientation="vertical" className="bg-foreground " />
          <Button
            className={`bg-secondary hover:bg-input! font-normal ${isHighlightPen ? 'text-purple-500' : 'text-foreground'}`}
            aria-label="zoom"
            variant="ghost"
            title="Highlight"
            onClick={() => {
              toggleHighlightPen();
              setIsHighlightPen(!isHighlightPen);
            }}
            size={'sm'}
          >
            <Highlighter className="size-4" />
            Highlight
          </Button>
          {/* Eraser for later  */}
          {/* <Button
            className="toolbar-button font-normal"
            aria-label="zoom"
            variant="ghost"
          >
            <Eraser className="size-4" />
            Erase
          </Button> */}
        </div>
        {/* Right section */}

        <div className="flex items-center space-x-1 text-sm h-5">
          <Button
            className="bg-secondary hover:bg-input text-foreground"
            size={'icon-sm'}
            onClick={downloadPDF}
          >
            <ArrowDownToLine className="size-4" />
          </Button>

          <Button
            className="bg-secondary hover:bg-input text-foreground"
            size={'icon-sm'}
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
