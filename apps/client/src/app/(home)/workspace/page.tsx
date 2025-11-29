'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, ArrowRight, FileText, MessageSquare } from 'lucide-react';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  documentsCount: number;
  conversationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch workspaces data
    fetch('api/workspaces')
      .then((res) => res.json())
      .then((data) => {
        setWorkspaces(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching workspaces:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading workspaces...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Workspaces</h1>
          <p className="text-muted-foreground">
            Manage and organize your content workspaces
          </p>
        </div>

        {/* Create New Button */}
        <div className="mb-8">
          <Button className="gap-2">
            <Plus className="size-4" />
            Create New Workspace
          </Button>
        </div>

        {/* Workspaces Grid */}
        {workspaces.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No workspaces yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first workspace to get started
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={`/workspace/${workspace.id}/overview`}
                className="group"
              >
                <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
                  <div className="p-4">
                    {/* Workspace Header */}
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {workspace.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {workspace.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 mb-4 py-3 border-t border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-semibold text-foreground">
                            {workspace.documentsCount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {workspace.documentsCount === 1
                              ? 'Document'
                              : 'Documents'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="size-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-semibold text-foreground">
                            {workspace.conversationsCount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {workspace.conversationsCount === 1
                              ? 'Chat'
                              : 'Chats'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-muted-foreground">
                        Updated{' '}
                        {new Date(workspace.updatedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                          },
                        )}
                      </p>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
