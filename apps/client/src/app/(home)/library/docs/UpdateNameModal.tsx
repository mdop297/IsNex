import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import React, { useState, useEffect, useRef } from 'react';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  entityId: string;
  onRename: (id: string, newName: string) => void; // 🔥 key change
  title?: string; // optional UI customization
}
const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  entityId,
  onRename,
  title = 'Rename',
}) => {
  const [newName, setNewName] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, currentName]);

  const handleSave = () => {
    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName === currentName) return onClose();

    onRename(entityId, trimmedName);
    onClose();
  };

  return (
    <div
      className="w-full h-full"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
    >
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2/5">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rename-input" className="text-right">
                New name
              </Label>
              <Input
                id="rename-input"
                ref={inputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!newName.trim()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RenameModal;
