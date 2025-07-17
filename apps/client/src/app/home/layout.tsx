import AppSidebar from '@/components/home/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* Vì sao thêm h-full thì lại fail */}
      <main className="w-full bg-secondary/30 ">
        <SidebarTrigger className={'md:hidden '} />
        {children}
      </main>
    </SidebarProvider>
  );
}
