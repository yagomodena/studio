import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { BriefcaseBusiness, LogOut } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Nav } from "@/components/dashboard/Nav";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="size-6 text-sidebar-primary" />
            <span className="text-lg font-semibold font-headline">
              {APP_NAME}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
        <SidebarFooter>
           <Button variant="ghost" className="w-full justify-start gap-2" asChild>
             <Link href="/">
              <LogOut className="size-4" />
              <span>Sair</span>
             </Link>
           </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            {/* Can add breadcrumbs or search here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
