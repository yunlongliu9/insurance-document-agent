//  JSON Schema definition for invoice data

import { Type } from "@google/genai";

export const invoiceSchema = {
  type: Type.OBJECT,
  properties: {
    documentType: {
      type: Type.STRING,
      description: "Type of medical document",
    },
    pharmacy: {
      type: Type.STRING,
      nullable: true,
    },
    date: {
      type: Type.STRING,
      nullable: true,
      description: "Date in YYYY-MM-DD format",
    },
    totalAmount: {
      type: Type.NUMBER,
      nullable: true,
    },
    currency: {
      type: Type.STRING,
      nullable: true,
    },
    medications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          price: {
            type: Type.NUMBER,
            nullable: true,
          },
        },
        required: ["name", "price"],
      },
    },
  },
  required: [
    "documentType",
    "pharmacy",
    "date",
    "totalAmount",
    "currency",
    "medications",
  ],
};