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
  Settings
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/dashboard/sales", icon: <ShoppingCart />, label: "Vendas" },
  { href: "/dashboard/orders", icon: <ClipboardList />, label: "Pedidos" },
  { href: "/dashboard/inventory", icon: <Package />, label: "Estoque" },
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
              isActive={pathname === item.href}
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
