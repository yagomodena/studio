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
  companyName: z.string().describe('The name of the company.'),
  customerName: z.string().describe('The name of the customer.'),
  products: z
    .array(z.object({
      name: z.string().describe('The name of the product.'),
      quantity: z.number().describe('The quantity of the product.'),
      price: z.number().describe('The price of the product.'),
    }))
    .describe('The list of products purchased.'),
  totalAmount: z.number().describe('The total amount of the sale.'),
  date: z.string().describe('The date of the sale.'),
});
export type GenerateInformativeDocumentInput = z.infer<typeof GenerateInformativeDocumentInputSchema>;

const GenerateInformativeDocumentOutputSchema = z.object({
  documentText: z.string().describe('The generated informative document text.'),
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
  prompt: `You are an AI assistant specialized in generating informative sales documents, similar to a 'Nota Fiscal', for businesses.

  Generate a document based on the following information:

  Company Name: {{{companyName}}}
  Customer Name: {{{customerName}}}
  Date: {{{date}}}

  Products:
  {{#each products}}
  - Name: {{{name}}}, Quantity: {{{quantity}}}, Price: {{{price}}}
  {{/each}}

  Total Amount: {{{totalAmount}}}

  Ensure the document includes all provided details in a clear and organized manner. The document should look professional and be easy to understand.
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
