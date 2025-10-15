'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from "recharts";
import { useState, useEffect } from "react";

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--accent))",
  },
};

export default function DashboardPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setChartData([
      { month: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Fev", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Abr", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Mai", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Ago", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Set", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Out", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
      { month: "Dez", total: Math.floor(Math.random() * 5000) + 1000 },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$45.231,89</div>
            <p className="text-xs text-muted-foreground">+20.1% do último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% do último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">+15% do último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">201 itens com estoque baixo</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Visão Geral de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {isClient && (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <RechartsBarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Vendas Recentes</CardTitle>
            <CardDescription>Você fez 265 vendas este mês.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent sales list */}
            <div className="space-y-4">
                <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Venda #3124</p>
                        <p className="text-sm text-muted-foreground">Cliente: Ana Silva</p>
                    </div>
                    <div className="ml-auto font-medium">+R$1.999,00</div>
                </div>
                 <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Venda #3123</p>
                        <p className="text-sm text-muted-foreground">Cliente: Ricardo Mendes</p>
                    </div>
                    <div className="ml-auto font-medium">+R$39,00</div>
                </div>
                 <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Venda #3122</p>
                        <p className="text-sm text-muted-foreground">Cliente: Joana Lima</p>
                    </div>
                    <div className="ml-auto font-medium">+R$299,00</div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}