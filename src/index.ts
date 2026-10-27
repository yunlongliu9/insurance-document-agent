
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// 1. 从环境变量读取 API Key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

// 2. 初始化 Gemini Client
const ai = new GoogleGenAI({ apiKey });

// 3. 调用大模型
async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "请用一句话解释什么是医疗账单信息提取。",
  });

  // 4. 输出模型回复
  console.log(response.text);
}

main().catch(console.error);