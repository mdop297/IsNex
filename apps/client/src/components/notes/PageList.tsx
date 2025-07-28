'use client';
import React, { useEffect, useState } from 'react';
import Item from './Item';
import { PageService } from './utils';
import { Page } from './types';

interface pageListProps {
  parentId?: string;
  level?: number;
  selectedId: string;
  onSelect: (pageId: string) => void;
}

const PageList = ({
  selectedId,
  onSelect,
  parentId = 'root',
  level = 0,
}: pageListProps) => {
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const load = async () => {
      const service = await PageService.createFromPath('/notes-data.json');
      const result = service.getPagesByParentId(parentId);
      setPages(result);
    };
    load();
  }, [parentId]);

  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  const onToggle = (id: string) => {
    setIsExpanded((prevIsExpanded) => ({
      ...prevIsExpanded,
      [id]: !prevIsExpanded[id],
    }));
  };

  return (
    <div>
      {pages.map((page) => (
        <div key={page.id}>
          <Item
            id={page.id}
            level={level}
            icon={page.icon}
            title={page.title}
            parentId={parentId}
            hasChildren={page.hasChildren}
            onToggle={() => onToggle(page.id)}
            expanded={isExpanded[page.id]}
            selectedId={selectedId}
            onSelect={onSelect}
          />
          {isExpanded[page.id] && (
            <PageList
              parentId={page.id}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PageList;
