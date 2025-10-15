'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Printer,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

const initialTransactions = [
  {
    date: '2023-11-23',
    description: 'Venda - Pedido #3124',
    type: 'Receita',
    amount: 1999.0,
    product: 'Laptop Pro',
    customer: 'Liam Johnson',
  },
  {
    date: '2023-11-22',
    description: 'Pagamento de Fornecedor',
    type: 'Despesa',
    amount: -800.0,
    product: 'N/A',
    customer: 'Fornecedor de Peças',
  },
  {
    date: '2023-11-22',
    description: 'Venda - Pedido #3123',
    type: 'Receita',
    amount: 39.0,
    product: 'Mouse Gamer',
    customer: 'Olivia Smith',
  },
  {
    date: '2023-11-21',
    description: 'Aluguel do Escritório',
    type: 'Despesa',
    amount: -2500.0,
    product: 'N/A',
    customer: 'N/A',
  },
  {
    date: '2023-11-20',
    description: 'Venda - Pedido #3122',
    type: 'Receita',
    amount: 299.0,
    product: 'Teclado Mecânico',
    customer: 'Noah Williams',
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


const chartConfig = {
  receitas: {
    label: 'Receitas',
    color: 'hsl(var(--chart-2))',
  },
  despesas: {
    label: 'Despesas',
    color: 'hsl(var(--chart-5))',
  },
};

export default function FinancePage() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>();
  const [customerFilter, setCustomerFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  const customers = useMemo(() => ['all', ...new Set(initialTransactions.map(t => t.customer).filter(c => c !== 'N/A'))], []);
  const products = useMemo(() => ['all', ...new Set(initialTransactions.map(t => t.product).filter(p => p !== 'N/A'))], []);

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const isDateInRange =
        !dateRange?.from || transactionDate >= dateRange.from &&
        !dateRange?.to || transactionDate <= dateRange.to;
      const isCustomerMatch =
        customerFilter === 'all' || transaction.customer === customerFilter;
      const isProductMatch =
        productFilter === 'all' || transaction.product === productFilter;
      return isDateInRange && isCustomerMatch && isProductMatch;
    });
  }, [dateRange, customerFilter, productFilter]);

  const chartData = useMemo(() => {
    const months = Array.from({length: 6}, (_, i) => format(new Date(new Date().setMonth(new Date().getMonth() - i)), 'MMM', { locale: ptBR })).reverse();
    const data: { [key: string]: { month: string; receitas: number; despesas: number } } = {};
    
    months.forEach(month => {
      data[month] = { month, receitas: 0, despesas: 0 };
    });

    filteredTransactions.forEach(t => {
      const month = format(new Date(t.date), 'MMM', { locale: ptBR });
      if (data[month]) {
          if (t.type === 'Receita') {
            data[month].receitas += t.amount;
          } else {
            data[month].despesas += Math.abs(t.amount);
          }
      }
    });
    return Object.values(data);
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline">Financeiro</h1>
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Adicionar Receita
            </Button>
            <Button variant="outline">
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Adicionar Despesa
            </Button>
        </div>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>Receitas e despesas ao longo do tempo.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
             <BarChart data={chartData}>
               <CartesianGrid vertical={false} />
               <XAxis
                 dataKey="month"
                 tickLine={false}
                 tickMargin={10}
                 axisLine={false}
               />
               <YAxis />
               <Tooltip
                 cursor={false}
                 content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-2 shadow-lg rounded-lg border">
                        <p className="font-bold">{label}</p>
                        <p style={{ color: chartConfig.receitas.color }}>
                          Receitas: {(payload[0].value as number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <p style={{ color: chartConfig.despesas.color }}>
                          Despesas: {(payload[1].value as number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
               />
               <Bar dataKey="receitas" fill={chartConfig.receitas.color} radius={[4, 4, 0, 0]} />
               <Bar dataKey="despesas" fill={chartConfig.despesas.color} radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa</CardTitle>
          <CardDescription>
            Acompanhe todas as suas transações financeiras.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full sm:w-[300px] justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM/y')} -{' '}
                        {format(dateRange.to, 'dd/MM/y')}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/y')
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
             <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'Todos os Clientes' : c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => <SelectItem key={p} value={p}>{p === 'all' ? 'Todos os Produtos' : p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`flex items-center ${
                          transaction.type === 'Receita'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'Receita' ? (
                          <ArrowUpCircle className="mr-2 h-4 w-4" />
                        ) : (
                          <ArrowDownCircle className="mr-2 h-4 w-4" />
                        )}
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.type === 'Receita'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
