import { create } from 'zustand';

type SidebarStore = {
  renameItem: string | null;
  renameValue: string | null;
  renameObject: string | null;
  setRenameItem: (item: string | null) => void;
  setRenameValue: (item: string | null) => void;
  setRenameObject: (item: string | null) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  renameItem: null,
  renameValue: null,
  renameObject: null,
  setRenameItem: (item: string | null) => set({ renameItem: item }),
  setRenameValue: (item: string | null) => set({ renameValue: item }),
  setRenameObject: (item: string | null) => set({ renameObject: item }),
}));
