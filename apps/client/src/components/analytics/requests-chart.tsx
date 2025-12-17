'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { ChartTypeToggle } from './chart-type-toggle';

interface RequestsChartProps {
  data: Array<{ day: string; value: number }>;
  chartType: 'bar' | 'area';
  onChartTypeChange: (type: 'bar' | 'area') => void;
}

export function RequestsChart({
  data,
  chartType,
  onChartTypeChange,
}: RequestsChartProps) {
  return (
    <Card className="p-6 bg-card border-border lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Requests by Day
        </h3>
        <ChartTypeToggle
          chartType={chartType}
          onChartTypeChange={onChartTypeChange}
        />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.269 0 0)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.708 0 0)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.708 0 0)', fontSize: 12 }}
              ticks={[0, 102, 205, 307, 409]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="oklch(0.488 0.243 264.376)" />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="oklch(0.55 0.25 265)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="50%"
                  stopColor="oklch(0.488 0.243 264.376)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.25 0.15 265)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.269 0 0)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.708 0 0)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.708 0 0)', fontSize: 12 }}
              ticks={[0, 102, 205, 307, 409]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="oklch(0.6 0.25 265)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
