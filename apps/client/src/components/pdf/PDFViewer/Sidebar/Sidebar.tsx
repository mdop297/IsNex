'use client';

import { Image, LayoutList, TableOfContents } from 'lucide-react';
// import { useViewer } from "./PDFProvider";
// import TreeOutline from "./Outline";
import TreeOutline from './Outline';
import type { CommentedHighlight } from '../types';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import AnntationSidebar from './Annotations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Thumbnail from './Thumbnail';
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer.mjs';
import { RefObject } from 'react';
import SearchTab from './Search';

interface SidebarProps {
  pdfDocument: PDFDocumentProxy;
  viewerRef: RefObject<PDFViewer | null>;
  currentPage: number;
  highlights: Array<CommentedHighlight>;
  searchTabOpen: boolean;
  resetHighlights: () => void;
  onNavigation: (pageNumber: number) => void;
}

export function Sidebar({
  pdfDocument,
  viewerRef,
  currentPage,
  highlights,
  searchTabOpen,
  resetHighlights,
  onNavigation,
}: SidebarProps) {
  // const { isSidebarOpen } = useViewer();

  return (
    // isSidebarOpen && (
    <>
      <div className="flex flex-col gap-6 h-full w-[280px] border-r-2 border-neutral-700">
        {!searchTabOpen ? (
          <Tabs
            defaultValue="toc"
            className="w-full h-full flex flex-row justify-center-safe items-start gap-0 bg-neutral-700"
          >
            <TabsList className="data flex flex-col gap-1 h-fit m-0.5 bg-transparent">
              <TabsTrigger value="toc" className="px-1 hover:cursor-pointer">
                <TableOfContents className="size-5" />
              </TabsTrigger>
              <TabsTrigger
                value="thumbnails"
                className="px-1 hover:cursor-pointer"
              >
                <Image className="size-5" />
              </TabsTrigger>
              <TabsTrigger value="annos" className="px-1 hover:cursor-pointer">
                <LayoutList className="size-5" />
              </TabsTrigger>
            </TabsList>
            {/* Table of content */}
            <TabsContent
              value="toc"
              className="h-full w-full bg-secondary text-foreground"
            >
              <TreeOutline
                pdfDocument={pdfDocument}
                onNavigation={onNavigation}
              />
              {/* tree outline */}
            </TabsContent>
            {/* Thumbnails */}
            <TabsContent
              value="thumbnails"
              className="h-full w-full bg-neutral-200"
            >
              <Thumbnail
                pdfDocument={pdfDocument}
                viewerRef={viewerRef}
                currentPage={currentPage}
              />
            </TabsContent>
            <TabsContent
              value="annos"
              className="h-full w-full bg-neutral-200 overflow-y-auto hide-scrollbar"
            >
              {/* <TreeOutline /> */}
              <AnntationSidebar
                highlights={highlights}
                resetHighlights={resetHighlights}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="bg-neutral-200 h-full">
            <SearchTab />
          </div>
        )}
      </div>
    </>
    // )
  );
}

export default Sidebar;
