'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Save, Zap } from 'lucide-react';

interface SummarizerNotePanelProps {
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  summary: string;
  setSummary: (summary: string) => void;
  summaryType: string;
  setSummaryType: (type: string) => void;
  isLoading: boolean;
  onGenerateSummary: () => void;
  onSaveNote: () => void;
}

export default function SummarizerNotePanel({
  noteTitle,
  setNoteTitle,
  summary,
  setSummary,
  summaryType,
  setSummaryType,
  isLoading,
  onGenerateSummary,
  onSaveNote,
}: SummarizerNotePanelProps) {
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Note Title Input */}
      <div>
        <Label htmlFor="note-title" className="text-sm font-medium mb-2 block">
          Note Title
        </Label>
        <Input
          id="note-title"
          placeholder="Enter note title..."
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Summary Type Selector */}
      <div>
        <Label
          htmlFor="summary-type"
          className="text-sm font-medium mb-2 block"
        >
          Summary Type
        </Label>
        <Select value={summaryType} onValueChange={setSummaryType}>
          <SelectTrigger id="summary-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brief">Brief (1-2 paragraphs)</SelectItem>
            <SelectItem value="detailed">Detailed (full summary)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Editor */}
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden gap-0! rounded-md pb-0! pt-4!">
        <CardHeader>
          <CardTitle className="text-sm">Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-2! min-h-0">
          <Textarea
            placeholder="Your summary will appear here or you can edit it..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="flex-1 resize-none"
          />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={onGenerateSummary}
          disabled={isLoading}
          variant="outline"
          className="flex-1 bg-transparent"
        >
          {isLoading ? (
            <>
              <Spinner className="size-4 mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="size-4 mr-2" />
              Generate
            </>
          )}
        </Button>
        <Button
          onClick={onSaveNote}
          disabled={!noteTitle.trim() || !summary.trim()}
          className="flex-1"
        >
          <Save className="size-4 mr-2" />
          Save Note
        </Button>
      </div>
    </div>
  );
}
