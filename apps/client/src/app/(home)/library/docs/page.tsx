'use client';

import PDFPreview from '@/components/pdf/PDFViewer/PDFPreview';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { fake_data } from '../fake_docs';

type Folder = {
  name: string;
  folders: Folder[];
  files: FileInfo[];
};

type FileInfo = {
  name: string;
  uploadedDate: string;
};

const fileUrl1 = '/temp/48.pdf';

const DocumentPage = () => {
  const [openPreview, setOpenPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [data] = useState<Folder>(fake_data);

  // Track current folder path as array of folder names, empty = root
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // Find folder node by path recursively
  const findFolderByPath = (folder: Folder, path: string[]): Folder => {
    if (path.length === 0) return folder;
    const [next, ...rest] = path;
    const nextFolder = folder.folders.find((f) => f.name === next);
    if (!nextFolder) return folder;
    return findFolderByPath(nextFolder, rest);
  };

  // Current folder node
  const currentFolder = findFolderByPath(data, currentPath);

  // Handlers
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const onPreviewClick = (file: string) => {
    setPreviewFile(file);
    setOpenPreview(true);
  };

  const onFileSelect = (fileName: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  };

  const onFolderClick = (folderName: string) => {
    setCurrentPath((prev) => [...prev, folderName]);
    setPreviewFile(null);
    setOpenPreview(false);
  };

  const onBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index));
    setPreviewFile(null);
    setOpenPreview(false);
  };

  const closePreview = () => {
    setOpenPreview(false);
    setPreviewFile(null);
  };

  const openWorkspace = () => {
    // Tạo object workspace data để trả về
    const workspaceData = {
      selectedFiles: Array.from(selectedFiles),
      currentPath: currentPath,
      timestamp: new Date().toISOString(),
      folderContext: currentFolder.name,
    };

    console.log('Opening workspace with:', workspaceData);
    alert(`Workspace data: ${JSON.stringify(workspaceData, null, 2)}`);

    // Trong tương lai, sẽ navigate hoặc open workspace với workspaceData
    // router.push(`/workspace?data=${encodeURIComponent(JSON.stringify(workspaceData))}`);
  };

  // Filter files and folders by search query if any
  const filteredFolders = currentFolder.folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredFiles = currentFolder.files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex-1 flex flex-row gap-4 h-full min-w-0 w-full">
      {/* Left Panel */}
      <div
        className={`flex flex-col gap-4 border rounded p-3 shadow-sm transition-all  ${
          openPreview || selectedFiles.size > 0
            ? 'w-[500px] shrink-0'
            : 'flex-1 '
        }`}
      >
        {/* Search & Upload */}
        <div className="flex gap-2">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={onSearchChange}
            className="flex-grow text-sm"
          />
          <Button
            size="sm"
            onClick={() => alert('Upload coming soon!')}
            className="shrink-0"
          >
            Upload
          </Button>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem
              onClick={() => onBreadcrumbClick(0)}
              className="cursor-pointer hover:underline text-sm"
            >
              Root
            </BreadcrumbItem>
            {currentPath.map((folder, idx) => (
              <div key={idx} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  onClick={() => onBreadcrumbClick(idx + 1)}
                  className="cursor-pointer hover:underline text-sm"
                >
                  {folder}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Folders */}
        {filteredFolders.length !== 0 && (
          <div className="max-h-[30vh] lg:max-h-[35vh] overflow-auto">
            <h3 className="font-semibold mb-2 text-sm lg:text-base">Folders</h3>
            {filteredFolders.map((folder) => (
              <div
                key={folder.name}
                className="p-2 cursor-pointer hover:bg-sidebar-border rounded text-sm"
                onClick={() => onFolderClick(folder.name)}
              >
                📁 {folder.name}
              </div>
            ))}
          </div>
        )}

        {/* Files */}
        {filteredFiles.length !== 0 && (
          <div className="max-h-[35vh] lg:max-h-[40vh] overflow-auto">
            <h3 className="font-semibold mb-2 text-sm lg:text-base">Files</h3>
            {filteredFiles.map((fileInfo) => (
              <div
                key={fileInfo.name}
                className={`group relative p-2 cursor-pointer rounded border transition-all ${
                  selectedFiles.has(fileInfo.name)
                    ? 'bg-item-selected '
                    : 'border-transparent hover:bg-item-hover'
                }`}
                onClick={() => onFileSelect(fileInfo.name)}
              >
                <div className="flex items-center justify-between">
                  {/* File name - truncated when date is visible */}
                  <p className="truncate min-w-0 mr-2 text-sm max-w-[600px]">
                    📄 {fileInfo.name}
                  </p>

                  {/* Date - hidden on hover, replaced by Preview button */}
                  <p className="text-xs text-muted-foreground whitespace-nowrap group-hover:hidden shrink-0">
                    {formatDate(fileInfo.uploadedDate)}
                  </p>

                  {/* Preview button - only visible on hover */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="group-hover:block shrink-0 text-xs h-fit py-0.5 hidden m-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewClick(fileInfo.name);
                    }}
                  >
                    Preview
                  </Button>
                </div>

                {/* Selected indicator */}
                {selectedFiles.has(fileInfo.name) && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 file-item-selected-indicator rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel */}
      {(selectedFiles.size > 0 || openPreview) && (
        <div className="flex-1 flex flex-col gap-4 min-w-0 w-full ">
          {/* PDF Preview Panel */}
          {openPreview && previewFile && (
            <div className="border rounded p-3 flex flex-col flex-1 overflow-hidden">
              <div className="mb-2 flex justify-between items-center gap-2 min-w-0">
                <h3 className="font-semibold text-base truncate mr-2 ">
                  {previewFile}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={closePreview}
                  className="shrink-0 items-center"
                >
                  Close Preview <span>✕</span>
                </Button>
              </div>
              <div className="flex-1">
                <PDFPreview fileUrl={fileUrl1} />
              </div>
            </div>
          )}

          {/* Selected Files Panel - chỉ hiện khi không preview */}
          {!openPreview && selectedFiles.size > 0 && (
            <div className="flex-1 border rounded shadow-sm p-3 lg:p-4 flex flex-col max-h-screen">
              <h3 className="font-semibold text-base lg:text-lg mb-4">
                Selected Files ({selectedFiles.size})
              </h3>

              <div className="overflow-auto mb-4 ">
                {Array.from(selectedFiles).map((fileName) => {
                  // Find the file info for this fileName
                  const findFileInfo = (
                    folder: Folder,
                    name: string,
                  ): FileInfo | null => {
                    // Check files in current folder
                    const fileInfo = folder.files.find((f) => f.name === name);
                    if (fileInfo) return fileInfo;

                    // Recursively check subfolders
                    for (const subfolder of folder.folders) {
                      const found = findFileInfo(subfolder, name);
                      if (found) return found;
                    }
                    return null;
                  };

                  const fileInfo = findFileInfo(data, fileName);

                  return (
                    <div
                      key={fileName}
                      className="group p-2 cursor-pointer rounded hover:file-item-hover transition-all border border-transparent hover:border overflow-hidden"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 file-item-selected-indicator rounded-full flex-shrink-0"></div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="flex-shrink-0">📄</span>
                            <span className="truncate text-sm">{fileName}</span>
                          </div>
                          {fileInfo && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(fileInfo.uploadedDate)}
                            </div>
                          )}
                        </div>

                        <div className="hidden group-hover:flex gap-1 flex-shrink-0">
                          {/* Preview button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs px-2 py-1 h-auto hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPreviewClick(fileName);
                            }}
                          >
                            Preview
                          </Button>

                          {/* Remove button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 py-1 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileSelect(fileName); // Toggle to remove
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Open Workspace Button */}
              <Button
                onClick={openWorkspace}
                className="bg-blue-600 hover:bg-blue-700 w-full"
                size="sm"
              >
                Open Workspace ({selectedFiles.size})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentPage;
