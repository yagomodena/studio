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

type Sale = {
  id: string;
  customer: string;
  date: string;
  status: 'Concluída' | 'Pendente' | 'Cancelada';
  total: string;
};

type Customer = {
  id: string;
  name: string;
};

type Product = {
  sku: string;
  name: string;
  price: string;
};

const initialCustomers: Customer[] = [
    { id: 'CUST001', name: 'Liam Johnson' },
    { id: 'CUST002', name: 'Olivia Smith' },
    { id: 'CUST003', name: 'Noah Williams' },
    { id: 'CUST004', name: 'Emma Brown' },
    { id: 'CUST005', name: 'James Jones' },
];

const initialProducts: Product[] = [
  { name: 'Laptop Pro', sku: 'LP-001', price: 'R$7500.00' },
  { name: 'Smartphone X', sku: 'SX-002', price: 'R$3200.00' },
  { name: 'Monitor 4K', sku: 'M4K-003', price: 'R$1800.00' },
  { name: 'Teclado Mecânico', sku: 'TM-004', price: 'R$450.00' },
  { name: 'Mouse Gamer', sku: 'MG-005', price: 'R$250.00' },
];

const initialSales: Sale[] = [
  { id: "SALE001", customer: "Liam Johnson", date: "2023-11-23", status: "Concluída", total: "R$250.00" },
  { id: "SALE002", customer: "Olivia Smith", date: "2023-11-22", status: "Concluída", total: "R$150.00" },
  { id: "SALE003", customer: "Noah Williams", date: "2023-11-21", status: "Pendente", total: "R$350.00" },
  { id: "SALE004", customer: "Emma Brown", date: "2023-11-20", status: "Concluída", total: "R$450.00" },
  { id: "SALE005", customer: "James Jones", date: "2023-11-19", status: "Cancelada", total: "R$550.00" },
];

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [products] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formState, setFormState] = useState({
    customer: '',
    product: '',
    quantity: 1,
    status: 'Pendente' as Sale['status'],
  });

  const handleOpenDialog = () => {
    setFormState({
        customer: '',
        product: '',
        quantity: 1,
        status: 'Pendente',
      });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProduct = products.find(p => p.sku === formState.product);
    if (!selectedProduct || !formState.customer) return;

    const priceAsNumber = parseFloat(selectedProduct.price.replace('R$', '').replace('.', '').replace(',', '.'));
    const total = priceAsNumber * formState.quantity;

    const newSale: Sale = {
      id: `SALE${String(Date.now()).slice(-3)}`,
      customer: customers.find(c => c.id === formState.customer)?.name || 'Cliente Desconhecido',
      date: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'),
      status: formState.status,
      total: `R$${total.toFixed(2).replace('.', ',')}`,
    };
    setSales([newSale, ...sales]);
    setIsDialogOpen(false);
  };

  const handleSelectChange = (id: 'customer' | 'product' | 'status', value: string) => {
    setFormState((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Vendas</h1>
        <Button onClick={handleOpenDialog} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Venda
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>Uma lista de todas as vendas registradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID da Venda</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{new Date(sale.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={
                      sale.status === 'Concluída' ? 'default' 
                      : sale.status === 'Pendente' ? 'secondary' 
                      : 'destructive'
                    } className={sale.status === 'Concluída' ? 'bg-green-600' : ''}>{sale.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{sale.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Venda</DialogTitle>
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
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product" className="text-right">
                  Produto
                </Label>
                <Select
                  value={formState.product}
                  onValueChange={(value) => handleSelectChange('product', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.sku} value={product.sku}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantidade
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formState.quantity}
                  onChange={handleInputChange}
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
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
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
              <Button type="submit" disabled={!formState.customer || !formState.product}>Salvar Venda</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
