import { create } from 'zustand';

interface DragDropState {
  draggedItem: { id: string; itemType: 'folder' | 'document' } | null;
  dropTarget: string | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
  hoverTimeout: NodeJS.Timeout | null;

  setDraggedItem: (
    item: { id: string; itemType: 'folder' | 'document' } | null,
  ) => void;
  setDropTarget: (targetId: string | null) => void;
  setDropPosition: (position: 'before' | 'after' | 'inside' | null) => void;
  setHoverTimeout: (timeout: NodeJS.Timeout | null) => void;
  clearHoverTimeout: () => void;
  resetDropState: () => void;
}

export const useDragDropStore = create<DragDropState>((set, get) => ({
  draggedItem: null,
  dropTarget: null,
  dropPosition: null,
  hoverTimeout: null,

  setDraggedItem: (item) => set({ draggedItem: item }),

  setDropTarget: (targetId) => set({ dropTarget: targetId }),

  setDropPosition: (position) => set({ dropPosition: position }),

  setHoverTimeout: (timeout) => {
    const state = get();
    if (state.hoverTimeout) {
      clearTimeout(state.hoverTimeout);
    }
    set({ hoverTimeout: timeout });
  },

  clearHoverTimeout: () => {
    const state = get();
    if (state.hoverTimeout) {
      clearTimeout(state.hoverTimeout);
    }
    set({ hoverTimeout: null });
  },

  resetDropState: () => {
    const state = get();
    if (state.hoverTimeout) {
      clearTimeout(state.hoverTimeout);
    }
    set({
      dropTarget: null,
      dropPosition: null,
      hoverTimeout: null,
    });
  },
}));
