import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Building, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sidebar-primary">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M12 10a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
                <path d="M12 12.5c-4.42 0-8 1.79-8 4v.5"></path>
                <path d="M20 16.5c-4.42 0-8-1.79-8-4"></path>
                <path d="M12 2.5v2.5"></path>
                <path d="M12 10v2.5"></path>
                <path d="M16.5 4.75l-2.5 1.5"></path>
                <path d="M7.5 6.25l2.5-1.5"></path>
                <path d="m19.5 9-2.5 1.5"></path>
                <path d="m4.5 10.5 2.5-1.5"></path>
                <path d="M18.5 14.25-16 12"></path>
                <path d="m5.5 14.25 2.5-1.5"></path>
           </svg>
            <span className="font-headline text-xl font-bold tracking-tight text-sidebar-foreground">
              Citizen Connect
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/admin">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild disabled>
                <Link href="#">
                  <FileText />
                  Reports
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild disabled>
                <Link href="#">
                  <Building />
                  Departments
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild disabled>
                <Link href="#">
                  <BarChart3 />
                  Analytics
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className='flex-1'>
                <h1 className="font-headline text-lg font-semibold text-primary md:text-2xl">Admin Dashboard</h1>
            </div>
            <Link href="/">
                <Button variant="outline">Exit Admin</Button>
            </Link>
        </header>
        <main className="flex-1 p-4 lg:p-6 bg-muted/40">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
