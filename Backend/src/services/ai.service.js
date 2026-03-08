import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({});

const systemInstructionPath = path.resolve(__dirname, "../prompts/systemPrompt.txt");
const systemInstruction = fs.readFileSync(systemInstructionPath, "utf-8");

async function generateResponse(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.5,
      topP: 0.95,
      systemInstruction
    }
  });
  return response.text;
}

export const generateVectors = async (contents) => {
  try {
    console.log(contents);

    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents,
      config: {
        outputDimensionality: 768
      }

    });

    return response.embeddings[0].values;

  } catch (error) {
    console.log(error);

  }
}

export default generateResponse;
