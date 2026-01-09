'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export default function AIUsageMetrics() {
  const usedTokens = 145000;
  const totalTokens = 1000000;
  const usagePercent = (usedTokens / totalTokens) * 100;

  return (
    <Card className="border border-border bg-background rounded-md">
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4" />
          AI Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tokens used (month)</span>
            <span className="font-semibold text-foreground">
              {usedTokens.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-card rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {usagePercent.toFixed(1)}% of {totalTokens.toLocaleString()} tokens
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated cost</span>
            <span className="font-semibold text-foreground">$2.45</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining credits</span>
            <span className="font-semibold text-foreground">$47.55</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
