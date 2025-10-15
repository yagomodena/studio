import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";

const orders = [
  { id: "ORD001", customer: "Liam Johnson", date: "2023-11-23", status: "Enviado", total: "R$250.00" },
  { id: "ORD002", customer: "Olivia Smith", date: "2023-11-22", status: "Processando", total: "R$150.00" },
  { id: "ORD003", customer: "Noah Williams", date: "2023-11-21", status: "Entregue", total: "R$350.00" },
  { id: "ORD004", customer: "Emma Brown", date: "2023-11-20", status: "Entregue", total: "R$450.00" },
  { id: "ORD005", customer: "James Jones", date: "2023-11-19", status: "Cancelado", total: "R$550.00" },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Pedidos</h1>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Pedido
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pedidos</CardTitle>
          <CardDescription>Uma lista de todos os pedidos de clientes.</CardDescription>
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
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'Entregue' ? 'default' 
                      : order.status === 'Processando' || order.status === 'Enviado' ? 'secondary' 
                      : 'destructive'
                    }  className={order.status === 'Entregue' ? 'bg-green-600' : ''}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
