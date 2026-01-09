import { Card } from '@/components/ui/card';

interface ProviderData {
  name: string;
  tokens: number;
  percentage: number;
  color: string;
}

interface TokensChartProps {
  data: ProviderData[];
  totalTokens: number;
}

export function TokensChart({ data, totalTokens }: TokensChartProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Tokens by Provider
      </h3>
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="oklch(0.269 0 0)"
              strokeWidth="32"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="oklch(0.488 0.243 264.376)"
              strokeWidth="32"
              strokeDasharray={`${(data[0].percentage / 100) * 502.4} 502.4`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-foreground">
              {totalTokens}M
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((provider, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: provider.color }}
              />
              <span className="text-sm text-foreground">{provider.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">
                {provider.tokens >= 1 ? `${provider.tokens}M` : provider.tokens}
              </span>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {provider.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
