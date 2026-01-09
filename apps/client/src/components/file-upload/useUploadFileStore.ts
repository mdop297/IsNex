import { create } from 'zustand';

type UploadFileStore = {
  openUploadModal: boolean;
  setOpenUploadModal: (open: boolean) => void;
  toggleUploadModal: () => void;
};

export const useUploadFileStore = create<UploadFileStore>((set) => ({
  openUploadModal: false,
  setOpenUploadModal: (open: boolean) => set({ openUploadModal: open }),
  toggleUploadModal: () =>
    set((state) => ({ openUploadModal: !state.openUploadModal })),
}));
