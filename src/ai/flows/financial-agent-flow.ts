
'use server';
/**
 * @fileOverview Um agente de IA que conversa sobre as transações financeiras do usuário.
 * 
 * - converseWithAgent - Uma função que lida com a conversa do agente financeiro.
 * - FinancialAgentInput - O tipo de entrada para a função converseWithAgent.
 * - FinancialAgentOutput - O tipo de retorno para a função converseWithAgent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const FinancialAgentInputSchema = z.object({
  messages: z.array(MessageSchema).describe('O histórico da conversa até agora.'),
  transactions: z.string().describe('Um resumo em string JSON das transações financeiras do usuário.'),
});
export type FinancialAgentInput = z.infer<typeof FinancialAgentInputSchema>;

const FinancialAgentOutputSchema = z.object({
  response: z.string().describe('A resposta do agente de IA.'),
});
export type FinancialAgentOutput = z.infer<typeof FinancialAgentOutputSchema>;


export async function converseWithAgent(input: FinancialAgentInput): Promise<FinancialAgentOutput> {
  return financialAgentFlow(input);
}


const financialAgentFlow = ai.defineFlow(
  {
    name: 'financialAgentFlow',
    inputSchema: FinancialAgentInputSchema,
    outputSchema: FinancialAgentOutputSchema,
  },
  async (input) => {
    const prompt = `Você é o "BizBalance AI", um assistente financeiro amigável e prestativo. Sua tarefa é ajudar o usuário a entender suas finanças com base nas transações fornecidas. Seja conciso, útil e use um tom conversacional.

Aqui estão as transações do usuário no formato JSON:
\`\`\`json
{{{transactions}}}
\`\`\`

Histórico da conversa atual:
{{#each messages}}
{{#if (eq role 'user')}}
Usuário: {{{content}}}
{{else}}
Assistente: {{{content}}}
{{/if}}
{{/each}}
Assistente:`;

    const llmResponse = await ai.generate({
      prompt: prompt,
      history: input.messages.map(m => ({ role: m.role, content: [{ text: m.content }] })),
      model: 'googleai/gemini-2.0-flash',
      context: {
        transactions: input.transactions,
        messages: input.messages,
      }
    });
    
    return {
        response: llmResponse.text
    };
  }
);
