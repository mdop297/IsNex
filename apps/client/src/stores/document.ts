import { create } from 'zustand';

type DocumentStore = {
  currentPath: string[];
  selectedFiles: Set<string>;
  previewFile: string | null;
  previewFileId: string | null;
  isPreviewOpen: boolean;

  // Actions
  toggleFileSelection: (fileName: string) => void;
  openPreview: (id: string, fileName: string) => void;
  closePreview: () => void;
  clearSelection: () => void;
};

export const useDocumentStore = create<DocumentStore>((set) => ({
  currentPath: [],
  selectedFiles: new Set(),
  previewFile: null,
  isPreviewOpen: false,
  previewFileId: null,

  toggleFileSelection: (fileName: string) => {
    set((state) => {
      const newSet = new Set(state.selectedFiles);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return { selectedFiles: newSet };
    });
  },

  openPreview: (id: string, fileName: string) => {
    set({ previewFileId: id, previewFile: fileName, isPreviewOpen: true });
  },

  closePreview: () => set({ previewFile: null, isPreviewOpen: false }),

  clearSelection: () => {
    set({
      selectedFiles: new Set(),
    });
  },
}));
