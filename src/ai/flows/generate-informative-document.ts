'use server';

/**
 * @fileOverview A flow for generating an informative sales document similar to a 'Nota Fiscal'.
 *
 * - generateInformativeDocument - A function that handles the document generation process.
 * - GenerateInformativeDocumentInput - The input type for the generateInformativeDocument function.
 * - GenerateInformativeDocumentOutput - The return type for the generateInformativeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInformativeDocumentInputSchema = z.object({
  companyName: z.string().describe('O nome da empresa.'),
  customerName: z.string().describe('O nome do cliente.'),
  products: z
    .array(z.object({
      name: z.string().describe('O nome do produto.'),
      quantity: z.number().describe('A quantidade do produto.'),
      price: z.number().describe('O preço do produto.'),
    }))
    .describe('A lista de produtos comprados.'),
  totalAmount: z.number().describe('O valor total da venda.'),
  date: z.string().describe('A data da venda.'),
});
export type GenerateInformativeDocumentInput = z.infer<typeof GenerateInformativeDocumentInputSchema>;

const GenerateInformativeDocumentOutputSchema = z.object({
  documentText: z.string().describe('O texto do documento informativo gerado.'),
});
export type GenerateInformativeDocumentOutput = z.infer<typeof GenerateInformativeDocumentOutputSchema>;

export async function generateInformativeDocument(
  input: GenerateInformativeDocumentInput
): Promise<GenerateInformativeDocumentOutput> {
  return generateInformativeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInformativeDocumentPrompt',
  input: {schema: GenerateInformativeDocumentInputSchema},
  output: {schema: GenerateInformativeDocumentOutputSchema},
  prompt: `Você é um assistente de IA especializado em gerar documentos de vendas informativos, semelhante a uma 'Nota Fiscal', para empresas.

  Gere um documento com base nas seguintes informações:

  **Dados da Empresa:**
  Nome: {{{companyName}}}

  **Dados do Cliente:**
  Nome: {{{customerName}}}
  
  **Detalhes da Transação:**
  Data: {{{date}}}

  **Produtos:**
  {{#each products}}
  - Produto: {{{name}}}
    Quantidade: {{{quantity}}}
    Preço Unitário: R$ {{{price}}}
  {{/each}}

  **Resumo Financeiro:**
  Valor Total: R$ {{{totalAmount}}}

  Observação: Este documento não possui valor fiscal.
  
  Certifique-se de que o documento inclua todos os detalhes fornecidos de maneira clara e organizada. O documento deve parecer profissional e ser fácil de entender.
  `,
});

const generateInformativeDocumentFlow = ai.defineFlow(
  {
    name: 'generateInformativeDocumentFlow',
    inputSchema: GenerateInformativeDocumentInputSchema,
    outputSchema: GenerateInformativeDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
