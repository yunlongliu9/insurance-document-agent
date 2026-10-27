
import { ZodError } from "zod";
import { AgentError } from "./agentError";
import { TimeoutError } from "../utils/timeout";

export function classifyError(error: unknown): AgentError {
  // 已分类的错误直接返回
  if (error instanceof AgentError) {
    return error;
  }

  // 超时错误
  if (error instanceof TimeoutError) {
    return new AgentError(
      "TIMEOUT_ERROR",
      error.message,
      error
    );
  }

  // Zod Schema 验证失败
  if (error instanceof ZodError) {
    return new AgentError(
      "SCHEMA_ERROR",
      error.message,
      error
    );
  }

  // Gemini API 错误
  const status = (error as { status?: number } | null)?.status;

  if (typeof status === "number") {
    return new AgentError(
      "API_ERROR",
      `Gemini API failed with status ${status}`,
      error
    );
  }

  // 其他未识别错误
  return new AgentError(
    "API_ERROR",
    error instanceof Error ? error.message : String(error),
    error
  );
}

