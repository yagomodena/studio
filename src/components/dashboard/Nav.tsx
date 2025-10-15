"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  ClipboardList,
  FileText,
  Settings,
  Tags,
} from "lucide-react";

// Mock user role - in a real app, this would come from your auth context
const userRole: 'Admin' | 'Membro' = 'Admin'; 

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard", requiredRole: ['Admin', 'Membro'] },
  { href: "/dashboard/sales", icon: <ShoppingCart />, label: "Vendas", requiredRole: ['Admin', 'Membro'] },
  { href: "/dashboard/orders", icon: <ClipboardList />, label: "Pedidos", requiredRole: ['Admin', 'Membro'] },
  { href: "/dashboard/inventory", icon: <Package />, label: "Estoque", requiredRole: ['Admin', 'Membro'] },
  { href: "/dashboard/categories", icon: <Tags />, label: "Categorias", requiredRole: ['Admin', 'Membro'] },
  { href: "/dashboard/customers", icon: <Users />, label: "Clientes", requiredRole: ['Admin', 'Membro'] },
  { href: "/dashboard/documents", icon: <FileText />, label: "Documentos", requiredRole: ['Admin', 'Membro'] },
  // Admin-only routes
  { href: "/dashboard/finance", icon: <DollarSign />, label: "Financeiro", requiredRole: ['Admin'] },
  { href: "/dashboard/settings", icon: <Settings />, label: "Configurações", requiredRole: ['Admin'] },
];

export function Nav() {
  const pathname = usePathname();

  const accessibleNavItems = navItems.filter(item => item.requiredRole.includes(userRole));

  return (
    <SidebarMenu>
      {accessibleNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
              tooltip={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
