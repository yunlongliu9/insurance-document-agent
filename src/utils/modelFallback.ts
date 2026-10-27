
import { gemini } from "../config/gemini.js";
import { withRetry } from "./retry.js";
import type { GenerateContentParameters } from "@google/genai";
import { withTimeout,TimeoutError } from "./timeout.js";
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
        withTimeout ((signal) => gemini.models.generateContent({
          ...params,
          model,
          config: {
                ...params.config,
                abortSignal: signal,
            },
        }),
        30000
        )
    );
        
    } catch (error) {
      const status = (error as { status?: number }).status;

     const isRecoverable = error instanceof TimeoutError ||
        [429, 500, 502, 503, 504].includes(status ?? 0);

        if (!isRecoverable) {
            throw error;
        }

      console.warn(
        `Model ${model} unavailable. Switching to fallback model.`
      );
    }
  }

  throw new Error("All models failed");
}