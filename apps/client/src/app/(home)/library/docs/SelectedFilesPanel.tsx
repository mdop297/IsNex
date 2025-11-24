import React from 'react';
import { useDocumentStore } from './useDocumentStore';
import { Button } from '@/components/ui/button';

const SelectedFilesPanel = () => {
  const selectedFiles = useDocumentStore((state) => state.selectedFiles);

  return (
    <>
      <div className="border rounded p-3 flex flex-col flex-1 overflow-hidden h-full">
        <div className="mb-2 flex justify-between items-center gap-2 min-w-0">
          <h3 className="font-semibold text-base lg:text-lg mb-4">
            Selected Files ({selectedFiles.size})
          </h3>
          <Button size="sm" variant="outline" className="shrink-0 items-center">
            Close Preview <span>✕</span>
          </Button>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto gap-1 ">
          {Array.from(selectedFiles).map((fileName) => {
            return (
              <div
                key={fileName}
                className="group flex justify-between rounded hover:bg-item-hover pr-1 overflow-hidden"
              >
                <div className="flex gap-2 items-center m-2 min-w-0">
                  <span className="shrink-0">📄</span>
                  <span className="truncate text-sm">{fileName}</span>
                </div>
                <div className="gap-2 hidden group-hover:flex justify-center items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="group-hover:block shrink-0 text-xs rounded!"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SelectedFilesPanel;
