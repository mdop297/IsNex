'use client';

import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Box,
} from 'lucide-react';
import { useState } from 'react';
import { StatCard } from '@/components/analytics/stat-card';
import { RequestsChart } from '@/components/analytics/requests-chart';
import { TokensChart } from '@/components/analytics/tokens-chart';
import { ProviderChart } from '@/components/analytics/provider-chart';
import { SuccessRateChart } from '@/components/analytics/success-rate-chart';

const requestsData = [
  { day: '01-11', value: 312 },
  { day: '02-11', value: 287 },
  { day: '03-11', value: 401 },
  { day: '04-11', value: 356 },
  { day: '05-11', value: 298 },
  { day: '06-11', value: 265 },
  { day: '07-11', value: 442 },

  { day: '08-11', value: 378 },
  { day: '09-11', value: 331 },
  { day: '10-11', value: 295 },
  { day: '11-11', value: 410 },
  { day: '12-11', value: 459 },
  { day: '13-11', value: 382 },
  { day: '14-11', value: 347 },

  { day: '15-11', value: 289 },
  { day: '16-11', value: 254 },
  { day: '17-11', value: 366 },
  { day: '18-11', value: 428 },
  { day: '19-11', value: 402 },
  { day: '20-11', value: 371 },
  { day: '21-11', value: 345 },

  { day: '22-11', value: 318 },
  { day: '23-11', value: 276 },
  { day: '24-11', value: 334 },
  { day: '25-11', value: 412 },
  { day: '26-11', value: 468 },
  { day: '27-11', value: 439 },
  { day: '28-11', value: 390 },
];

const providersData = [
  {
    name: 'Google Gemini',
    tokens: 58.3,
    percentage: 83.4,
    color: 'oklch(0.488 0.243 264.376)',
  },
  {
    name: 'antigravity',
    tokens: 11.6,
    percentage: 16.6,
    color: 'oklch(0.439 0 0)',
  },
  {
    name: 'github-copilot',
    tokens: 2.5,
    percentage: 0.0,
    color: 'oklch(0.556 0 0)',
  },
  {
    name: 'Alibaba Qwen',
    tokens: 0.023,
    percentage: 0.0,
    color: 'oklch(0.488 0.243 264.376)',
  },
];

const providerRequestsData = [
  { name: 'Google Gemini', requests: 856, color: 'hsl(var(--chart-1))' },
  { name: 'OpenAI', requests: 423, color: 'hsl(var(--chart-2))' },
  { name: 'Anthropic', requests: 187, color: 'hsl(var(--chart-3))' },
  { name: 'Cohere', requests: 34, color: 'hsl(var(--chart-4))' },
];

const successRateData = [
  { time: '00:00', rate: 92.5 },
  { time: '04:00', rate: 94.8 },
  { time: '08:00', rate: 91.2 },
  { time: '12:00', rate: 95.6 },
  { time: '16:00', rate: 93.4 },
  { time: '20:00', rate: 96.1 },
  { time: '24:00', rate: 94.2 },
];

export default function AnalyticsPage() {
  const [chartType, setChartType] = useState<'bar' | 'area'>('area');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Home</span>
              <span>/</span>
              <span>Analytics</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Usage Statistics
            </h1>
            <p className="text-muted-foreground">
              Monitor traffic, token usage, and performance across your LLM
              gateways.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              24 Hours
            </Button>
            <Button variant="ghost" size="sm">
              7 Days
            </Button>
            <Button variant="ghost" size="icon" className="ml-2">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Requests" value="1.5K" icon={Loader2} />
          <StatCard title="Success Rate" value="94.2%" icon={CheckCircle2} />
          <StatCard title="Total Tokens" value="69.8M" icon={Box} />
          <StatCard
            title="Failed Requests"
            value="86"
            icon={AlertCircle}
            variant="destructive"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RequestsChart
            data={requestsData}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
          <TokensChart data={providersData} totalTokens={69.8} />
        </div>

        {/* Bottom Section - Requests by Provider & Success Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ProviderChart data={providerRequestsData} />
          <SuccessRateChart data={successRateData} />
        </div>
      </div>
    </div>
  );
}
