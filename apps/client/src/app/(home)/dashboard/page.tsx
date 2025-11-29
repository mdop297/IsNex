'use client';

import WorkspaceStats from '@/components/dashboard/WorkspaceStats';
import NotesHighlights from '@/components/dashboard/NotesHighlights';
import AIUsageMetrics from '@/components/dashboard/AIUsageMetrics';
import SuggestedActions from '@/components/dashboard/SuggestedActions';
import RecentDocuments from '@/components/dashboard/RecentDocuments';

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">{currentDate}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <WorkspaceStats />
          <NotesHighlights />
          <AIUsageMetrics />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentDocuments />
          </div>
          <div>
            <SuggestedActions />
          </div>
        </div>
      </div>
    </div>
  );
}
