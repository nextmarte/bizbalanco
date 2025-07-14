
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
    
    // The history of the conversation, excluding the most recent message.
    const history = input.messages.slice(0, -1).map(m => ({
        role: m.role,
        content: [{ text: m.content }],
    }));
    
    // The most recent message from the user.
    const lastUserMessage = input.messages[input.messages.length - 1]?.content || '';

    const systemPrompt = `Você é o "BizBalance AI", um assistente financeiro amigável e prestativo. Sua tarefa é ajudar o usuário a entender suas finanças com base nas transações fornecidas. Seja conciso, útil e use um tom conversacional.

Aqui estão as transações do usuário no formato JSON. Use-as para responder a quaisquer perguntas que o usuário tenha sobre suas finanças:
\`\`\`json
${input.transactions}
\`\`\`
`;

    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      history: history,
      system: systemPrompt,
      prompt: lastUserMessage,
    });
    
    return {
        response: llmResponse.text
    };
  }
);
