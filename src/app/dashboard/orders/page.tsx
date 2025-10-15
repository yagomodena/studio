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
import { Loader2, PlusCircle, Printer, Trash2, Wand2, MessageSquare } from 'lucide-react';
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
import { generateInformativeDocument, GenerateInformativeDocumentInput } from '@/ai/flows/generate-informative-document';

type Order = {
  id: string;
  customer: string;
  date: string;
  status: 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  total: string;
  products: { name: string; quantity: number; price: number }[];
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
  { name: 'Laptop Pro', sku: 'LP-001', price: '7500.00' },
  { name: 'Smartphone X', sku: 'SX-002', price: '3200.00' },
  { name: 'Monitor 4K', sku: 'M4K-003', price: '1800.00' },
  { name: 'Teclado Mecânico', sku: 'TM-004', price: '450.00' },
  { name: 'Mouse Gamer', sku: 'MG-005', price: '250.00' },
];

const initialOrders: Order[] = [
  {
    id: 'ORD001',
    customer: 'Liam Johnson',
    date: '2023-11-23',
    status: 'Enviado',
    total: 'R$250.00',
    products: [{ name: 'Mouse Gamer', quantity: 1, price: 250 }],
  },
  {
    id: 'ORD002',
    customer: 'Olivia Smith',
    date: '2023-11-22',
    status: 'Processando',
    total: 'R$150.00',
    products: [{ name: 'Teclado Mecânico', quantity: 1, price: 150 }],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [products] = useState<Product[]>(initialProducts);
  const [companyName] = useState<string>('Sua Empresa LTDA');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  
  const [formState, setFormState] = useState({
    customer: '',
    status: 'Processando' as Order['status'],
    products: [{ productId: '', quantity: 1 }],
  });
  
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<GenerateInformativeDocumentInput | null>(null);

  const handleOpenFormDialog = () => {
    setFormState({ customer: '', status: 'Processando', products: [{ productId: '', quantity: 1 }] });
    setIsFormDialogOpen(true);
  };

  const addProductField = () => {
    setFormState(prev => ({
      ...prev,
      products: [...prev.products, { productId: '', quantity: 1 }],
    }));
  };

  const removeProductField = (index: number) => {
    setFormState(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleProductChange = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    setFormState(prev => {
      const newProducts = [...prev.products];
      newProducts[index] = { ...newProducts[index], [field]: value };
      return { ...prev, products: newProducts };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.customer || formState.products.some(p => !p.productId)) return;

    const orderProducts = formState.products.map(p => {
      const productDetails = products.find(prod => prod.sku === p.productId)!;
      return {
        name: productDetails.name,
        quantity: Number(p.quantity),
        price: parseFloat(productDetails.price),
      };
    });

    const total = orderProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);

    const newOrder: Order = {
      id: `ORD${String(Date.now()).slice(-3)}`,
      customer: customers.find(c => c.id === formState.customer)?.name || 'Cliente Desconhecido',
      date: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'),
      status: formState.status,
      total: `R$${total.toFixed(2).replace('.', ',')}`,
      products: orderProducts,
    };
    
    setOrders([newOrder, ...orders]);
    setIsFormDialogOpen(false);
    
    const docInput = {
        companyName: companyName,
        customerName: newOrder.customer,
        products: newOrder.products,
        totalAmount: total,
        date: new Date(newOrder.date).toLocaleDateString('pt-BR'),
    };

    setCurrentOrder(docInput);
    setIsDocumentDialogOpen(true);
    setDocumentLoading(true);

    try {
        const result = await generateInformativeDocument(docInput);
        setGeneratedDocument(result.documentText);
    } catch (error) {
        console.error("Failed to generate document", error);
        setGeneratedDocument("Erro ao gerar o documento.");
    } finally {
        setDocumentLoading(false);
    }
  };

  const handleSelectChange = (id: 'customer' | 'status', value: string) => {
    setFormState((prev) => ({ ...prev, [id]: value }));
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Documento do Pedido</title>');
      printWindow.document.write('<style>body { font-family: sans-serif; } pre { white-space: pre-wrap; word-wrap: break-word; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<pre>${generatedDocument}</pre>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleWhatsApp = () => {
    if (currentOrder) {
      const message = `Olá ${currentOrder.customerName}, aqui estão os detalhes do seu pedido na ${currentOrder.companyName}:\n\n${generatedDocument}\n\nObrigado!`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Pedidos</h1>
        <Button
          onClick={handleOpenFormDialog}
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

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-lg">
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
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formState.products.map((product, index) => (
                <div key={index} className="grid grid-cols-12 items-center gap-2">
                  <Label className="col-span-12">Produto {index + 1}</Label>
                  <div className="col-span-8">
                     <Select
                        value={product.productId}
                        onValueChange={(value) => handleProductChange(index, 'productId', value)}
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((p) => (
                            <SelectItem key={p.sku} value={p.sku}>
                                {p.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                     <Input
                        type="number"
                        min="1"
                        placeholder="Qtd."
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value))}
                        required
                    />
                  </div>
                  {formState.products.length > 1 && (
                    <Button type="button" variant="destructive" size="icon" className="col-span-1" onClick={() => removeProductField(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button type="button" variant="outline" size="sm" onClick={addProductField}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar outro produto
              </Button>


              <div className="grid grid-cols-4 items-center gap-4 mt-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => handleSelectChange('status', value as Order['status'])}
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
              <Button type="submit" disabled={!formState.customer || formState.products.some(p => !p.productId)}>Salvar Pedido</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Documento do Pedido Gerado</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                {documentLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    </div>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-muted p-4 rounded-md">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{generatedDocument}</pre>
                    </div>
                )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={handlePrint} disabled={documentLoading}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>
                <Button onClick={handleWhatsApp} disabled={documentLoading} className="bg-green-500 hover:bg-green-600 text-white">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar via WhatsApp
                </Button>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">
                    Fechar
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
