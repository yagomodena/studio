'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Order = {
  id: string;
  customer: string;
  date: string;
  status: 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  total: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: string;
};

const initialCustomers: Customer[] = [
  { id: 'CUST001', name: 'Liam Johnson', email: 'liam@example.com', phone: '(11) 98765-4321', totalSpent: 'R$250.00' },
  { id: 'CUST002', name: 'Olivia Smith', email: 'olivia@example.com', phone: '(21) 91234-5678', totalSpent: 'R$150.00' },
  { id: 'CUST003', name: 'Noah Williams', email: 'noah@example.com', phone: '(31) 99999-8888', totalSpent: 'R$350.00' },
  { id: 'CUST004', name: 'Emma Brown', email: 'emma@example.com', phone: '(41) 98888-7777', totalSpent: 'R$450.00' },
  { id: 'CUST005', name: 'James Jones', email: 'james@example.com', phone: '(51) 97777-6666', totalSpent: 'R$550.00' },
];

const initialOrders: Order[] = [
  {
    id: 'ORD001',
    customer: 'Liam Johnson',
    date: '2023-11-23',
    status: 'Enviado',
    total: 'R$250.00',
  },
  {
    id: 'ORD002',
    customer: 'Olivia Smith',
    date: '2023-11-22',
    status: 'Processando',
    total: 'R$150.00',
  },
  {
    id: 'ORD003',
    customer: 'Noah Williams',
    date: '2023-11-21',
    status: 'Entregue',
    total: 'R$350.00',
  },
  {
    id: 'ORD004',
    customer: 'Emma Brown',
    date: '2023-11-20',
    status: 'Entregue',
    total: 'R$450.00',
  },
  {
    id: 'ORD005',
    customer: 'James Jones',
    date: '2023-11-19',
    status: 'Cancelado',
    total: 'R$550.00',
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    customer: '',
    total: '',
    status: 'Processando' as Order['status'],
  });

  const handleOpenDialog = () => {
    setFormState({ customer: '', total: '', status: 'Processando' });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: `ORD${String(Date.now()).slice(-3)}`,
      customer: formState.customer,
      date: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'), // YYYY-MM-DD
      status: formState.status,
      total: `R$${parseFloat(formState.total).toFixed(2).replace('.', ',')}`,
    };
    setOrders([newOrder, ...orders]);
    setIsDialogOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: 'customer' | 'status', value: string) => {
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Pedidos</h1>
        <Button
          onClick={handleOpenDialog}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Pedido
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pedidos</CardTitle>
          <CardDescription>
            Uma lista de todos os pedidos de clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === 'Entregue'
                          ? 'default'
                          : order.status === 'Processando' ||
                            order.status === 'Enviado'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className={order.status === 'Entregue' ? 'bg-green-600' : ''}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Pedido</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer" className="text-right">
                  Cliente
                </Label>
                <Select
                  value={formState.customer}
                  onValueChange={(value) => handleSelectChange('customer', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total" className="text-right">
                  Total (R$)
                </Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  value={formState.total}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processando">Processando</SelectItem>
                    <SelectItem value="Enviado">Enviado</SelectItem>
                    <SelectItem value="Entregue">Entregue</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!formState.customer || !formState.total}>Salvar Pedido</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
