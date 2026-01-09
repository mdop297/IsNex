'use client';

import { Button } from '@/components/ui/button';

interface ChartTypeToggleProps {
  chartType: 'bar' | 'area';
  onChartTypeChange: (type: 'bar' | 'area') => void;
}

export function ChartTypeToggle({
  chartType,
  onChartTypeChange,
}: ChartTypeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
      <Button
        variant={chartType === 'bar' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onChartTypeChange('bar')}
        className="h-7 text-xs"
      >
        Bar
      </Button>
      <Button
        variant={chartType === 'area' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onChartTypeChange('area')}
        className="h-7 text-xs"
      >
        Area
      </Button>
    </div>
  );
}
