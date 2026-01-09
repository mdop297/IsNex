'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { useFolderStore } from '../../../../stores/folder';
import { useCreateFolder } from '../../../../api/folder/useFolders';

const CreateFolder = () => {
  const [folderName, setFolderName] = useState('');

  const {
    isCreatingFolder,
    setIsCreatingFolder,
    currentFolder,
    setCurrentFolder,
  } = useFolderStore();
  const { mutate: createFolder } = useCreateFolder();

  const handleCreateFolder = () => {
    const name = folderName.trim();
    if (!name) return;
    createFolder({ parent_id: currentFolder, name: name });
    setIsCreatingFolder(false);
    setCurrentFolder(null);
    setFolderName('');
  };

  return (
    <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="name-1">Name</Label>
          <Input
            id="name-1"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsCreatingFolder(false);
              setFolderName('');
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} disabled={!folderName.trim()}>
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolder;
