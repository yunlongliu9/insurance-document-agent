
import { extractDocument } from "./agents/documentAgent.js";

async function main() {
  const result = await extractDocument("samples/invoice.jpeg");

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);