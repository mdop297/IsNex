'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Highlighter } from 'lucide-react';

export default function NotesHighlights() {
  return (
    <Card className="border border-border bg-background rounded-md">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold">
          Notes & Highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-md">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total notes</span>
            </div>
            <span className="text-2xl font-bold text-foreground">18</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-card rounded-md">
            <div className="flex items-center gap-2">
              <Highlighter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total highlights
              </span>
            </div>
            <span className="text-2xl font-bold text-foreground">42</span>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">
            Pending conversion
          </div>
          <div className="flex items-center justify-between p-2 bg-card rounded">
            <span className="text-sm font-medium text-foreground">
              Highlights to notes
            </span>
            <span className="text-sm font-bold text-foreground">7</span>
          </div>
          <Button
            variant="outline"
            className="w-full mt-2 text-xs bg-transparent"
            size="sm"
          >
            Convert Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
