'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateInformativeDocument } from '@/ai/flows/generate-informative-document';
import { useState } from 'react';
import { FileText, Loader2, PlusCircle, Trash2, Wand2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const productSchema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório.'),
  quantity: z.coerce.number().min(1, 'Quantidade deve ser no mínimo 1.'),
  price: z.coerce.number().min(0.01, 'Preço deve ser positivo.'),
});

const formSchema = z.object({
  companyName: z.string().min(1, 'Nome da empresa é obrigatório.'),
  customerName: z.string().min(1, 'Nome do cliente é obrigatório.'),
  products: z.array(productSchema).min(1, 'Adicione pelo menos um produto.'),
});

type FormData = z.infer<typeof formSchema>;

export default function DocumentGeneratorPage() {
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      customerName: '',
      products: [{ name: '', quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedDocument(null);

    const totalAmount = data.products.reduce((acc, product) => acc + product.price * product.quantity, 0);

    try {
      const result = await generateInformativeDocument({
        ...data,
        totalAmount,
        date: new Date().toLocaleDateString('pt-BR'),
      });
      setGeneratedDocument(result.documentText);
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao gerar o documento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Gerador de Documento Informativo</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Venda</CardTitle>
            <CardDescription>Preencha os dados abaixo para gerar o documento com IA.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da sua Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua Empresa LTDA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="mb-2 block">Produtos</Label>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="p-4 bg-muted/50">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`products.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="sm:col-span-3">
                                <FormLabel>Nome do Produto</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Laptop Pro" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`products.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Qtd.</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`products.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preço (Un.)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           {fields.length > 1 && (
                             <div className="flex items-end">
                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                             </div>
                           )}
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ name: '', quantity: 1, price: 0 })}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Produto
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Gerar Documento
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documento Gerado</CardTitle>
            <CardDescription>O conteúdo gerado pela IA aparecerá aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {generatedDocument && (
              <div className="prose prose-sm dark:prose-invert max-w-none bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap font-sans text-sm">{generatedDocument}</pre>
              </div>
            )}
            {!isLoading && !generatedDocument && !error && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">Seu documento aparecerá aqui.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
