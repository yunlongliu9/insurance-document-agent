
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { readFile } from "node:fs/promises";

// 1. 从环境变量读取 API Key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

// 2. 初始化 Gemini Client
const ai = new GoogleGenAI({ apiKey });

// 3. 调用大模型
// 读取本地图片
async function main() {
  const image = await readFile("samples/invoice.jpeg");

  // 将图片编码为 Base64
  const base64Image = image.toString("base64");

  // 将图片和文字指令一起发送给 Gemini
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      {
        text: `请识别这张医疗票据中的信息。
        提取所有能够识别的字段及其对应值。
        保留原始德语字段名称。
        不要猜测无法辨认的内容。`,
      },
    ],
  });

  console.log(response.text);
}

main().catch(console.error);