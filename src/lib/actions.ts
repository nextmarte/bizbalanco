"use server";

import { categorizeTransaction } from "@/ai/flows/categorize-transaction";

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
