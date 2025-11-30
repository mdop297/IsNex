'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface SetupInstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export default function SetupInstructionsModal({
  open,
  onOpenChange,
  workspaceId,
}: SetupInstructionsModalProps) {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [role, setRole] = useState('');
  const [tone, setTone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !instructions.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call - replace with real endpoint
      console.log('[v0] Saving instructions:', {
        name,
        instructions,
        role,
        tone,
        workspaceId,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      onOpenChange(false);
      setName('');
      setInstructions('');
      setRole('');
      setTone('');
    } catch (error) {
      console.error('Error saving instructions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Setup System Instructions</DialogTitle>
          <DialogDescription>
            Configure how your AI assistant behaves for workspace {workspaceId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Instruction Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold">
              Instruction Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Customer Support Assistant, Technical Guide"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">
              Give your instructions a descriptive name
            </p>
          </div>

          {/* AI Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="font-semibold">
              AI Role
            </Label>
            <Input
              id="role"
              placeholder="e.g., Expert consultant, Documentation guide, Support specialist"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">
              Define the role or persona of the assistant
            </p>
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label htmlFor="tone" className="font-semibold">
              Tone & Style
            </Label>
            <Input
              id="tone"
              placeholder="e.g., Professional and concise, Friendly and casual, Technical and detailed"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">
              Describe the desired tone and communication style
            </p>
          </div>

          {/* System Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions" className="font-semibold">
              System Instructions <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="instructions"
              placeholder="Enter detailed instructions for the AI assistant. Include guidelines, constraints, and behavior expectations..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-40 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Provide comprehensive instructions that will guide the AI
              assistant behavior
            </p>
          </div>

          {/* Info Alert */}
          <div className="flex gap-2 p-3 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <AlertCircle className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              These instructions will be applied to all conversations in this
              workspace
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Instructions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
