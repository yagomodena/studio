import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";

const products = [
  { name: "Laptop Pro", sku: "LP-001", quantity: 25, price: "R$7500.00", status: "Em Estoque" },
  { name: "Smartphone X", sku: "SX-002", quantity: 8, price: "R$3200.00", status: "Estoque Baixo" },
  { name: "Monitor 4K", sku: "M4K-003", quantity: 15, price: "R$1800.00", status: "Em Estoque" },
  { name: "Teclado Mecânico", sku: "TM-004", quantity: 50, price: "R$450.00", status: "Em Estoque" },
  { name: "Mouse Gamer", sku: "MG-005", quantity: 0, price: "R$250.00", status: "Fora de Estoque" },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Estoque de Produtos</h1>
         <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventário</CardTitle>
          <CardDescription>Gerencie os produtos do seu estoque.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={
                      product.status === 'Em Estoque' ? 'default' 
                      : product.status === 'Estoque Baixo' ? 'secondary' 
                      : 'destructive'
                    } className={product.status === 'Em Estoque' ? 'bg-green-600' : product.status === 'Estoque Baixo' ? 'bg-yellow-500' : ''}>{product.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
