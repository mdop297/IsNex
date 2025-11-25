import { FolderResponse } from '@/lib/generated/core/data-contracts';
import { formatDateTime } from '@/lib/utils';
import React from 'react';

const FolderItem = ({ folder }: { folder: FolderResponse }) => {
  return (
    <>
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
            <p className="text-xs text-muted-foreground whitespace-nowrap group-hover:hidden shrink-0">
              {formatDateTime(folder.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FolderItem;
