'use client';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { FolderResponse } from '@/lib/generated/core/data-contracts';
import { formatDateTime } from '@/lib/utils';
import React, { useState } from 'react';
import RenameModal from './UpdateNameModal';
import { useUpdateFolder } from './useUpdateFolder';

const FolderItem = ({ folder }: { folder: FolderResponse }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateFolderName } = useUpdateFolder();

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            key={folder.id}
            className={`group relative my-1 cursor-pointer rounded border transition-all border-transparent hover:bg-item-hover
        `}
          >
            <div className="flex items-center justify-between min-w-0">
              <p className="truncate text-sm m-1 flex-1 min-w-0">
                📁 {folder.name}
              </p>

              {/* Date */}
              <div className="flex gap-3 pr-2">
                <p className="text-xs text-muted-foreground whitespace-nowrap  shrink-0">
                  {formatDateTime(folder.updated_at)}
                </p>
              </div>
            </div>
            <RenameModal
              isOpen={isEditing}
              onClose={() => setIsEditing(false)}
              currentName={folder.name}
              entityId={folder.id}
              onRename={(id, newName) =>
                updateFolderName({ id, data: { name: newName } })
              }
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Add to workspace</ContextMenuItem>
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            Rename
          </ContextMenuItem>
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default FolderItem;
