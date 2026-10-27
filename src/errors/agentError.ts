
export type AgentErrorCode =
  | "API_ERROR"
  | "TIMEOUT_ERROR"
  | "SCHEMA_ERROR"
  | "BUSINESS_ERROR";

export class AgentError extends Error {
  constructor(
    public readonly code: AgentErrorCode,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AgentError";
  }
}
