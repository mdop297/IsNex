'use client';

import Link from 'next/link';
import { Mail, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full blur-[150px] opacity-20"
          style={{ background: `rgba(var(--gradient-primary), 0.5)` }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full blur-[120px] opacity-15"
          style={{ background: `rgba(var(--gradient-accent), 0.5)` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {/* Top section with logo and newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                }}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">
                Is
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                  }}
                >
                  Nex
                </span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6">
              AI-powered learning and knowledge management platform. Transform
              how you learn, organize, and retain information.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Github, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Mail, href: '#' },
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="p-2 rounded-lg border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">
            {/* Product */}
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Product</h4>
              <ul className="space-y-3 text-sm">
                {['Features', 'Pricing', 'Changelog', 'Roadmap', 'API'].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                      >
                        {item}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Company</h4>
              <ul className="space-y-3 text-sm">
                {['About', 'Blog', 'Careers', 'Contact', 'Press'].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                      >
                        {item}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
              <ul className="space-y-3 text-sm">
                {['Privacy', 'Terms', 'Security', 'Cookies', 'GDPR'].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                      >
                        {item}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider with gradient */}
        <div
          className="h-px w-full mb-8"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(var(--gradient-primary), 0.3), rgba(var(--gradient-accent), 0.3), transparent)`,
          }}
        />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 IsNex. All rights reserved. Made with{' '}
            <span className="text-red-500">♥</span> for learners.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Status
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Support
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
