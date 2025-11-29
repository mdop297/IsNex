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
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(180deg, transparent, rgba(var(--gradient-primary), 0.05), transparent)`,
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

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
            >
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

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-700 hover:shadow-xl hover:shadow-primary/5 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(idx + 4) * 100}ms` }}
            >
              {/* Quote icon */}
              <Quote
                className="absolute top-4 right-4 h-8 w-8 opacity-10"
                style={{ color: `rgb(var(--gradient-primary))` }}
              />

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
                <img
                  src={testimonial.avatar || '/placeholder.svg'}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-border"
                />
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
