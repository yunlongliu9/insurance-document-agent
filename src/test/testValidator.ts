
import { readFile } from "node:fs/promises";
import { validateInvoice } from "../validators/invoiceValidator";

async function main() {
  const content = await readFile(
    "samples/invoice-result.json",
    "utf-8"
  );

  const data: unknown = JSON.parse(content);

  const invoice = validateInvoice(data);

  console.log("Validation successful!");
  console.log(invoice);
}

main().catch(console.error);
