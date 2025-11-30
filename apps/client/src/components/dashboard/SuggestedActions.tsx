'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, FileText, Highlighter } from 'lucide-react';

export default function SuggestedActions() {
  const actions = [
    {
      id: 1,
      title: 'Continue reading',
      description: 'Resume "Project Proposal"',
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      id: 2,
      title: 'Review notes',
      description: 'Check recent highlights',
      icon: BookOpen,
      color: 'text-green-500',
    },
    {
      id: 3,
      title: 'Convert highlights',
      description: '7 pending conversions',
      icon: Highlighter,
      color: 'text-yellow-500',
    },
  ];

  return (
    <Card className="border border-border h-full rounded-md">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold">
          Suggested Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              className="w-full justify-start h-auto p-3 flex flex-col items-start gap-1 hover:bg-secondary transition-colors bg-transparent"
            >
              <div className="flex items-center gap-2 w-full">
                <Icon className={`w-4 h-4 ${action.color} shrink-0`} />
                <span className="text-sm font-medium text-foreground flex-1 text-left">
                  {action.title}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
              <span className="text-xs text-muted-foreground text-left ml-6">
                {action.description}
              </span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
