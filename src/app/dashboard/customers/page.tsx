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
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  companyId: string;
};

export default function CustomersPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [userProfile, setUserProfile] = useState<{ companyId?: string } | null>(null);

    // Mock para perfil de usuário, idealmente viria de um 'useProfile' hook
    // Simulando que o perfil é carregado após o usuário ser identificado
    useState(() => {
      if (user) {
        // Em um app real, você buscaria o perfil do usuário do Firestore aqui.
        // Por agora, vamos simular que o usuário pertence a uma 'company-1'
        setTimeout(() => setUserProfile({ companyId: 'company-1' }), 500);
      } else {
        setUserProfile(null);
      }
    });

    const customersRef = useMemoFirebase(() => {
        if (!userProfile?.companyId) return null;
        return collection(firestore, 'companies', userProfile.companyId, 'customers');
    }, [firestore, userProfile]);

    const { data: customers, isLoading: isLoadingCustomers } = useCollection<Omit<Customer, 'id'>>(customersRef);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formState, setFormState] = useState({ name: '', email: '', phone: '' });

    const handleOpenDialog = (customer: Customer | null = null) => {
        setEditingCustomer(customer);
        if (customer) {
            setFormState({ name: customer.name, email: customer.email, phone: customer.phone });
        } else {
            setFormState({ name: '', email: '', phone: '' });
        }
        setIsDialogOpen(true);
    };

    const handleDelete = (customerId: string) => {
        if (!customersRef) return;
        const customerDocRef = doc(customersRef, customerId);
        deleteDocumentNonBlocking(customerDocRef);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customersRef) return;

        const customerData = {
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          companyId: userProfile?.companyId || '',
        };

        if (editingCustomer) {
            const customerDocRef = doc(customersRef, editingCustomer.id);
            setDocumentNonBlocking(customerDocRef, {
              ...editingCustomer,
              ...customerData
            }, { merge: true });
        } else {
            addDocumentNonBlocking(customersRef, {
              ...customerData,
              totalSpent: 0,
              createdAt: new Date(),
            });
        }
        setIsDialogOpen(false);
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormState((prev) => ({ ...prev, [id]: value }));
    };

    const isLoading = isUserLoading || isLoadingCustomers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Clientes</h1>
        <Button onClick={() => handleOpenDialog()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Gerencie seus clientes cadastrados.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Total Gasto</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : customers && customers.length > 0 ? (
                customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell className="text-right">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(customer)}>
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
                                permanentemente o cliente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(customer.id)}
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
                    <TableCell colSpan={5} className="text-center h-24">
                        Nenhum cliente encontrado.
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
              {editingCustomer ? 'Editar Cliente' : 'Adicionar Cliente'}
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
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formState.phone}
                  onChange={handleFormChange}
                  className="col-span-3"
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

    