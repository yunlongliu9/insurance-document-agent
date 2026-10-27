
import { classifyError } from "../errors/classifyError";
import { AgentError } from "../errors/agentError";

const errors = [
  new AgentError("BUSINESS_ERROR", "Amount mismatch"),
  new SyntaxError("Invalid JSON"),
  Object.assign(new Error("File not found"), { code: "ENOENT" }),
  Object.assign(new Error("Service unavailable"), { status: 503 }),
  new Error("Unexpected failure"),
];

for (const error of errors) {
  const classified = classifyError(error);
  console.log(classified.code);
}