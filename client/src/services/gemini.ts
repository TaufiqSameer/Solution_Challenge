const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface Zone {
  name: string
  lat: number
  lng: number
  urgencyScore: number
  volunteersDeployed: number
  volunteersNeeded: number
  needType: string
}

export interface GeminiResponse {
  zones: Zone[]
}

export async function parseReportWithGemini(csvText: string): Promise<GeminiResponse> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an NGO resource allocation analyst.
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
- Extract as many zones as present in the data`
            }]
          }]
        })
      }
    )

    const data = await response.json()

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'Gemini API error')
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean) as GeminiResponse

  } catch (err) {
    console.warn("Gemini unavailable, using mock data:", err)
    return {
      zones: [
        { name: "Zone A", lat: 19.076, lng: 72.877, urgencyScore: 9.1, volunteersDeployed: 2, volunteersNeeded: 10, needType: "Medical" },
        { name: "Zone B", lat: 19.056, lng: 72.857, urgencyScore: 3.2, volunteersDeployed: 8, volunteersNeeded: 4, needType: "Logistics" },
        { name: "Zone C", lat: 19.096, lng: 72.897, urgencyScore: 7.4, volunteersDeployed: 1, volunteersNeeded: 7, needType: "Education" },
        { name: "Zone D", lat: 19.036, lng: 72.837, urgencyScore: 1.8, volunteersDeployed: 5, volunteersNeeded: 5, needType: "Medical" },
        { name: "Zone E", lat: 19.116, lng: 72.917, urgencyScore: 8.6, volunteersDeployed: 1, volunteersNeeded: 9, needType: "Logistics" },
      ]
    }
  }
}