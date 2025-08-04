'use client';
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, TableOfContents } from 'lucide-react';
import { useViewer } from './PDFProvider';
import TreeOutline from './Outline';
export default PDFSidebar;

export function PDFSidebar() {
  const { isSidebarOpen } = useViewer();

  return (
    isSidebarOpen && (
      <>
        <div className="flex flex-col gap-6 h-full w-[280px]">
          <Tabs
            defaultValue="toc"
            className="w-full h-full flex flex-row justify-center-safe items-start gap-0"
          >
            <TabsList className="data flex flex-col gap-1 h-fit m-0.5 bg-transparent">
              <TabsTrigger value="toc" className="px-1">
                <TableOfContents className="aspect-square size-5" />
              </TabsTrigger>
              <TabsTrigger value="thumbnails" className="px-1">
                <Image className="aspect-square size-5" />
              </TabsTrigger>
            </TabsList>
            {/* Table of content */}
            <TabsContent value="toc" className="h-full w-full overflow-y-auto">
              <TreeOutline />
            </TabsContent>
            {/* Thumbnails */}
            <TabsContent
              value="thumbnails"
              className="h-full w-full bg-cyan-500"
            >
              Thumbnails
            </TabsContent>
          </Tabs>
        </div>
      </>
    )
  );
}
