'use client';

import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ModeToggleButton from './mode-toggle-button';
import { routes } from '@/lib/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-border bg-background/80 backdrop-blur-xl shadow-lg'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#hero" className="flex items-center gap-2 group">
          <div
            className="relative flex h-9 w-9 items-center justify-center rounded-xl font-bold text-white overflow-hidden shadow-lg"
            style={{
              background: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
            }}
          >
            <Sparkles className="h-5 w-5" />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, rgb(var(--gradient-accent)), rgb(var(--gradient-secondary)))`,
              }}
            />
          </div>
          <span className="text-xl font-bold">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {['Features', 'Workflows', 'Pricing'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '')}`}
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              {item}
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-1/2 transition-all duration-300"
                style={{
                  background: `linear-gradient(90deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                }}
              />
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ModeToggleButton />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href={routes.SIGNIN}>Sign In</Link>
          </Button>
          <Button
            size="sm"
            className="hidden sm:inline-flex text-white border-0 shadow-lg shadow-primary/25"
            style={{
              background: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
            }}
          >
            <Link href={routes.SIGNUP}>Start for free</Link>
          </Button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="flex flex-col gap-2 px-4 py-4">
            {['Features', 'How it Works', 'Pricing'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '')}`}
                className="px-4 py-2 text-sm font-medium hover:text-primary rounded-lg hover:bg-muted transition-colors"
              >
                {item}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="flex-1 text-white border-0"
                style={{
                  background: `linear-gradient(135deg, rgb(var(--gradient-primary)), rgb(var(--gradient-accent)))`,
                }}
              >
                Start for free
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
