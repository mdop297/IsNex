'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 150% 120% at 50% -20%, rgba(var(--gradient-primary), 0.8), transparent 60%),
              radial-gradient(ellipse 120% 100% at 110% 40%, rgba(var(--gradient-accent), 0.7), transparent 50%),
              radial-gradient(ellipse 100% 100% at -10% 80%, rgba(var(--gradient-secondary), 0.7), transparent 50%)
            `,
          }}
        />

        <div
          className="absolute -top-20 right-1/4 w-[1000px] h-[1000px] rounded-full blur-[180px]"
          style={{
            background: `rgba(var(--gradient-primary), 0.85)`,
            animation: 'float 8s ease-in-out infinite',
          }}
        />

        <div
          className="absolute -bottom-40 left-1/4 w-[1100px] h-[1100px] rounded-full blur-[200px]"
          style={{
            background: `rgba(var(--gradient-accent), 0.8)`,
            animation: 'float-reverse 10s ease-in-out infinite',
          }}
        />

        <div
          className="absolute top-1/4 -left-40 w-[900px] h-[900px] rounded-full blur-[160px]"
          style={{
            background: `rgba(var(--gradient-secondary), 0.8)`,
            animation: 'float 12s ease-in-out infinite 2s',
          }}
        />

        <div
          className="absolute bottom-1/3 -right-10 w-[800px] h-[800px] rounded-full blur-[150px]"
          style={{
            background: `rgba(var(--gradient-primary), 0.75)`,
            animation: 'pulse-glow 6s ease-in-out infinite',
          }}
        />

        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px]"
          style={{
            background: `linear-gradient(135deg, rgba(var(--gradient-primary), 0.6), rgba(var(--gradient-accent), 0.6))`,
            animation: 'pulse-glow 8s ease-in-out infinite 1s',
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.5] dark:opacity-[0.25]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--gradient-primary), 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--gradient-primary), 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-50 dark:opacity-30"
          style={{
            backgroundImage: `radial-gradient(rgba(var(--gradient-primary), 0.6) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Content - Reduced padding by ~30% */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 sm:pt-20 sm:pb-16 lg:pt-28 lg:pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-md px-4 py-2 shadow-lg">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              AI-Powered Knowledge Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance text-foreground">
            Learn Smarter,{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)), rgb(var(--gradient-secondary)))`,
              }}
            >
              Organize Better
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Highlight documents, create intelligent notes, and get AI-powered
            summaries. IsNex transforms how you learn and retain information.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-14">
            <Button
              size="lg"
              className="gap-2 text-base px-8 py-6 shadow-lg shadow-primary/25"
            >
              Start Free Workspace <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 text-base px-8 py-6 bg-card/60 backdrop-blur-sm"
            >
              <Play className="h-4 w-4" /> Watch Demo
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-6xl">
          <div
            className="absolute -inset-8 sm:-inset-12 lg:-inset-16 rounded-[2rem] blur-[60px] opacity-90"
            style={{
              background: `linear-gradient(135deg, rgba(var(--gradient-primary), 0.7), rgba(var(--gradient-accent), 0.6), rgba(var(--gradient-secondary), 0.6))`,
            }}
          />
          <div
            className="absolute -inset-6 sm:-inset-10 lg:-inset-14 rounded-[2rem] blur-[40px] opacity-80"
            style={{
              background: `linear-gradient(45deg, rgba(var(--gradient-accent), 0.6), rgba(var(--gradient-primary), 0.5))`,
            }}
          />

          {/* Browser mockup frame */}
          <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl border border-border/50 bg-card/90 backdrop-blur-md overflow-hidden shadow-2xl">
            {/* Browser header */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1 sm:gap-1.5">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400/80" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400/80" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 mx-2 sm:mx-4">
                <div className="max-w-xs sm:max-w-md mx-auto h-5 sm:h-6 rounded-md bg-muted/50 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    app.isnex.ai/workspace
                  </span>
                </div>
              </div>
            </div>

            {/* Responsive placeholder image with aspect ratio containers */}
            <div className="relative w-full">
              <img
                src="/modern-ai-document-workspace-dashboard-with-sideba.jpg"
                alt="IsNex Dashboard Preview"
                className="w-full h-auto object-cover aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/8]"
              />
            </div>
          </div>

          {/* Floating feature badges - responsive positioning */}
          <div
            className="hidden md:flex absolute -left-2 lg:-left-6 xl:-left-10 top-1/4 items-center gap-2 rounded-full border border-border/50 bg-card/95 backdrop-blur-md px-3 lg:px-4 py-1.5 lg:py-2 shadow-lg"
            style={{ animation: 'float 6s ease-in-out infinite 1s' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs lg:text-sm font-medium text-foreground whitespace-nowrap">
              AI Summarizing
            </span>
          </div>

          <div
            className="hidden md:flex absolute -right-2 lg:-right-6 xl:-right-10 top-1/3 items-center gap-2 rounded-full border border-border/50 bg-card/95 backdrop-blur-md px-3 lg:px-4 py-1.5 lg:py-2 shadow-lg"
            style={{ animation: 'float-reverse 7s ease-in-out infinite 0.5s' }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: `rgb(var(--gradient-primary))` }}
            />
            <span className="text-xs lg:text-sm font-medium text-foreground whitespace-nowrap">
              Smart Notes
            </span>
          </div>

          <div
            className="hidden lg:flex absolute -right-4 xl:-right-12 bottom-1/4 items-center gap-2 rounded-full border border-border/50 bg-card/95 backdrop-blur-md px-3 lg:px-4 py-1.5 lg:py-2 shadow-lg"
            style={{ animation: 'float 8s ease-in-out infinite 2s' }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: `rgb(var(--gradient-accent))` }}
            />
            <span className="text-xs lg:text-sm font-medium text-foreground whitespace-nowrap">
              Semantic Search
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
