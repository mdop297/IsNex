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
import { useUpdateDocuments } from './useUpdateDocuments';

interface UpdateNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  documentId: string;
}

const UpdateNameModal: React.FC<UpdateNameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  documentId,
}) => {
  const [newName, setNewName] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useUpdateDocuments();

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

    mutate(
      { id: documentId, data: { name: trimmedName } },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-2/5"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Rename your document</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="document-name" className="text-right">
              New name
            </Label>
            <Input
              id="document-name"
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isPending && handleSave()}
              disabled={isPending}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || !newName.trim()}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNameModal;
