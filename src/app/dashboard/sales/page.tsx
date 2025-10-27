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
import { PlusCircle, Trash2, Loader2, Printer, MessageSquare } from 'lucide-react';
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


type Sale = {
  id: string;
  customer: string;
  date: string;
  status: 'Concluída' | 'Pendente' | 'Cancelada';
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

const initialSales: Sale[] = [
  { id: "SALE001", customer: "Liam Johnson", date: "2023-11-23", status: "Concluída", total: "R$250.00", products: [{ name: 'Mouse Gamer', quantity: 1, price: 250 }] },
  { id: "SALE002", customer: "Olivia Smith", date: "2023-11-22", status: "Concluída", total: "R$150.00", products: [{ name: 'Teclado Mecânico', quantity: 1, price: 150 }] },
];

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [products] = useState<Product[]>(initialProducts);
  const [companyName] = useState<string>('Sua Empresa LTDA');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  
  const [formState, setFormState] = useState({
    customer: '',
    status: 'Concluída' as Sale['status'],
    products: [{ productId: '', quantity: 1 }],
  });
  
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [currentSale, setCurrentSale] = useState<GenerateInformativeDocumentInput | null>(null);


  const handleOpenDialog = () => {
    setFormState({
        customer: '',
        status: 'Concluída',
        products: [{ productId: '', quantity: 1 }],
      });
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

    const saleProducts = formState.products.map(p => {
        const productDetails = products.find(prod => prod.sku === p.productId)!;
        return {
            name: productDetails.name,
            quantity: Number(p.quantity),
            price: parseFloat(productDetails.price),
        };
    });

    const total = saleProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0);

    const newSale: Sale = {
      id: `SALE${String(Date.now()).slice(-3)}`,
      customer: customers.find(c => c.id === formState.customer)?.name || 'Cliente Desconhecido',
      date: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'),
      status: formState.status,
      total: `R$${total.toFixed(2).replace('.', ',')}`,
      products: saleProducts,
    };
    setSales([newSale, ...sales]);
    setIsFormDialogOpen(false);
    
    const docInput = {
        companyName: companyName,
        customerName: newSale.customer,
        products: newSale.products,
        totalAmount: total,
        date: new Date(newSale.date).toLocaleDateString('pt-BR'),
    };
    
    setCurrentSale(docInput);
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
      printWindow.document.write('<html><head><title>Documento da Venda</title>');
      printWindow.document.write('<style>body { font-family: sans-serif; } pre { white-space: pre-wrap; word-wrap: break-word; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<pre>${generatedDocument}</pre>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleWhatsApp = () => {
    if (currentSale) {
      const message = `Olá ${currentSale.customerName}, obrigado pela sua compra na ${currentSale.companyName}! Seguem os detalhes:\n\n${generatedDocument}\n\n`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
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

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-lg">
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
                  onValueChange={(value) => handleSelectChange('status', value as Sale['status'])}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
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
              <Button type="submit" disabled={!formState.customer || formState.products.some(p => !p.productId)}>Salvar Venda</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Documento da Venda Gerado</DialogTitle>
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
