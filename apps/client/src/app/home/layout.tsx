import AppSidebar from '@/components/home/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger className={'md:hidden'} size={'lg'} />
        {children}
      </main>
    </SidebarProvider>
  );
}
