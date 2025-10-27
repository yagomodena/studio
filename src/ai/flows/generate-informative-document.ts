'use server';

/**
 * Gera um documento informativo de venda (não fiscal) com dois formatos:
 * - "whatsapp" → texto simplificado e organizado para envio de mensagem.
 * - "print" → layout bonito para impressão em A4 (com cabeçalho e rodapé).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateInformativeDocumentInputSchema = z.object({
  companyName: z.string().describe('Nome da empresa.'),
  customerName: z.string().describe('Nome do cliente.'),
  products: z
    .array(z.object({
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
    }))
    .describe('Lista de produtos comprados.'),
  totalAmount: z.number().describe('Valor total da venda.'),
  date: z.string().describe('Data da venda.'),
  format: z.enum(['whatsapp', 'print']).default('whatsapp').describe('Formato do documento.'),
});
export type GenerateInformativeDocumentInput = z.infer<typeof GenerateInformativeDocumentInputSchema>;

const GenerateInformativeDocumentOutputSchema = z.object({
  documentText: z.string(),
});
export type GenerateInformativeDocumentOutput = z.infer<typeof GenerateInformativeDocumentOutputSchema>;

export async function generateInformativeDocument(
  input: GenerateInformativeDocumentInput
): Promise<GenerateInformativeDocumentOutput> {
  return generateInformativeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInformativeDocumentPrompt',
  input: { schema: GenerateInformativeDocumentInputSchema },
  output: { schema: GenerateInformativeDocumentOutputSchema },
  prompt: `
Você é um assistente de IA especializado em gerar documentos informativos de vendas (não fiscais).
Gere o documento com base nos dados abaixo e formate conforme o formato escolhido.

---

{{#if (eq format "whatsapp")}}
Gere um texto limpo e organizado, ideal para enviar no WhatsApp, seguindo o modelo abaixo:

"Olá {{{customerName}}}, obrigado pela sua compra na {{{companyName}}}! Seguem os detalhes:

DOCUMENTO DE VENDA

Empresa: {{{companyName}}}
Cliente: {{{customerName}}}
Data: {{{date}}}

PRODUTOS
{{#each products}}
Item: {{{name}}}
Quantidade: {{{quantity}}}
Preço Unitário: R$ {{{price}}}
Total do Item: R$ {{multiply quantity price}}
{{/each}}

RESUMO
Valor Total: R$ {{{totalAmount}}}

Observação: Este documento é apenas informativo e **não possui valor fiscal**."
{{else}}
Gere uma versão bonita para impressão (A4), com:
- Cabeçalho com o nome da empresa e logotipo genérico.
- Corpo centralizado com título "Documento Informativo de Venda".
- Seções bem espaçadas (dados da empresa, cliente, produtos, resumo financeiro).
- Rodapé com observação "Documento sem valor fiscal".
- Use formatação visual como se fosse HTML simples com estilos inline.

Exemplo de estrutura (em HTML básico):

<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
      header { text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 10px; margin-bottom: 30px; }
      header h1 { margin: 0; font-size: 24px; color: #2b2b2b; }
      section { margin-bottom: 25px; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      table, th, td { border: 1px solid #ddd; }
      th, td { padding: 10px; text-align: left; }
      footer { text-align: center; border-top: 2px solid #ccc; padding-top: 10px; font-size: 12px; color: #777; }
    </style>
  </head>
  <body>
    <header>
      <h1>{{{companyName}}}</h1>
      <p>Documento Informativo de Venda</p>
    </header>

    <section>
      <strong>Cliente:</strong> {{{customerName}}}<br/>
      <strong>Data:</strong> {{{date}}}
    </section>

    <section>
      <h3>Produtos</h3>
      <table>
        <tr><th>Produto</th><th>Qtd.</th><th>Preço Unitário</th><th>Total</th></tr>
        {{#each products}}
        <tr>
          <td>{{{name}}}</td>
          <td>{{{quantity}}}</td>
          <td>R$ {{{price}}}</td>
          <td>R$ {{multiply quantity price}}</td>
        </tr>
        {{/each}}
      </table>
    </section>

    <section>
      <h3>Resumo Financeiro</h3>
      <p><strong>Valor Total:</strong> R$ {{{totalAmount}}}</p>
    </section>

    <footer>
      Este documento é apenas informativo e não possui valor fiscal.
    </footer>
  </body>
</html>
{{/if}}
  `,
});

const generateInformativeDocumentFlow = ai.defineFlow(
  {
    name: 'generateInformativeDocumentFlow',
    inputSchema: GenerateInformativeDocumentInputSchema,
    outputSchema: GenerateInformativeDocumentOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
