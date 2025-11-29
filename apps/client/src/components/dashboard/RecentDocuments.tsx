'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Calendar } from 'lucide-react';

export default function RecentDocuments() {
  const documents = [
    {
      id: 1,
      name: 'Q4 Financial Report.pdf',
      size: '2.4 MB',
      pages: 45,
      lastAccessed: '2 hours ago',
    },
    {
      id: 2,
      name: 'Project Proposal - 2025.pdf',
      size: '1.8 MB',
      pages: 32,
      lastAccessed: '5 hours ago',
    },
    {
      id: 3,
      name: 'Research Paper - AI.pdf',
      size: '3.1 MB',
      pages: 28,
      lastAccessed: '1 day ago',
    },
    {
      id: 4,
      name: 'Meeting Minutes - Jan 2025.pdf',
      size: '0.9 MB',
      pages: 12,
      lastAccessed: '2 days ago',
    },
  ];

  return (
    <Card className="border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          Recent Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{doc.pages} pages</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {doc.lastAccessed}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
