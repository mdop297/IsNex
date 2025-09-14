'use client';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  useEffect(() => {
    console.log('====> RUNNING useEffect', isAuthenticated, isLoading);
    if (!isLoading && !isAuthenticated) {
      console.log('not authenticated, pushing to login');
      router.push('/auth/signin');
    } else if (isLoading && !isAuthenticated) {
      console.log('checking auth---');
      checkAuth();
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <main className="flex-1 bg-secondary overflow-auto">
          <SidebarTrigger className="md:hidden" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
