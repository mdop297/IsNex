'use client';

import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ModeToggleButton from './ModeToggleButton';

// Types
interface Feature {
  title: string;
  description: string;
  href: string;
}

interface NavLink {
  title: string;
  href: string;
}

interface NavbarProps {
  signUpRoute: string;
  signInRoute: string;
  logoSrc?: string;
  brandName?: string;
  features?: Feature[];
  navLinks?: NavLink[];
}

// Constants
const DEFAULT_FEATURES: Feature[] = [
  {
    title: 'Dashboard',
    description: 'Overview of your activity',
    href: '#',
  },
  {
    title: 'Analytics',
    description: 'Track your performance',
    href: '#',
  },
  {
    title: 'Settings',
    description: 'Configure your preferences',
    href: '#',
  },
  {
    title: 'Integrations',
    description: 'Connect with other tools',
    href: '#',
  },
  {
    title: 'Storage',
    description: 'Manage your files',
    href: '#',
  },
  {
    title: 'Support',
    description: 'Get help when needed',
    href: '#',
  },
];

const DEFAULT_NAV_LINKS: NavLink[] = [
  { title: 'Products', href: '#' },
  { title: 'Resources', href: '#' },
  { title: 'Contact', href: '/' },
];

// Sub-components
const Logo: React.FC<{ src?: string; brandName?: string }> = ({
  src = 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg',
  brandName = 'ISNEX',
}) => {
  const testAuth = async () => {
    const res = await fetch('http://localhost:8000/auth/api');
    const data = await res.text();
    console.log(data); // "Hello World!"
  };

  return (
    <Link href="/" className="flex items-center gap-2" onClick={testAuth}>
      <Image
        src={src}
        alt={`${brandName} logo`}
        width={32}
        height={32}
        className="max-h-8 w-auto"
        priority
      />
      <span className="text-lg font-semibold tracking-tighter">
        {brandName}
      </span>
    </Link>
  );
};
const FeatureGrid: React.FC<{ features: Feature[] }> = ({ features }) => (
  <div className="grid w-[600px] grid-cols-2 gap-1 p-3">
    {features.map((feature) => (
      <NavigationMenuLink
        href={feature.href}
        key={feature.title}
        className="block rounded-md p-3 transition-colors hover:bg-muted/70"
      >
        <div>
          <p className="mb-1 font-semibold text-foreground">{feature.title}</p>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      </NavigationMenuLink>
    ))}
  </div>
);

const AuthButtons: React.FC<{
  signInRoute: string;
  signUpRoute: string;
  variant?: 'desktop' | 'mobile';
}> = ({ signInRoute, signUpRoute, variant = 'desktop' }) => {
  const containerClass =
    variant === 'desktop'
      ? 'hidden items-center gap-4 lg:flex'
      : 'flex flex-col gap-4';

  return (
    <div className={containerClass}>
      <Button
        variant="outline"
        asChild
        className="hover:border-blue-500 hover:text-blue-500"
      >
        <Link href={signInRoute}>Sign in</Link>
      </Button>
      <Button asChild>
        <Link href={signUpRoute}>Start for free</Link>
      </Button>
    </div>
  );
};

const MobileNavLinks: React.FC<{ navLinks: NavLink[] }> = ({ navLinks }) => (
  <div className="flex flex-col gap-6">
    {navLinks.map((link) => (
      <Link
        key={link.title}
        href={link.href}
        className="font-medium hover:text-primary transition-colors"
      >
        {link.title}
      </Link>
    ))}
  </div>
);

// Main component
const Navbar: React.FC<NavbarProps> = ({
  signUpRoute,
  signInRoute,
  logoSrc,
  brandName,
  features = DEFAULT_FEATURES,
  navLinks = DEFAULT_NAV_LINKS,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md py-3 dark:bg-black/70">
      <div className="container mx-auto w-5/6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Logo src={logoSrc} brandName={brandName} />

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <FeatureGrid features={features} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              {navLinks.map((link) => (
                <NavigationMenuItem key={link.title}>
                  <NavigationMenuLink
                    href={link.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <ModeToggleButton />
            <AuthButtons
              signInRoute={signInRoute}
              signUpRoute={signUpRoute}
              variant="desktop"
            />
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <div className="flex items-center gap-4 lg:hidden">
              <ModeToggleButton />
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </div>

            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <Logo src={logoSrc} brandName={brandName} />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mb-2 mt-4">
                  <AccordionItem value="features" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-1 md:grid-cols-2">
                        {features.map((feature) => (
                          <Link
                            href={feature.href}
                            key={feature.title}
                            className="block rounded-md p-3 transition-colors hover:bg-muted/70"
                          >
                            <div>
                              <p className="mb-1 font-semibold text-foreground">
                                {feature.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <MobileNavLinks navLinks={navLinks} />

                <div className="mt-6">
                  <AuthButtons
                    signInRoute={signInRoute}
                    signUpRoute={signUpRoute}
                    variant="mobile"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export { Navbar };
export type { NavbarProps, Feature, NavLink };
