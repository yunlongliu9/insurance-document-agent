// doc understanding logic

import { gemini } from "../config/gemini.js";
import { invoiceSchema } from "../schemas/invoiceSchema.js";
import { loadDocument } from "../utils/file.js";
import {invoiceValidator} from "../validators/invoiceValidator.js";

export async function extractDocument(filePath: string) {
  // 1. 读取文件并转换为 Gemini 支持的格式
  const file = await loadDocument(filePath);

  // 2. 调用 Gemini 进行文档理解
  const response = await gemini.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        inlineData: file,
      },
      {
        text: `Extract structured information from this
        German medical document.

        Identify the document type, pharmacy,
        date, total amount, and medications.

        Do not invent missing information.
        Use null for unknown values when allowed.
        Return only information supported by the document.`,
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: invoiceSchema,
    },
  });

  // 3. 检查模型是否返回内容
  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  // 4. 将 JSON 字符串解析为 JavaScript 对象
  const parsed:unknown = JSON.parse(response.text);
  return invoiceValidator.validateInvoice(parsed);
}