import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";

const sales = [
  { id: "SALE001", customer: "Liam Johnson", date: "2023-11-23", status: "Concluída", total: "R$250.00" },
  { id: "SALE002", customer: "Olivia Smith", date: "2023-11-22", status: "Concluída", total: "R$150.00" },
  { id: "SALE003", customer: "Noah Williams", date: "2023-11-21", status: "Pendente", total: "R$350.00" },
  { id: "SALE004", customer: "Emma Brown", date: "2023-11-20", status: "Concluída", total: "R$450.00" },
  { id: "SALE005", customer: "James Jones", date: "2023-11-19", status: "Cancelada", total: "R$550.00" },
];

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Vendas</h1>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
                  <TableCell>{sale.date}</TableCell>
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
    </div>
  );
}
