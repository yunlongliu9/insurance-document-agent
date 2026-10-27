
import { gemini } from "../config/gemini";
import { withRetry } from "./retry";
import type { GenerateContentParameters } from "@google/genai";

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-flash-latest",
];

export async function generateWithFallback(
  params: Omit<GenerateContentParameters, "model">
) {
  for (const [index, model] of MODELS.entries()) {
    try {
      console.log(`Using model: ${model}`);


      return await withRetry(() =>
        gemini.models.generateContent({
          ...params,
          model,
        })
      );
    } catch (error) {
      const status = (error as { status?: number }).status;

      // 非临时错误直接抛出，不切换模型
      if (![429, 500, 502, 503, 504].includes(status ?? 0)) {
        throw error;
      }

      if (index === MODELS.length - 1) {
        throw error;
      }

      console.warn(
        `Model ${model} unavailable. Switching to fallback model.`
      );
    }
  }

  throw new Error("All models failed");
}