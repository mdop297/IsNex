// 'use client';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname();
  // const isWorkspace = pathname.startsWith('/workspace');
  // const isWorkspace = pathname.includes('/workspace/');

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
