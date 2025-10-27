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
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Check, ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

type Role = {
  id: string;
  name: string;
  permissions: string[];
};

const allPermissions = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'sales', label: 'Vendas' },
    { id: 'orders', label: 'Pedidos' },
    { id: 'inventory', label: 'Estoque' },
    { id: 'categories', label: 'Categorias' },
    { id: 'customers', label: 'Clientes' },
    { id: 'finance', label: 'Financeiro' },
    { id: 'roles', label: 'Cargos' },
    { id: 'settings', label: 'Configurações' },
];

const initialRoles: Role[] = [
    { id: 'role-1', name: 'Admin', permissions: ['all'] },
    { id: 'role-2', name: 'Vendedor', permissions: ['dashboard', 'sales', 'orders', 'inventory', 'categories', 'customers'] },
];


export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formState, setFormState] = useState({ name: '', permissions: [] as string[] });

    const handleOpenDialog = (role: Role | null = null) => {
        setEditingRole(role);
        if (role) {
            setFormState({ name: role.name, permissions: role.permissions });
        } else {
            setFormState({ name: '', permissions: [] });
        }
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setRoles(roles.filter((r) => r.id !== id));
    };
    
    const handlePermissionChange = (permissionId: string) => {
        setFormState(prev => {
            if (permissionId === 'all') {
                const areAllSelected = prev.permissions.includes('all') || prev.permissions.length === allPermissions.length;
                return {
                    ...prev,
                    permissions: areAllSelected ? [] : ['all'],
                };
            }
    
            let newPermissions = [...prev.permissions];
            if (newPermissions.includes('all')) {
                newPermissions = allPermissions.map(p => p.id);
            }
            
            if (newPermissions.includes(permissionId)) {
                newPermissions = newPermissions.filter(p => p !== permissionId && p !== 'all');
            } else {
                newPermissions.push(permissionId);
            }

            if (newPermissions.length === allPermissions.length) {
                newPermissions = ['all'];
            }
    
            return { ...prev, permissions: newPermissions };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRole: Role = {
            id: editingRole ? editingRole.id : `role-${Date.now()}`,
            name: formState.name,
            permissions: formState.permissions
        };

        if (editingRole) {
            setRoles(
                roles.map((r) => (r.id === editingRole.id ? newRole : r))
            );
        } else {
            setRoles([newRole, ...roles]);
        }
        setIsDialogOpen(false);
    };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Cargos e Permissões</h1>
        <Button onClick={() => handleOpenDialog()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Cargo
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cargos</CardTitle>
          <CardDescription>Gerencie os cargos e as permissões de acesso da sua equipe.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    {role.permissions.includes('all') ? (
                        <Badge variant="default" className="bg-blue-600">Acesso Total</Badge>
                    ) : (
                        <Badge variant="secondary">{role.permissions.length} permissões</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(role)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm text-destructive hover:text-destructive px-2 py-1.5 font-normal"
                              disabled={role.name === 'Admin'}
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
                                permanentemente o cargo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(role.id)}
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Editar Cargo' : 'Adicionar Novo Cargo'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div>
                <Label htmlFor="name" className="text-base">
                  Nome do Cargo
                </Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState(prev => ({...prev, name: e.target.value}))}
                  className="mt-2"
                  required
                  disabled={editingRole?.name === 'Admin'}
                />
              </div>
              <div>
                <Label className="text-base">Permissões de Acesso</Label>
                <p className="text-sm text-muted-foreground">Selecione as páginas que este cargo poderá acessar.</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-md border p-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="all"
                            checked={formState.permissions.includes('all')}
                            onCheckedChange={() => handlePermissionChange('all')}
                            disabled={editingRole?.name === 'Admin'}
                        />
                        <Label htmlFor="all" className="font-bold text-base flex items-center gap-2">
                            <Check className="h-4 w-4" /> Acesso Total
                        </Label>
                    </div>
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={permission.id}
                            checked={formState.permissions.includes('all') || formState.permissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionChange(permission.id)}
                            disabled={formState.permissions.includes('all') || editingRole?.name === 'Admin'}
                        />
                        <Label htmlFor={permission.id}>
                            {permission.label}
                        </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={editingRole?.name === 'Admin'}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
