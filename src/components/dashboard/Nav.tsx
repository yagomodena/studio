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
  ShieldCheck,
} from "lucide-react";

type Role = {
  id: string;
  name: string;
  permissions: string[];
}

// Mock user - in a real app, this would come from your auth context
const currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
};

const allRoles: Role[] = [
    { id: 'role-1', name: 'Admin', permissions: ['all'] },
    { id: 'role-2', name: 'Vendedor', permissions: ['dashboard', 'sales', 'orders', 'inventory', 'categories', 'customers', 'documents'] },
];

const navItems = [
  { href: "/dashboard", slug: 'dashboard', icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/dashboard/sales", slug: 'sales', icon: <ShoppingCart />, label: "Vendas" },
  { href: "/dashboard/orders", slug: 'orders', icon: <ClipboardList />, label: "Pedidos" },
  { href: "/dashboard/inventory", slug: 'inventory', icon: <Package />, label: "Estoque" },
  { href: "/dashboard/categories", slug: 'categories', icon: <Tags />, label: "Categorias" },
  { href: "/dashboard/customers", slug: 'customers', icon: <Users />, label: "Clientes" },
  { href: "/dashboard/documents", slug: 'documents', icon: <FileText />, label: "Documentos" },
  { href: "/dashboard/finance", slug: 'finance', icon: <DollarSign />, label: "Financeiro" },
  { href: "/dashboard/roles", slug: 'roles', icon: <ShieldCheck />, label: "Cargos" },
  { href: "/dashboard/settings", slug: 'settings', icon: <Settings />, label: "Configurações" },
];

const getUserPermissions = (): string[] => {
    const userRole = allRoles.find(r => r.name === currentUser.role);
    if (!userRole) return [];
    if (userRole.permissions.includes('all')) {
        return navItems.map(item => item.slug);
    }
    return userRole.permissions;
}

export function Nav() {
  const pathname = usePathname();
  const userPermissions = getUserPermissions();

  const accessibleNavItems = navItems.filter(item => userPermissions.includes(item.slug));

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
