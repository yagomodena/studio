import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle, PlusCircle } from "lucide-react";

const transactions = [
  { date: "2023-11-23", description: "Venda - Pedido #3124", type: "Receita", amount: "R$1999.00" },
  { date: "2023-11-22", description: "Pagamento de Fornecedor", type: "Despesa", amount: "-R$800.00" },
  { date: "2023-11-22", description: "Venda - Pedido #3123", type: "Receita", amount: "R$39.00" },
  { date: "2023-11-21", description: "Aluguel do Escritório", type: "Despesa", amount: "-R$2500.00" },
  { date: "2023-11-20", description: "Venda - Pedido #3122", type: "Receita", amount: "R$299.00" },
];

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Financeiro</h1>
        <div className="flex gap-2">
            <Button variant="outline">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Adicionar Receita
            </Button>
            <Button variant="outline">
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Adicionar Despesa
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa</CardTitle>
          <CardDescription>Acompanhe todas as suas transações financeiras.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <span className={`flex items-center ${transaction.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'Receita' ? <ArrowUpCircle className="mr-2 h-4 w-4" /> : <ArrowDownCircle className="mr-2 h-4 w-4" />}
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${transaction.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>{transaction.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
