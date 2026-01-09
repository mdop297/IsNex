'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface SuccessRateData {
  time: string;
  rate: number;
}

interface SuccessRateChartProps {
  data: SuccessRateData[];
}

const chartConfig = {
  rate: {
    label: 'Success Rate',
    color: 'hsl(var(--chart-2))',
  },
};

export function SuccessRateChart({ data }: SuccessRateChartProps) {
  return (
    <Card className="bg-card border-border lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Request Success Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <defs>
              <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="50%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={false}
              fill="url(#successGradient)"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
