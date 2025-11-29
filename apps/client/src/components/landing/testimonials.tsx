'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'PhD Researcher',
    avatar: '/asian-woman-professional-headshot.png',
    content:
      'IsNex transformed how I review papers. The AI summaries save me hours every week, and the semantic search is incredibly accurate.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Law Student',
    avatar: '/professional-black-man.png',
    content:
      "The highlighting and note-taking features are exactly what I needed for case studies. It's like having a smart assistant for my studies.",
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    avatar: '/latina-professional-headshot.png',
    content:
      'I use IsNex to organize research for product decisions. The workspace feature keeps everything organized and accessible.',
    rating: 5,
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Documents Processed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
];

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 overflow-hidden"
    >
      {/* Outer gradient border - top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(var(--gradient-primary), 0.6), rgba(var(--gradient-accent), 0.6), rgba(var(--gradient-primary), 0.6), transparent)`,
        }}
      />
      {/* Outer gradient border - bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(var(--gradient-accent), 0.6), rgba(var(--gradient-primary), 0.6), rgba(var(--gradient-accent), 0.6), transparent)`,
        }}
      />
      {/* Outer gradient border - left */}
      <div
        className="absolute top-0 bottom-0 left-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent, rgba(var(--gradient-primary), 0.5), rgba(var(--gradient-accent), 0.5), rgba(var(--gradient-primary), 0.5), transparent)`,
        }}
      />
      {/* Outer gradient border - right */}
      <div
        className="absolute top-0 bottom-0 right-0 w-px"
        style={{
          background: `linear-gradient(180deg, transparent, rgba(var(--gradient-accent), 0.5), rgba(var(--gradient-primary), 0.5), rgba(var(--gradient-accent), 0.5), transparent)`,
        }}
      />

      {/* Corner glow effects */}
      <div
        className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-40"
        style={{ background: `rgba(var(--gradient-primary), 0.4)` }}
      />
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-40"
        style={{ background: `rgba(var(--gradient-accent), 0.4)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-40"
        style={{ background: `rgba(var(--gradient-accent), 0.4)` }}
      />
      <div
        className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-40"
        style={{ background: `rgba(var(--gradient-primary), 0.4)` }}
      />

      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(var(--gradient-accent), 0.06) 0%,
              rgba(var(--gradient-primary), 0.12) 50%,
              rgba(var(--gradient-accent), 0.06) 100%)`,
          }}
        />

        {/* Animated gradient orbs */}
        <div
          className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full blur-[150px] opacity-45 animate-[float_12s_ease-in-out_infinite]"
          style={{ background: `rgba(var(--gradient-primary), 0.35)` }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 animate-[float-reverse_14s_ease-in-out_infinite]"
          style={{ background: `rgba(var(--gradient-accent), 0.4)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[180px] opacity-30"
          style={{ background: `rgba(var(--gradient-secondary), 0.4)` }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-15"
          style={{
            backgroundImage: `linear-gradient(rgba(var(--gradient-primary), 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(var(--gradient-primary), 0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-4 py-1.5 mb-6">
            <span
              className="text-xs font-semibold uppercase tracking-wider bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
              }}
            >
              Testimonials
            </span>
          </div>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Loved by{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
              }}
            >
              learners worldwide
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students, researchers, and professionals who use
            IsNex daily.
          </p>
        </div>

        {/* Stats - Enhanced stat cards with gradient borders */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative group text-center p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
            >
              {/* Hover glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
                style={{ background: `rgba(var(--gradient-primary), 0.15)` }}
              />
              <div
                className="text-3xl sm:text-4xl font-bold mb-1 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid - Enhanced cards with gradient accents */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`relative group p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-700 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(idx + 4) * 100}ms` }}
            >
              {/* Gradient accent on top */}
              <div
                className="absolute top-0 left-6 right-6 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(var(--gradient-primary), 0.5), rgba(var(--gradient-accent), 0.5), transparent)`,
                }}
              />

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-2xl"
                style={{ background: `rgba(var(--gradient-primary), 0.1)` }}
              />

              {/* Quote icon */}
              <div
                className="absolute top-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `rgba(var(--gradient-primary), 0.1)` }}
              >
                <Quote
                  className="h-5 w-5"
                  style={{ color: `rgba(var(--gradient-primary), 0.5)` }}
                />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="absolute -inset-0.5 rounded-full opacity-50"
                    style={{
                      background: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                    }}
                  />
                  <img
                    src={testimonial.avatar || '/placeholder.svg'}
                    alt={testimonial.name}
                    className="relative w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
