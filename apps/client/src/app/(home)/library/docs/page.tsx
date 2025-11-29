'use client';
import React from 'react';
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
import { useFolders } from './useFolders';
import FolderItem from './FolderItem';
import { useFolderStore } from './useFolderStore';
import CreateFolder from './CreateFolder';
import {
  DocumentResponse,
  FolderResponse,
} from '@/lib/generated/core/data-contracts';

const buildFolderTreeMap = (folders: FolderResponse[]) => {
  const tree = new Map<string | null, FolderResponse[]>();
  for (const folder of folders) {
    const key = folder.parent_id ?? null;
    if (!tree.has(key)) {
      tree.set(key, []);
    }
    tree.get(key)!.push(folder);
  }
  return tree;
};

const buildDocumentTreeMap = (documents: DocumentResponse[]) => {
  const tree = new Map<string | null, DocumentResponse[]>();
  for (const document of documents) {
    const key = document.folder_id ?? null;
    if (!tree.has(key)) {
      tree.set(key, []);
    }
    tree.get(key)!.push(document);
  }
  return tree;
};

const DocumentPage = () => {
  const {
    expandedFolders,
    toggleFolder,
    setIsCreatingFolder,
    setCurrentFolder,
  } = useFolderStore();

  const selectedFiles = useDocumentStore((state) => state.selectedFiles);
  const isPreviewOpen = useDocumentStore((state) => state.isPreviewOpen);
  const previewFileId = useDocumentStore((state) => state.previewFileId);
  const previewFile = useDocumentStore((state) => state.previewFile);

  const { data: documents, isLoading, isError, error } = useDocuments();
  const { data: folders } = useFolders();

  const documentTreeMap = buildDocumentTreeMap(documents || []);
  const folderTreeMap = buildFolderTreeMap(folders || []);

  const showRightPanel = selectedFiles.size > 0 || isPreviewOpen;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const renderItems = (
    foldersTree: Map<string | null, FolderResponse[]>,
    documents: Map<string | null, DocumentResponse[]>,
    parent_id: string | null = null,
    level = 0,
  ): React.ReactNode => {
    return foldersTree.get(parent_id)?.map((folder) => {
      const hasChildren =
        foldersTree.has(folder.id) ||
        (documents.get(folder.id)?.length ?? 0) > 0;
      const isExpanded = expandedFolders.has(folder.id);

      return (
        <React.Fragment key={folder.id}>
          <FolderItem
            folder={folder}
            style={{ paddingLeft: `${level * 16}px` }}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onClick={() => toggleFolder(folder.id)}
          />

          {isExpanded && (
            <>
              {documents.get(folder.id)?.map((document) => {
                return (
                  <DocumentItem
                    document={document}
                    key={document.id}
                    style={{ paddingLeft: `${(level + 1) * 16 + 20}px` }}
                  />
                );
              })}
              {renderItems(foldersTree, documents, folder.id, level + 1)}
            </>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <div className="flex flex-1 h-full w-full p-2 gap-2 min-w-0 overflow-hidden">
        {/* Left Panel */}
        <div
          className={`flex flex-1 flex-col p-2 min-w-0 duration-300 transition-all`}
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
                {renderItems(folderTreeMap, documentTreeMap)}
                {documentTreeMap
                  .get(null)
                  ?.map((doc) => <DocumentItem key={doc.id} document={doc} />)}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => {
                  setCurrentFolder(null);
                  setIsCreatingFolder(true);
                }}
              >
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
      <CreateFolder />
    </>
  );
};

export default DocumentPage;
