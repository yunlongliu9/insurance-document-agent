// read file and encode it to base64

import { readFile } from "node:fs/promises";
import { extname } from "node:path";

export interface DocumentFile {
  mimeType: string;
  data: string;
}

const mimeTypes: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
};

export async function loadDocument(
  filePath: string
): Promise<DocumentFile> {
  // 1. 获取文件扩展名
  const extension = extname(filePath).toLowerCase();

  // 2. 判断 MIME Type
  const mimeType = mimeTypes[extension];

  if (!mimeType) {
    throw new Error(`Unsupported file type: ${extension}`);
  }

  // 3. 读取文件二进制内容
  const buffer = await readFile(filePath);

  // 4. 转换为 Base64
  return {
    mimeType,
    data: buffer.toString("base64"),
  };
}