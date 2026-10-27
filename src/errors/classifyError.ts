
import { ZodError } from "zod";
import { AgentError } from "./agentError";
import { TimeoutError } from "../utils/timeout";

export function classifyError(error: unknown): AgentError {
  if (error instanceof AgentError) {
    return error;
  }

  if (error instanceof TimeoutError) {
    return new AgentError("TIMEOUT_ERROR", error.message, error);
  }

  if (error instanceof ZodError) {
    return new AgentError("SCHEMA_ERROR", error.message, error);
  }

  if (error instanceof SyntaxError) {
    return new AgentError("JSON_PARSE_ERROR", error.message, error);
  }

  if (error instanceof Error && "code" in error) {
    if (
      error.code === "ENOENT" ||
      error.code === "EACCES" ||
      error.code === "EISDIR"
    ) {
      return new AgentError("FILE_ERROR", error.message, error);
    }
  }

  const status =
    error !== null && typeof error === "object" && "status" in error
      ? error.status
      : undefined;

  if (typeof status === "number") {
    return new AgentError(
      "API_ERROR",
      `Gemini API failed with status ${status}`,
      error
    );
  }

  return new AgentError(
    "UNKNOWN_ERROR",
    error instanceof Error ? error.message : String(error),
    error
  );
}