'use client';

import { FileText, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Highlight & Mark',
    description:
      'Upload documents and highlight key sections. AI understands context automatically.',
    gradient: 'from-indigo-500 to-purple-500',
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-500 dark:text-indigo-400',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Get AI Summaries',
    description:
      'AI generates concise summaries. Understand key concepts in minutes, not hours.',
    gradient: 'from-teal-500 to-cyan-500',
    iconBg: 'bg-teal-500/20',
    iconColor: 'text-teal-500 dark:text-teal-400',
  },
  {
    number: '03',
    icon: BookOpen,
    title: 'Create Notes',
    description:
      'Organize highlights into structured notes. Search semantically across your knowledge.',
    gradient: 'from-violet-500 to-pink-500',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-500 dark:text-violet-400',
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="relative py-24 sm:py-32 px-4 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 20%, rgba(var(--gradient-primary), 0.15), transparent 50%),
              radial-gradient(ellipse 60% 50% at 80% 80%, rgba(var(--gradient-accent), 0.12), transparent 50%)
            `,
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--gradient-primary), 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--gradient-primary), 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-4 py-1.5">
            <span className="text-sm font-medium text-muted-foreground">
              How It Works
            </span>
          </div>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-balance text-foreground">
            Your Learning{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
              }}
            >
              Workflow
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple three-step process to transform how you learn and retain
            knowledge.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 -translate-y-1/2 bg-gradient-to-r from-indigo-500/30 via-teal-500/30 to-violet-500/30" />

          <div className="grid gap-8 lg:gap-12 lg:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Card */}
                <div className="relative h-full rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-primary/5">
                  {/* Gradient accent top */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${step.gradient}`}
                  />

                  {/* Step number */}
                  <div className="absolute -top-4 right-6">
                    <span
                      className="text-5xl font-bold bg-clip-text text-transparent opacity-30"
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-secondary)))`,
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl ${step.iconBg}`}
                  >
                    <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Preview placeholder */}
                  <div className="mt-6 h-32 rounded-xl bg-muted/50 border border-border/30 flex items-center justify-center overflow-hidden">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
                      <step.icon className="w-8 h-8" />
                      <span className="text-xs">Preview</span>
                    </div>
                  </div>
                </div>

                {/* Arrow for mobile/tablet */}
                {idx < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/40 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
