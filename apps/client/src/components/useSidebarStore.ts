import { create } from 'zustand';

type SidebarStore = {
  isRename: boolean;
  isDeleting: boolean;
  currentItem: string | null;
  currentValue: string | null;
  currentObject: string | null;
  setIsRename: (isRename: boolean) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  setCurrentItem: (item: string | null) => void;
  setCurrentValue: (item: string | null) => void;
  setCurrentObject: (item: string | null) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isRename: false,
  isDeleting: false,
  currentItem: null,
  currentValue: null,
  currentObject: null,
  setIsRename: (isRename: boolean) => set({ isRename }),
  setIsDeleting: (isDeleting: boolean) => set({ isDeleting }),
  setCurrentItem: (item: string | null) => set({ currentItem: item }),
  setCurrentValue: (item: string | null) => set({ currentValue: item }),
  setCurrentObject: (item: string | null) => set({ currentObject: item }),
}));
