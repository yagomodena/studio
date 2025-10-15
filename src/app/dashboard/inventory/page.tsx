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
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Product = {
  sku: string;
  name: string;
  category: string;
  quantity: number;
  price: string;
  status: 'Em Estoque' | 'Estoque Baixo' | 'Fora de Estoque';
};

type Category = {
  id: string;
  name: string;
};

const initialProducts: Product[] = [
  {
    name: 'Laptop Pro',
    sku: 'LP-001',
    category: 'Eletrônicos',
    quantity: 25,
    price: 'R$7500.00',
    status: 'Em Estoque',
  },
  {
    name: 'Smartphone X',
    sku: 'SX-002',
    category: 'Eletrônicos',
    quantity: 8,
    price: 'R$3200.00',
    status: 'Estoque Baixo',
  },
  {
    name: 'Monitor 4K',
    sku: 'M4K-003',
    category: 'Eletrônicos',
    quantity: 15,
    price: 'R$1800.00',
    status: 'Em Estoque',
  },
  {
    name: 'Teclado Mecânico',
    sku: 'TM-004',
    category: 'Periféricos',
    quantity: 50,
    price: 'R$450.00',
    status: 'Em Estoque',
  },
  {
    name: 'Mouse Gamer',
    sku: 'MG-005',
    category: 'Periféricos',
    quantity: 0,
    price: 'R$250.00',
    status: 'Fora de Estoque',
  },
];

const initialCategories: Category[] = [
    { id: 'CAT001', name: 'Eletrônicos' },
    { id: 'CAT002', name: 'Periféricos' },
    { id: 'CAT003', name: 'Acessórios' },
];

const getStatus = (
  quantity: number
): 'Em Estoque' | 'Estoque Baixo' | 'Fora de Estoque' => {
  if (quantity === 0) return 'Fora de Estoque';
  if (quantity < 10) return 'Estoque Baixo';
  return 'Em Estoque';
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    price: '',
  });

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    if (product) {
      setFormState({
        name: product.name,
        sku: product.sku,
        category: product.category,
        quantity: product.quantity,
        price: product.price.replace('R$', '').replace('.', '').replace(',', '.'),
      });
    } else {
      setFormState({ name: '', sku: '', category: '', quantity: 0, price: '' });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (sku: string) => {
    setProducts(products.filter((p) => p.sku !== sku));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      name: formState.name,
      sku: editingProduct ? formState.sku : `PROD-${Date.now()}`,
      category: formState.category,
      quantity: Number(formState.quantity),
      price: `R$${parseFloat(formState.price).toFixed(2).replace('.', ',')}`,
      status: getStatus(Number(formState.quantity)),
    };

    if (editingProduct) {
      setProducts(
        products.map((p) => (p.sku === editingProduct.sku ? newProduct : p))
      );
    } else {
      setProducts([newProduct, ...products]);
    }
    setIsDialogOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: 'category', value: string) => {
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Estoque de Produtos</h1>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventário</CardTitle>
          <CardDescription>
            Gerencie os produtos do seu estoque.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === 'Em Estoque'
                          ? 'default'
                          : product.status === 'Estoque Baixo'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className={
                        product.status === 'Em Estoque'
                          ? 'bg-green-600'
                          : product.status === 'Estoque Baixo'
                          ? 'bg-yellow-500'
                          : ''
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm text-destructive hover:text-destructive px-2 py-1.5 font-normal"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Você tem certeza?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso irá deletar
                                permanentemente o produto do seu estoque.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.sku)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={formState.sku}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                  disabled={!!editingProduct}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="category" className="text-right">
                   Categoria
                 </Label>
                 <Select
                   value={formState.category}
                   onValueChange={(value) => handleSelectChange('category', value)}
                   required
                 >
                   <SelectTrigger className="col-span-3">
                     <SelectValue placeholder="Selecione uma categoria" />
                   </SelectTrigger>
                   <SelectContent>
                     {categories.map((category) => (
                       <SelectItem key={category.id} value={category.name}>
                         {category.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Qtd.
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formState.quantity}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Preço
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formState.price}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
