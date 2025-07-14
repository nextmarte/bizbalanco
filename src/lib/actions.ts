
"use server";

import { categorizeTransaction } from "@/ai/flows/categorize-transaction";
import { converseWithAgent } from "@/ai/flows/financial-agent-flow";
import type { Transaction } from "./types";

export async function suggestCategoryAction(
  description: string,
  existingCategories: string[]
): Promise<string> {
  if (!description) {
    return "";
  }

  try {
    const result = await categorizeTransaction({ description, existingCategories });
    return result.suggestedCategory;
  } catch (error) {
    console.error("Error suggesting category:", error);
    // In case of an error, we can return an empty string or a default category
    return "";
  }
}

export async function converseWithAgentAction(
  messages: Array<{ role: "user" | "model"; content: string }>,
  transactions: Transaction[]
): Promise<string> {
  try {
    const transactionsJson = JSON.stringify(
      transactions.map(t => ({...t, date: t.date.toISOString().split('T')[0]})),
      null,
      2
    );

    const result = await converseWithAgent({
      messages,
      transactions: transactionsJson,
    });
    return result.response;
  } catch (error) {
    console.error("Error in agent conversation action:", error);
    return "Desculpe, ocorreu um erro ao me comunicar com o assistente. Por favor, tente novamente.";
  }
}
