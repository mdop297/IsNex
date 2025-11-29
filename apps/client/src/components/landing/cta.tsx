'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, BookOpen } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 sm:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-50"
          style={{ background: 'rgba(var(--gradient-primary), 0.4)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-40"
          style={{ background: 'rgba(var(--gradient-accent), 0.5)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30"
          style={{ background: 'rgba(var(--gradient-secondary), 0.4)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(var(--gradient-primary), 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(var(--gradient-primary), 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-primary/20 p-12 sm:p-16 lg:p-20 text-center"
          style={{
            background: `linear-gradient(135deg, 
              rgba(var(--gradient-primary), 0.15) 0%, 
              rgba(var(--gradient-accent), 0.1) 50%,
              rgba(var(--gradient-secondary), 0.15) 100%)`,
          }}
        >
          <div className="absolute inset-0 -z-10">
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-60 animate-[float_8s_ease-in-out_infinite]"
              style={{ background: 'rgba(var(--gradient-primary), 0.3)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-[80px] opacity-50 animate-[float-reverse_10s_ease-in-out_infinite]"
              style={{ background: 'rgba(var(--gradient-accent), 0.4)' }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-40"
              style={{ background: 'rgba(var(--gradient-secondary), 0.3)' }}
            />
          </div>

          <div className="absolute top-8 left-8 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="absolute top-12 right-12 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center animate-[float-reverse_7s_ease-in-out_infinite]">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div className="absolute bottom-12 left-16 w-11 h-11 rounded-xl bg-secondary/30 flex items-center justify-center animate-[float_8s_ease-in-out_infinite_0.5s]">
            <BookOpen className="w-5 h-5 text-secondary-foreground" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              No credit card required
            </span>
          </div>

          <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-balance bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
            Ready to Learn Smarter?
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
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Stanford', 'MIT', 'Google', 'Microsoft', 'Notion'].map(
                (company) => (
                  <span
                    key={company}
                    className="text-lg font-semibold text-muted-foreground"
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
