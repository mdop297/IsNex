import { create } from 'zustand';

type FolderStore = {
  currentFolder: string | null;
  setCurrentFolder: (folder: string) => void;
};

export const useFolderStore = create<FolderStore>((set) => ({
  currentFolder: null,
  setCurrentFolder: (folder: string) => set({ currentFolder: folder }),
}));
