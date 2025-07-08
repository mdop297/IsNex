'use client';

import {
  BarChart,
  Database,
  Layers,
  PieChart,
  SquareKanban,
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { BorderBeam } from '@/components/magicui/border-beam';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface Tab {
  title: string;
  icon: React.ReactNode;
  image: string;
}

export interface HeroProps {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  primaryButtonUrl: string;
  secondaryButtonUrl?: string;
  tabs?: Tab[];
}

const defaultTabs: Tab[] = [
  {
    title: 'Insights',
    icon: <SquareKanban />,
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/dashboard/admin-dashboard-1.png',
  },
  {
    title: 'Metrics',
    icon: <BarChart />,
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/dashboard/admin-dashboard-2.png',
  },
  {
    title: 'Trends',
    icon: <PieChart />,
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/dashboard/admin-dashboard-3.png',
  },
  {
    title: 'Sources',
    icon: <Database />,
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/dashboard/admin-users.png',
  },
  {
    title: 'Models',
    icon: <Layers />,
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/dashboard/admin-developer.png',
  },
];

const Hero = ({
  title = 'Beautiful blocks for Shadcn UI.',
  description = 'Shadcnblocks.com offers the best collection of components and blocks for shadcn/ui.',
  primaryButtonText = 'Download',
  primaryButtonUrl = 'https://shadcnblocks.com',
  secondaryButtonUrl,
  secondaryButtonText,
  tabs = defaultTabs,
}: HeroProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.title || '');

  return (
    <section className="">
      <div className="container m-auto">
        <div className="border-border border-x py-20">
          <div className="relative mx-auto max-w-2xl p-2">
            <h1 className="mx-1 mt-6 text-center text-5xl font-bold tracking-tighter md:text-7xl">
              {title}
            </h1>
            <p className="text-muted-foreground mx-2 mt-6 max-w-xl text-center text-lg font-medium md:text-xl">
              {description}
            </p>
            <div className="mx-2 mt-6 flex justify-center gap-2">
              <Button asChild>
                <a href={primaryButtonUrl}>{primaryButtonText}</a>
              </Button>
              {secondaryButtonText && (
                <Button variant="outline" asChild>
                  <a href={secondaryButtonUrl}>{secondaryButtonText}</a>
                </Button>
              )}
            </div>
          </div>
          <div className="mt-16 md:mt-20">
            <Tabs defaultValue={tabs[0]?.title} onValueChange={setActiveTab}>
              <div className="px-2">
                <TabsList className="mx-auto mb-6 flex h-auto w-fit max-w-xs flex-wrap justify-center gap-2 md:max-w-none">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.title}
                      value={tab.title}
                      className="text-muted-foreground font-normal"
                    >
                      {tab.icon}
                      {tab.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="relative isolate flex justify-center ">
                <div className="relative z-10 w-5/6 ">
                  {tabs.map((tab) => (
                    <TabsContent
                      key={tab.title}
                      value={tab.title}
                      className={cn(
                        'bg-zinc-200 transition-opacity duration-500 rounded-lg p-2.5 ',
                        {
                          'animate-in fade-in opacity-100':
                            activeTab === tab.title,
                          'opacity-0': activeTab !== tab.title,
                        },
                      )}
                    >
                      <img
                        src={tab.image}
                        alt={tab.title}
                        className="border-border aspect-[16/10] w-full border object-top shadow-[0_6px_20px_rgb(0,0,0,0.12)] rounded-lg"
                      />
                      <BorderBeam
                        duration={6}
                        size={400}
                        borderWidth={3}
                        initialOffset={50}
                      />
                      <BorderBeam
                        duration={6}
                        size={400}
                        borderWidth={3}
                        initialOffset={0}
                        className="from-transparent via-blue-500 to-transparent"
                      />
                    </TabsContent>
                  ))}
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
