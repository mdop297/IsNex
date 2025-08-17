export type Note = {
  id: string;
  title: string;
  parentId?: string | null;
  content: string;
  position: number;
  isFavorite?: boolean;
  favoriteOrder?: number;
  emoji?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Page = {
  id: string;
  title: string;
  parentId: string | null;
  isExpanded: boolean;
  icon: string; // dùng cho emoji
  position: number;
  hasChildren: boolean;
};

export type NoteTree = Note & { children: NoteTree[] };
