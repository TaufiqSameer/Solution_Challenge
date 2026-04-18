import axios from "axios";
import { GeminiResponse } from "../types/index";

export async function parseReportWithGemini(
  csvText: string
): Promise<GeminiResponse> {
  console.log("USING KEY:", `[${process.env.GEMINI_API_KEY}]`);

  const prompt = `
You are an NGO resource allocation analyst.
Given this field report data, extract zone information and return ONLY a JSON object.
No explanation, no markdown, just raw JSON.

Data:
${csvText}

Return this exact format:
{
  "zones": [
    {
      "name": "Zone A",
      "lat": 19.0760,
      "lng": 72.8777,
      "urgencyScore": 8.5,
      "volunteersDeployed": 3,
      "volunteersNeeded": 10,
      "needType": "Medical"
    }
  ]
}

Rules:
- urgencyScore is 1-10 based on how critical the need is
- If lat/lng not in data, generate realistic coordinates near Mumbai
- Extract as many zones as present in the data
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY?.trim()}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    
    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("RAW GEMINI RESPONSE:", text);

    const clean = text.replace(/```json|```/g, "").trim();

    
    return JSON.parse(clean) as GeminiResponse;

  } catch (error: any) {
    console.error("Gemini API Error:", error?.response?.data || error.message);

    throw new Error(
      error?.response?.data?.error?.message ||
      "Failed to parse report with Gemini"
    );
  }
}