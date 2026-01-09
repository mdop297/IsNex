import { Card } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: 'default' | 'destructive';
}

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
}: StatCardProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon
          className={`h-5 w-5 ${variant === 'destructive' ? 'text-red-400' : 'text-muted-foreground'}`}
        />
      </div>
      <div
        className={`text-3xl font-bold ${
          variant === 'destructive' ? 'text-red-400' : 'text-foreground'
        }`}
      >
        {value}
      </div>
    </Card>
  );
}
