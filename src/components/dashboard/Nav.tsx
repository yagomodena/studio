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

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/dashboard/sales", icon: <ShoppingCart />, label: "Vendas" },
  { href: "/dashboard/orders", icon: <ClipboardList />, label: "Pedidos" },
  { href: "/dashboard/inventory", icon: <Package />, label: "Estoque" },
  { href: "/dashboard/categories", icon: <Tags />, label: "Categorias" },
  { href: "/dashboard/customers", icon: <Users />, label: "Clientes" },
  { href: "/dashboard/finance", icon: <DollarSign />, label: "Financeiro" },
  { href: "/dashboard/documents", icon: <FileText />, label: "Documentos" },
  { href: "/dashboard/settings", icon: <Settings />, label: "Configurações" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
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
