'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, BookOpen } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 sm:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-60 animate-[float_10s_ease-in-out_infinite]"
          style={{ background: 'rgba(var(--gradient-primary), 0.5)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-50 animate-[float-reverse_12s_ease-in-out_infinite]"
          style={{ background: 'rgba(var(--gradient-accent), 0.6)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[180px] opacity-40"
          style={{ background: 'rgba(var(--gradient-secondary), 0.5)' }}
        />
        {/* Grid pattern - enhanced visibility */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(var(--gradient-primary), 0.6) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(var(--gradient-primary), 0.6) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-primary/30 p-12 sm:p-16 lg:p-20 text-center"
          style={{
            background: `linear-gradient(135deg, 
              rgba(var(--gradient-primary), 0.2) 0%, 
              rgba(var(--gradient-accent), 0.15) 50%,
              rgba(var(--gradient-secondary), 0.2) 100%)`,
          }}
        >
          <div className="absolute inset-0 -z-10">
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-70 animate-[float_8s_ease-in-out_infinite]"
              style={{ background: 'rgba(var(--gradient-primary), 0.4)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px] opacity-60 animate-[float-reverse_10s_ease-in-out_infinite]"
              style={{ background: 'rgba(var(--gradient-accent), 0.5)' }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-50"
              style={{ background: 'rgba(var(--gradient-secondary), 0.4)' }}
            />
            {/* Inner glow effect */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(ellipse at center, rgba(var(--gradient-primary), 0.3), transparent 70%)`,
              }}
            />
          </div>

          {/* Floating icons - enhanced visibility */}
          <div
            className="absolute top-8 left-8 w-14 h-14 rounded-xl flex items-center justify-center animate-[float_6s_ease-in-out_infinite]"
            style={{
              background: `linear-gradient(135deg, rgba(var(--gradient-primary), 0.3), rgba(var(--gradient-accent), 0.2))`,
            }}
          >
            <Sparkles
              className="w-7 h-7"
              style={{ color: `rgb(var(--gradient-primary))` }}
            />
          </div>
          <div
            className="absolute top-12 right-12 w-12 h-12 rounded-lg flex items-center justify-center animate-[float-reverse_7s_ease-in-out_infinite]"
            style={{
              background: `linear-gradient(135deg, rgba(var(--gradient-accent), 0.3), rgba(var(--gradient-primary), 0.2))`,
            }}
          >
            <Zap
              className="w-6 h-6"
              style={{ color: `rgb(var(--gradient-accent))` }}
            />
          </div>
          <div
            className="absolute bottom-12 left-16 w-12 h-12 rounded-xl flex items-center justify-center animate-[float_8s_ease-in-out_infinite_0.5s]"
            style={{
              background: `linear-gradient(135deg, rgba(var(--gradient-secondary), 0.4), rgba(var(--gradient-primary), 0.2))`,
            }}
          >
            <BookOpen
              className="w-6 h-6"
              style={{ color: `rgb(var(--gradient-primary))` }}
            />
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{
              background: `linear-gradient(135deg, rgba(var(--gradient-primary), 0.15), rgba(var(--gradient-accent), 0.1))`,
              borderColor: `rgba(var(--gradient-primary), 0.3)`,
            }}
          >
            <Sparkles
              className="w-4 h-4"
              style={{ color: `rgb(var(--gradient-primary))` }}
            />
            <span
              className="text-sm font-medium bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
              }}
            >
              No credit card required
            </span>
          </div>

          <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
            Ready to{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
              }}
            >
              Learn Smarter
            </span>
            ?
          </h2>
          <p className="mb-10 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Join thousands of students and professionals transforming how they
            learn. Start your free workspace today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2 h-14 px-8 text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              Start Your Free Workspace <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base rounded-xl bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              {['Stanford', 'MIT', 'Google', 'Microsoft', 'Notion'].map(
                (company) => (
                  <span
                    key={company}
                    className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {company}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
