'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';

export default function WorkspaceStats() {
  return (
    <Card className="border border-border rounded-md">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold">Workspace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-secondary rounded-md">
            <span className="text-sm text-muted-foreground">
              Total documents
            </span>
            <span className="text-2xl font-bold text-foreground">24</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-secondary rounded-md">
            <span className="text-sm text-muted-foreground">
              Indexed documents
            </span>
            <span className="text-2xl font-bold text-foreground">22</span>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Last accessed</p>
          <div className="flex items-center justify-between p-2 bg-secondary rounded">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground truncate">
                document-2025.pdf
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-fit p-1">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
