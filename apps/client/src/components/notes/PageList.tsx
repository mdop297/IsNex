'use client';
import React, { useState } from 'react';
import Item from './Item';
import { PageService } from './utils';
import { Page } from './types';

interface pageListProps {
  parentId?: string;
  level?: number;
}

const service = await PageService.createFromPath('/notes-data.json');

const PageList = ({ parentId = 'root', level = 0 }: pageListProps) => {
  const [pages] = useState<Page[]>(service.getPagesByParentId(parentId));

  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  const onToggle = (id: string) => {
    console.log('this button is also clicked');
    setIsExpanded((prevIsExpanded) => ({
      ...prevIsExpanded,
      [id]: !prevIsExpanded[id],
    }));
  };

  return (
    <div className="space-y-0.5">
      {pages.map((page) => (
        <div key={page.id}>
          <Item
            level={level}
            icon={page.icon}
            title={page.title}
            id={page.id}
            parentId={parentId}
            hasChildren={page.hasChildren}
            onToggle={() => onToggle(page.id)}
            expanded={isExpanded[page.id]}
          />
          {isExpanded[page.id] && (
            <PageList parentId={page.id} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

export default PageList;
