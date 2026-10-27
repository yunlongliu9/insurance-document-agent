
import { z } from "zod";

// 定义运行时数据结构
export const invoiceValidator = z.object({
  documentType: z.string(),
  pharmacy: z.string().nullable(),
  date: z.string().nullable(),
  totalAmount: z.number().nullable(),
  currency: z.string().nullable(),
  medications: z.array(
    z.object({
      name: z.string(),
      price: z.number().nullable(),
    })
  ),
});

// 从 Schema 自动推导 TypeScript 类型
export type Invoice = z.infer<typeof invoiceValidator>;

// 验证模型返回的数据
export function validateInvoice(data: unknown): Invoice {
  return invoiceValidator.parse(data);
}