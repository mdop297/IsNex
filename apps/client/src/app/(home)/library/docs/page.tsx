'use client';
import React from 'react';
import DocumentItem from './DocItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Upload } from 'lucide-react';
import SelectedFilesPanel from './SelectedFilesPanel';
import { useDocumentStore } from '@/stores/document';
import PreviewPanel from './PreviewPanel';
import { useDocuments } from '@/api/document/useDocuments';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useFolders } from '@/api/folder/useFolders';
import FolderItem from './FolderItem';
import { useFolderStore } from '@/stores/folder';
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
      <div className="flex flex-col h-screen bg-background text-foreground">
        <header className="border-b border-border bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Documents</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and organize your files with the new modern interface
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Upload size={16} />
                Upload
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 h-full w-full p-4 gap-2 min-w-0 overflow-hidden">
          {/* Left Panel */}
          <div
            className={`flex flex-1 flex-col gap-2 min-w-0 duration-300 transition-all`}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search documents..."
                className="pl-9 border-border text-foreground placeholder:text-muted-foreground bg-background!"
              />
            </div>
            {/* Breadcrumb */}
            {/* <div>Breadcrumb</div> */}
            <div className="flex-1 overflow-auto rounded-lg border border-border">
              <div className="p-2 space-y-1">
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    {/* Folders */}

                    <div className="overflow-auto h-full">
                      {renderItems(folderTreeMap, documentTreeMap)}
                      {documentTreeMap
                        .get(null)
                        ?.map((doc) => (
                          <DocumentItem key={doc.id} document={doc} />
                        ))}
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
            </div>
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
      </div>

      <CreateFolder />
    </>
  );
};

export default DocumentPage;
