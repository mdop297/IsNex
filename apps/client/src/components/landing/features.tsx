'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Highlighter,
  BookOpen,
  Zap,
  Lock,
  FileText,
  Search,
} from 'lucide-react';

const features = [
  {
    icon: Highlighter,
    title: 'Smart Highlighting',
    description:
      'Mark important sections in PDFs and documents. AI extracts context automatically.',
    gradient: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/25',
  },
  {
    icon: BookOpen,
    title: 'Intelligent Notes',
    description:
      'Convert highlights into structured notes. AI-generated summaries included.',
    gradient: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/25',
  },
  {
    icon: Zap,
    title: 'AI Summaries',
    description:
      'Get concise summaries of any document. Perfect for quick reviews.',
    gradient: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/25',
  },
  {
    icon: Search,
    title: 'Semantic Search',
    description:
      'Find information using AI. Search by meaning, not just keywords.',
    gradient: 'from-green-500 to-emerald-500',
    shadowColor: 'shadow-green-500/25',
  },
  {
    icon: Lock,
    title: 'Workspace Privacy',
    description:
      'Keep your knowledge private. Customize AI behavior per workspace.',
    gradient: 'from-red-500 to-rose-500',
    shadowColor: 'shadow-red-500/25',
  },
  {
    icon: FileText,
    title: 'Multi-Source',
    description:
      'Work with PDFs, web content, and documents. All in one place.',
    gradient: 'from-cyan-500 to-teal-500',
    shadowColor: 'shadow-cyan-500/25',
  },
];

export default function Features() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems((prev) =>
              prev.includes(index) ? prev : [...prev, index],
            );
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' },
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      className="relative py-24 sm:py-32 px-4 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30"
          style={{ background: `rgba(var(--gradient-primary), 0.5)` }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25"
          style={{ background: `rgba(var(--gradient-accent), 0.5)` }}
        />
      </div>

      <div ref={sectionRef} className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-4 py-1.5 mb-6">
            <span
              className="text-xs font-semibold uppercase tracking-wider bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
              }}
            >
              Features
            </span>
          </div>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Everything you need to{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
              }}
            >
              master information
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for students, researchers, and
            professionals who want to learn more effectively.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isVisible = visibleItems.includes(idx);
            return (
              <div
                key={idx}
                data-index={idx}
                className={`group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-xl ${feature.shadowColor} ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Gradient border on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background: `linear-gradient(135deg, rgba(var(--gradient-primary), 0.1), rgba(var(--gradient-accent), 0.1))`,
                  }}
                />

                {/* Icon with gradient background */}
                <div
                  className={`mb-4 p-3 rounded-xl w-fit bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadowColor}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover arrow */}
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
