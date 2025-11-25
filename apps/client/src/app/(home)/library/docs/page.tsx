'use client';
import React, { useState } from 'react';
import DocumentItem from './DocItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadIcon } from 'lucide-react';
import SelectedFilesPanel from './SelectedFilesPanel';
import { useDocumentStore } from './useDocumentStore';
import PreviewPanel from './PreviewPanel';
import { useDocuments } from './useDocuments';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useCreateFolder, useFolders } from './useFolders';
import FolderItem from './FolderItem';
import { useFolderStore } from './useFolderStore';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const DocumentPage = () => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');

  const selectedFiles = useDocumentStore((state) => state.selectedFiles);
  const isPreviewOpen = useDocumentStore((state) => state.isPreviewOpen);
  const previewFileId = useDocumentStore((state) => state.previewFileId);
  const previewFile = useDocumentStore((state) => state.previewFile);

  const { data: documents, isLoading, isError, error } = useDocuments();

  const currentFolder = useFolderStore((state) => state.currentFolder);

  const { mutate: createFolder } = useCreateFolder();

  const handleCreateFolder = () => {
    const name = folderName.trim();
    if (!name) return;
    createFolder({ parent_id: currentFolder, name: name });
    setIsCreatingFolder(false);
    setFolderName('');
  };

  const { data: folders } = useFolders();

  const showRightPanel = selectedFiles.size > 0 || isPreviewOpen;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex flex-1 h-full w-full p-2 gap-2 min-w-0 overflow-hidden">
        {/* Left Panel */}
        <div
          className={`flex flex-1 flex-col min-w-0 duration-300 transition-all`}
        >
          <div className="flex gap-2 items-center">
            {/* Search */}
            <Input
              placeholder="Search documents..."
              className="flex-1 text-sm"
            />
            {/* Upload file button */}
            <Button size="sm" className="shrink-0">
              <UploadIcon />
              <span>Upload files</span>
            </Button>
          </div>
          {/* Breadcrumb */}
          <div>Breadcrumb</div>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              {/* Folders */}

              <div className="overflow-auto h-full">
                {folders &&
                  folders.map((folder) => (
                    <FolderItem folder={folder} key={folder.id} />
                  ))}

                {/* Documents List */}
                {documents &&
                  documents.map((doc) => (
                    <DocumentItem document={doc} key={doc.id} />
                  ))}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => setIsCreatingFolder(true)}>
                New Folder
              </ContextMenuItem>
              <ContextMenuItem>Add to workspace</ContextMenuItem>
              <ContextMenuItem>Upload files</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>

        {/* Right Panel */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showRightPanel
              ? 'flex-1 max-w-[50%] opacity-100'
              : 'w-0 max-w-0 opacity-0'
          }`}
        >
          <div className="h-full w-full">
            {isPreviewOpen ? (
              <PreviewPanel fileId={previewFileId!} fileName={previewFile!} />
            ) : (
              selectedFiles.size > 0 && <SelectedFilesPanel />
            )}
          </div>
        </div>
      </div>

      <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input
              id="name-1"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreatingFolder(false);
                setFolderName('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!folderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentPage;
