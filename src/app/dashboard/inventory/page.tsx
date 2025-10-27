'use client';

import { useState, useMemo } from 'react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';

type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  companyId: string;
};

type Category = {
  id: string;
  name: string;
};

type UserProfile = {
    companyId: string;
}

const getStatus = (
  quantity: number
): 'Em Estoque' | 'Estoque Baixo' | 'Fora de Estoque' => {
  if (quantity === 0) return 'Fora de Estoque';
  if (quantity < 10) return 'Estoque Baixo';
  return 'Em Estoque';
};

export default function InventoryPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    const productsRef = useMemoFirebase(() => {
        if (!userProfile?.companyId) return null;
        return collection(firestore, 'companies', userProfile.companyId, 'products');
    }, [firestore, userProfile]);

    const categoriesRef = useMemoFirebase(() => {
        if (!userProfile?.companyId) return null;
        return collection(firestore, 'companies', userProfile.companyId, 'categories');
    }, [firestore, userProfile]);

    const { data: products, isLoading: isLoadingProducts } = useCollection<Omit<Product, 'id'>>(productsRef);
    const { data: categories, isLoading: isLoadingCategories } = useCollection<Omit<Category, 'id'>>(categoriesRef);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
  });

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    if (product) {
      setFormState({
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
      });
    } else {
      setFormState({ name: '', category: '', quantity: 0, price: 0 });
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormState({ name: '', category: '', quantity: 0, price: 0 });
  }

  const handleDelete = (productId: string) => {
    if (!productsRef) return;
    const productDocRef = doc(productsRef, productId);
    deleteDocumentNonBlocking(productDocRef);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productsRef || !userProfile?.companyId) return;

    const productData = {
      name: formState.name,
      category: formState.category,
      quantity: Number(formState.quantity),
      price: Number(formState.price),
      companyId: userProfile.companyId,
    };

    if (editingProduct) {
      const productDocRef = doc(productsRef, editingProduct.id);
      setDocumentNonBlocking(productDocRef, {
        ...editingProduct,
        ...productData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } else {
      addDocumentNonBlocking(productsRef, {
        ...productData,
        createdAt: serverTimestamp(),
      });
    }
    handleCloseDialog();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, category: value }));
  };
  
  const isLoading = isUserLoading || isProfileLoading || isLoadingProducts || isLoadingCategories;

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
                <TableHead>Categoria</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getStatus(product.quantity) === 'Em Estoque'
                          ? 'default'
                          : getStatus(product.quantity) === 'Estoque Baixo'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className={
                        getStatus(product.quantity) === 'Em Estoque'
                          ? 'bg-green-600'
                          : getStatus(product.quantity) === 'Estoque Baixo'
                          ? 'bg-yellow-500'
                          : ''
                      }
                    >
                      {getStatus(product.quantity)}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
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
                                onClick={() => handleDelete(product.id)}
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
              ))
              ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        Nenhum produto encontrado.
                    </TableCell>
                </TableRow>
              )}
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
                 <Label htmlFor="category" className="text-right">
                   Categoria
                 </Label>
                 <Select
                   value={formState.category}
                   onValueChange={handleSelectChange}
                   required
                 >
                   <SelectTrigger className="col-span-3">
                     <SelectValue placeholder="Selecione uma categoria" />
                   </SelectTrigger>
                   <SelectContent>
                     {isLoadingCategories ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                     ) : (
                        categories?.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                                {category.name}
                            </SelectItem>
                        ))
                     )}
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
                <Button type="button" variant="secondary" onClick={handleCloseDialog}>
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
