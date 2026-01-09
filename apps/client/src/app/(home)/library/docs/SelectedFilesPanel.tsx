import React from 'react';
import { useDocumentStore } from '../../../../stores/document';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const SelectedFilesPanel = () => {
  const selectedFiles = useDocumentStore((state) => state.selectedFiles);
  const toggleFileSelection = useDocumentStore(
    (state) => state.toggleFileSelection,
  );
  const clearSelection = useDocumentStore((state) => state.clearSelection);

  return (
    <div className="border rounded-lg p-4 flex flex-col h-full">
      {/* Header - fixed height */}
      <div className="flex justify-between items-center gap-2 mb-2 shrink-0">
        <h3 className="font-semibold text-base lg:text-lg">
          Selected Files ({selectedFiles.size})
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={clearSelection}
        >
          Remove All <span>✕</span>
        </Button>
      </div>

      {/* Scrollable area - takes remaining space */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
        {Array.from(selectedFiles).map((fileName) => (
          <div
            key={fileName}
            className="group flex justify-between rounded hover:bg-item-hover pr-1"
          >
            <div className="flex gap-2 items-center p-2 min-w-0 w-full">
              <span className="shrink-0">
                <FileText size={18} className="text-gray-500" />
              </span>
              <span className="truncate text-sm">{fileName}</span>
            </div>
            <div className="hidden group-hover:flex items-center">
              <Button
                size="sm"
                variant="ghost"
                className="group-hover:block hover:bg-input! shrink-0 text-xs m-0.5 py-0.5 rounded! h-6! px-2!"
                onClick={() => toggleFileSelection(fileName)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer button - fixed height */}
      <div className="mt-3 shrink-0">
        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full text-foreground"
          size="sm"
        >
          Open Workspace ({selectedFiles.size})
        </Button>
      </div>
    </div>
  );
};

export default SelectedFilesPanel;
