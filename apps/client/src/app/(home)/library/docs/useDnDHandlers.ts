import { useDragDropStore } from './useDnDStore';
import { useFolderStore } from './useFolderStore';
import { useFolders } from './useFolders';
import { useUpdateDocuments } from './useUpdateDocuments'; // Assume you have mutation hooks
import { useUpdateFolder } from './useFolders';
import {
  DocumentResponse,
  FolderResponse,
} from '@/lib/generated/core/data-contracts';

export const useDragDropHandlers = () => {
  const {
    draggedItem,
    setDropTarget,
    setDropPosition,
    setHoverTimeout,
    clearHoverTimeout,
    resetDropState,
  } = useDragDropStore();

  const { expandedFolders, toggleFolder } = useFolderStore();
  const { data: folders } = useFolders();

  // Mutation hooks for updating documents and folders
  const updateDocument = useUpdateDocuments();
  const updateFolder = useUpdateFolder();

  const isDescendant = (parentId: string, childId: string): boolean => {
    let current = folders?.find((f) => f.id === childId);
    while (current && current.parent_id) {
      if (current.parent_id === parentId) return true;
      current = folders?.find((f) => f.id === current?.parent_id);
    }
    return false;
  };

  const calculateDropPosition = (
    e: React.DragEvent,
    itemType: 'folder' | 'document',
  ): 'before' | 'after' | 'inside' => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const height = rect.height;

    if (itemType === 'folder') {
      if (mouseY < height * 0.25) {
        return 'before';
      } else if (mouseY > height * 0.75) {
        return 'after';
      } else {
        return 'inside';
      }
    } else {
      return mouseY < height * 0.5 ? 'before' : 'after';
    }
  };

  const handleFolderDragOver = (e: React.DragEvent, folder: FolderResponse) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === folder.id) return;

    const position = calculateDropPosition(e, 'folder');

    setDropTarget(folder.id);
    setDropPosition(position);
    e.dataTransfer.dropEffect = 'move';

    // Auto-expand folder on hover
    if (!expandedFolders.has(folder.id) && position === 'inside') {
      clearHoverTimeout();
      const timeout = setTimeout(() => {
        toggleFolder(folder.id);
      }, 800);
      setHoverTimeout(timeout);
    } else {
      clearHoverTimeout();
    }
  };

  const handleDocumentDragOver = (
    e: React.DragEvent,
    document: DocumentResponse,
  ) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === document.id) return;

    const position = calculateDropPosition(e, 'document');

    setDropTarget(document.id);
    setDropPosition(position);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleFolderDrop = (
    e: React.DragEvent,
    targetFolder: FolderResponse,
  ) => {
    e.preventDefault();
    clearHoverTimeout();

    if (!draggedItem || draggedItem.id === targetFolder.id) {
      resetDropState();
      return;
    }

    const dropPos = useDragDropStore.getState().dropPosition;

    // Check if moving folder into itself or descendant
    if (
      draggedItem.itemType === 'folder' &&
      dropPos === 'inside' &&
      isDescendant(draggedItem.id, targetFolder.id)
    ) {
      alert('Cannot move a folder into itself or its descendant!');
      resetDropState();
      return;
    }

    let newParentId: string | null;

    if (dropPos === 'inside') {
      newParentId = targetFolder.id;
      // Auto-expand target folder
      if (!expandedFolders.has(targetFolder.id)) {
        toggleFolder(targetFolder.id);
      }
    } else {
      newParentId = targetFolder.parent_id ?? null;
    }

    // Update the item
    if (draggedItem.itemType === 'folder') {
      updateFolder.mutate({
        id: draggedItem.id,
        data: {
          parent_id: newParentId,
        },
      });
    } else {
      updateDocument.mutate({
        id: draggedItem.id,
        data: {
          folder_id: newParentId,
        },
      });
    }

    resetDropState();
  };

  const handleDocumentDrop = (
    e: React.DragEvent,
    targetDocument: DocumentResponse,
  ) => {
    e.preventDefault();
    clearHoverTimeout();

    if (!draggedItem || draggedItem.id === targetDocument.id) {
      resetDropState();
      return;
    }

    // const dropPos = useDragDropStore.getState().dropPosition;

    // Documents can only be dropped before/after (same level)
    const newFolderId = targetDocument.folder_id ?? null;

    // Update the item
    if (draggedItem.itemType === 'folder') {
      updateFolder.mutate({
        id: draggedItem.id,
        data: {
          parent_id: newFolderId,
        },
      });
    } else {
      updateDocument.mutate({
        id: draggedItem.id,
        data: {
          folder_id: newFolderId,
        },
      });
    }

    resetDropState();
  };

  return {
    handleFolderDragOver,
    handleFolderDrop,
    handleDocumentDragOver,
    handleDocumentDrop,
  };
};
