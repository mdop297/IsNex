import { create } from 'zustand';

type FolderStore = {
  currentFolder: string | null;
  expandedFolders: Set<string>;
  isCreatingFolder: boolean;
  setCurrentFolder: (folder: string | null) => void;
  toggleFolder: (folder: string) => void;
  setIsCreatingFolder: (isCreating: boolean) => void;
};

export const useFolderStore = create<FolderStore>((set) => ({
  currentFolder: null,
  expandedFolders: new Set(),
  isCreatingFolder: false,
  setCurrentFolder: (folder: string | null) => set({ currentFolder: folder }),
  toggleFolder: (folderId: string) =>
    set((state) => {
      const newSet = new Set(state.expandedFolders);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return { expandedFolders: newSet };
    }),
  setIsCreatingFolder: (isCreating: boolean) =>
    set({ isCreatingFolder: isCreating }),
}));
