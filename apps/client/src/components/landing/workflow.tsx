'use client';

import { FileText, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import Image from 'next/image';

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
      className="relative py-16 sm:py-24 px-4 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        {/* Base gradient - similar to hero style */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(var(--gradient-secondary), 0.1) 0%,
                rgba(var(--gradient-primary), 0.15) 30%,
                rgba(var(--gradient-accent), 0.12) 70%,
                rgba(var(--gradient-secondary), 0.08) 100%
              )
            `,
          }}
        />

        {/* Large animated gradient orbs - hero style but lighter opacity */}
        <div
          className="absolute -top-60 -right-40 w-[900px] h-[900px] rounded-full blur-[200px] opacity-45 animate-[float_22s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(180deg, rgba(var(--gradient-primary), 0.6), rgba(var(--gradient-accent), 0.3))`,
          }}
        />
        <div
          className="absolute -bottom-60 -left-40 w-[800px] h-[800px] rounded-full blur-[180px] opacity-40 animate-[float-reverse_20s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(135deg, rgba(var(--gradient-secondary), 0.6), rgba(var(--gradient-primary), 0.4))`,
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] opacity-35 animate-[pulse-glow_15s_ease-in-out_infinite]"
          style={{ background: `rgba(var(--gradient-accent), 0.5)` }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 animate-[float_18s_ease-in-out_infinite_reverse]"
          style={{ background: `rgba(var(--gradient-primary), 0.4)` }}
        />

        {/* Grid pattern - similar to hero */}
        <div
          className="absolute inset-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--gradient-primary), 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--gradient-primary), 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-35 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(rgba(var(--gradient-accent), 0.35) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Radial spotlight in center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(var(--gradient-accent), 0.15), transparent 60%)`,
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
                  <div className="mt-6 h-32 w-full rounded-xl border border-border/30 overflow-hidden">
                    <Image
                      src="/placeholder.svg"
                      width={100}
                      height={50}
                      alt="Step preview"
                      className="w-full h-full object-cover"
                    />
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
