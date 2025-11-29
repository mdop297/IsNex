'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  TrendingUp,
  MessageSquare,
  Copy,
  Download,
} from 'lucide-react';

interface SummaryData {
  title: string;
  totalItems: number;
  timeRange: string;
  keyPoints: string[];
  statistics: {
    label: string;
    value: string | number;
    trend?: number;
  }[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topics: string[];
  summary: string;
}

export default function SummarizerPanel({ data }: { data: SummaryData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full gap-4 overflow-y-auto p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-5 text-primary" />
            <h2 className="text-2xl font-bold">Summary</h2>
          </div>
          <p className="text-sm text-muted-foreground">{data.timeRange}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="size-4" />
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground mb-1">Total Items</p>
              <p className="text-2xl font-bold">{data.totalItems}</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground mb-1">Key Points</p>
              <p className="text-2xl font-bold">{data.keyPoints.length}</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-xs text-muted-foreground mb-1">Topics</p>
              <p className="text-2xl font-bold">{data.topics.length}</p>
            </div>
          </div>

          {/* Main Summary Text */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm leading-relaxed text-foreground">
              {data.summary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="keypoints" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-secondary">
          <TabsTrigger value="keypoints" className="text-xs">
            Key Points
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">
            Insights
          </TabsTrigger>
          <TabsTrigger value="topics" className="text-xs">
            Topics
          </TabsTrigger>
        </TabsList>

        {/* Key Points Tab */}
        <TabsContent value="keypoints" className="flex-1 space-y-2 mt-4">
          {data.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex gap-3 rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors"
            >
              <div className="shrink-0 rounded-full bg-primary/20 w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {idx + 1}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="flex-1 space-y-3 mt-4">
          {/* Statistics */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Statistics</h3>
            {data.statistics.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{stat.value}</span>
                  {stat.trend !== undefined && (
                    <Badge
                      variant={stat.trend > 0 ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      <TrendingUp className="size-3 mr-1" />
                      {stat.trend > 0 ? '+' : ''}
                      {stat.trend}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sentiment Analysis */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Sentiment</h3>
            <div className="rounded-lg border border-border p-3 space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Positive</span>
                  <span className="font-semibold">
                    {data.sentiment.positive}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${data.sentiment.positive}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Neutral</span>
                  <span className="font-semibold">
                    {data.sentiment.neutral}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gray-500 h-2 rounded-full"
                    style={{ width: `${data.sentiment.neutral}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Negative</span>
                  <span className="font-semibold">
                    {data.sentiment.negative}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${data.sentiment.negative}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Topics Tab */}
        <TabsContent value="topics" className="flex-1 mt-4">
          <div className="flex flex-wrap gap-2">
            {data.topics.map((topic, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-3 mr-1.5" />
                {topic}
              </Badge>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
