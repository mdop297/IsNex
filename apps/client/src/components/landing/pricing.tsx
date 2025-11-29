'use client';

import { Button } from '@/components/ui/button';
import { Check, Sparkles, Building2, User } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    icon: User,
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '1 Workspace',
      '100 Documents',
      'Basic Highlighting',
      'AI Summaries (Limited)',
      'Email Support',
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    icon: Sparkles,
    price: '$9',
    period: '/month',
    description: 'For serious learners',
    features: [
      'Unlimited Workspaces',
      'Unlimited Documents',
      'Advanced AI Features',
      'Semantic Search',
      'Priority Support',
      'Custom Instructions',
      'Team Collaboration',
    ],
    highlighted: true,
    buttonText: 'Start Pro Trial',
    buttonVariant: 'default' as const,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    description: 'For organizations',
    features: [
      'Everything in Pro',
      'Admin Dashboard',
      'User Management',
      'Advanced Analytics',
      'SSO & Security',
      'Dedicated Support',
      'Custom Integrations',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 sm:py-32 px-4 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-muted/20" />

        {/* Animated gradient orbs - increased opacity and size */}
        <div
          className="absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full blur-[150px] opacity-40 animate-[float_15s_ease-in-out_infinite]"
          style={{ background: `rgba(var(--gradient-primary), 0.35)` }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-35 animate-[float-reverse_12s_ease-in-out_infinite]"
          style={{ background: `rgba(var(--gradient-accent), 0.4)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[180px] opacity-25"
          style={{ background: `rgba(var(--gradient-secondary), 0.35)` }}
        />

        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 30% 100%, rgba(var(--gradient-primary), 0.15), transparent 60%),
              radial-gradient(ellipse 60% 50% at 70% 0%, rgba(var(--gradient-accent), 0.12), transparent 50%)
            `,
          }}
        />

        {/* Dot pattern - increased visibility */}
        <div
          className="absolute inset-0 opacity-50 dark:opacity-25"
          style={{
            backgroundImage: `radial-gradient(rgba(var(--gradient-primary), 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl relative">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm px-4 py-1.5">
            <span
              className="text-sm font-medium bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
              }}
            >
              Pricing Plans
            </span>
          </div>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-balance text-foreground">
            Simple,{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
              }}
            >
              Transparent
            </span>{' '}
            Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works for you. Upgrade or downgrade at any
            time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:gap-6 md:grid-cols-3 items-start">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl transition-all duration-300 ${
                plan.highlighted ? 'md:-mt-4 md:mb-4' : ''
              }`}
            >
              {plan.highlighted && (
                <>
                  <div
                    className="absolute -inset-1 rounded-2xl blur-xl opacity-60"
                    style={{
                      background: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                    }}
                  />
                  <div
                    className="absolute -inset-0.5 rounded-2xl opacity-80"
                    style={{
                      background: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                    }}
                  />
                </>
              )}

              <div
                className={`relative flex flex-col h-full rounded-2xl border bg-card/95 backdrop-blur-sm p-8 ${
                  plan.highlighted
                    ? 'border-transparent shadow-2xl'
                    : 'border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10'
                }`}
              >
                {!plan.highlighted && (
                  <div
                    className="absolute top-0 left-8 right-8 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(var(--gradient-primary), 0.4), rgba(var(--gradient-accent), 0.4), transparent)`,
                    }}
                  />
                )}

                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan icon & name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl`}
                    style={{
                      background: plan.highlighted
                        ? `linear-gradient(135deg, rgba(var(--gradient-primary), 0.2), rgba(var(--gradient-accent), 0.2))`
                        : `rgba(var(--gradient-primary), 0.1)`,
                    }}
                  >
                    <plan.icon
                      className="w-5 h-5"
                      style={{
                        color: plan.highlighted
                          ? `rgb(var(--gradient-primary))`
                          : `rgba(var(--gradient-primary), 0.7)`,
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className={`text-4xl font-bold ${plan.highlighted ? 'bg-clip-text text-transparent' : 'text-foreground'}`}
                    style={
                      plan.highlighted
                        ? {
                            backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                          }
                        : {}
                    }
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full mb-8 ${plan.highlighted ? 'shadow-lg shadow-primary/25' : ''}`}
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  {plan.buttonText}
                </Button>

                {/* Features */}
                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: plan.highlighted
                            ? `linear-gradient(135deg, rgba(var(--gradient-primary), 0.2), rgba(var(--gradient-accent), 0.2))`
                            : `rgba(var(--gradient-primary), 0.1)`,
                        }}
                      >
                        <Check
                          className="w-3 h-3"
                          style={{ color: `rgb(var(--gradient-primary))` }}
                        />
                      </div>
                      <span className="text-sm text-foreground/80">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
