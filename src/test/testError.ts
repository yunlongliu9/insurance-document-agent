
import { AgentError } from "../errors/agentError";
import { classifyError } from "../errors/classifyError";

const error = new AgentError(
  "BUSINESS_ERROR",
  "Invoice amount mismatch"
);

const classified = classifyError(error);

console.log(classified.code);
console.log(classified.message);