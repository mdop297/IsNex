'use client';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { routes } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('>>>>> LOADING user info <<<<<');
    if (!loading && !user) {
      console.log('not authenticated, pushing to login');
      router.push(routes.SIGNIN);
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <main className="flex-1 bg-background overflow-auto">
          <SidebarTrigger className="md:hidden" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
