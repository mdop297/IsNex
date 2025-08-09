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
      {/* {!isWorkspace && <AppSidebar />} */}
      <AppSidebar />
      <main className="w-full bg-secondary">
        <SidebarTrigger className={'md:hidden '} />
        {children}
      </main>
    </SidebarProvider>
  );
}
