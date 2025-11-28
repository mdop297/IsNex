'use client';
import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

const FileExplorer = () => {
  // Load từ memory hoặc có thể dùng storage API
  const [items, setItems] = useState([
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      parent_id: null,
      expanded: true,
    },
    {
      id: '2',
      name: 'Pictures',
      type: 'folder',
      parent_id: null,
      expanded: false,
    },
    { id: '3', name: 'Work', type: 'folder', parent_id: '1', expanded: false },
    {
      id: '4',
      name: 'Personal',
      type: 'folder',
      parent_id: '1',
      expanded: false,
    },
    { id: '5', name: 'report.pdf', type: 'file', parent_id: '1' },
    {
      id: '6',
      name: 'Vacation',
      type: 'folder',
      parent_id: '2',
      expanded: false,
    },
    { id: '7', name: 'photo1.jpg', type: 'file', parent_id: '2' },
    {
      id: '8',
      name: 'Downloads',
      type: 'folder',
      parent_id: null,
      expanded: false,
    },
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropPosition, setDropPosition] = useState(null); // 'inside', 'before', 'after'
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === item.id) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const height = rect.height;

    // Xác định vùng drop: trên (20%), giữa (60%), dưới (20%)
    let position;
    if (item.type === 'folder') {
      if (mouseY < height * 0.25) {
        position = 'before';
      } else if (mouseY > height * 0.75) {
        position = 'after';
      } else {
        position = 'inside';
      }
    } else {
      // File chỉ có before/after
      position = mouseY < height * 0.5 ? 'before' : 'after';
    }

    setDropTarget(item.id);
    setDropPosition(position);
    e.dataTransfer.dropEffect = 'move';

    // Auto-expand folder sau 800ms khi hover vào giữa (inside)
    if (item.type === 'folder' && !item.expanded && position === 'inside') {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }

      const timeout = setTimeout(() => {
        setItems((prevItems) =>
          prevItems.map((i) =>
            i.id === item.id ? { ...i, expanded: true } : i,
          ),
        );
      }, 800);

      setHoverTimeout(timeout);
    } else if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleDragLeave = () => {
    setDropTarget(null);
    setDropPosition(null);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDropTarget(null);
      setDropPosition(null);
      return;
    }

    // Kiểm tra không thể move folder vào chính nó hoặc vào con của nó
    if (
      dropPosition === 'inside' &&
      isDescendant(draggedItem.id, targetItem.id)
    ) {
      alert('Không thể di chuyển folder vào chính nó hoặc folder con của nó!');
      setDropTarget(null);
      setDropPosition(null);
      setDraggedItem(null);
      return;
    }

    let newParentId;

    if (dropPosition === 'inside') {
      // Thả vào trong folder
      newParentId = targetItem.id;
    } else {
      // Thả trước/sau = cùng cấp với targetItem
      newParentId = targetItem.parent_id;
    }

    // Cập nhật parent_id của item được kéo
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === draggedItem.id ? { ...item, parent_id: newParentId } : item,
      ),
    );

    // Auto-expand folder đích nếu drop vào inside
    if (dropPosition === 'inside' && targetItem.type === 'folder') {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === targetItem.id ? { ...item, expanded: true } : item,
        ),
      );
    }

    setDropTarget(null);
    setDropPosition(null);
    setDraggedItem(null);
  };

  const isDescendant = (parentId, childId) => {
    let current = items.find((item) => item.id === childId);
    while (current && current.parent_id) {
      if (current.parent_id === parentId) return true;
      current = items.find((item) => item.id === current.parent_id);
    }
    return false;
  };

  const toggleExpand = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item,
      ),
    );
  };

  // Level được tính tự động khi render, không cần lưu trong database
  const renderItems = (parentId = null, level = 0) => {
    return items
      .filter((item) => item.parent_id === parentId)
      .map((item) => {
        const hasChildren = items.some((child) => child.parent_id === item.id);
        const isBeingDragged = draggedItem?.id === item.id;
        const isDropZone = dropTarget === item.id;

        // Xác định border style dựa vào position
        let borderClass = 'border-2 border-transparent';
        if (isDropZone) {
          if (dropPosition === 'before') {
            borderClass =
              'border-t-4 border-t-blue-500 border-x-2 border-b-2 border-transparent';
          } else if (dropPosition === 'after') {
            borderClass =
              'border-b-4 border-b-blue-500 border-x-2 border-t-2 border-transparent';
          } else if (dropPosition === 'inside') {
            borderClass = 'border-2 border-blue-400 bg-blue-50';
          }
        }

        return (
          <div key={item.id}>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, item)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item)}
              className={`flex items-center gap-2 py-2 px-3 rounded cursor-move hover:bg-gray-100 transition-colors ${
                isBeingDragged ? 'opacity-50 bg-blue-50' : ''
              } ${borderClass}`}
              style={{ marginLeft: `${level * 24}px` }}
            >
              {item.type === 'folder' && hasChildren && (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded"
                >
                  {item.expanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
              {item.type === 'folder' && !hasChildren && (
                <div className="w-4" />
              )}
              {item.type === 'folder' ? (
                <Folder size={18} className="text-yellow-500" />
              ) : (
                <File size={18} className="text-gray-600" />
              )}
              <span className="text-sm select-none">{item.name}</span>
            </div>
            {item.type === 'folder' &&
              item.expanded &&
              renderItems(item.id, level + 1)}
          </div>
        );
      });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">
          File Explorer - Drag & Drop Demo
        </h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            • <strong>Thả vào giữa folder</strong>: Di chuyển vào trong folder
          </p>
          <p>
            • <strong>Thả vào trên/dưới folder</strong>: Di chuyển cùng cấp với
            folder đó
          </p>
          <p>• Hover 0.8s vào giữa folder đóng để tự động mở</p>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
        {renderItems()}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-sm mb-2">
          📦 Dữ liệu lưu trữ (chỉ cần id + parent_id):
        </h3>
        <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-40">
          {JSON.stringify(
            items.map((item) => ({
              id: item.id,
              name: item.name,
              type: item.type,
              parent_id: item.parent_id,
              // Không cần lưu level - tự tính khi render!
            })),
            null,
            2,
          )}
        </pre>
        <p className="text-xs text-gray-600 mt-2">
          💡 Level được tính tự động khi render. Database chỉ cần lưu: id, name,
          type, parent_id
        </p>
      </div>
    </div>
  );
};

export default FileExplorer;
