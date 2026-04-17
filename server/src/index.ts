// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.get('/api/dashboard-summary', (req, res) => {
  res.json({
    criticalZones: 3,
    highRiskZones: 2,
    totalZones: 24,
    volunteersDeployed: 312,
    misallocated: 48,
    avgUrgency: 6.4,
    zones: [
      { id: 'A', urgency: 8.7, status: 'critical', needed: 8, deployed: 2 },
      { id: 'B', urgency: 3.1, status: 'medium' },
      { id: 'C', urgency: 2.2, status: 'stable' },
    ]
  });
});

app.post('/api/analyze-report', async (req, res) => {
  const { textContent } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze this NGO field report and return a JSON with: 
    urgency_score (1-10), skill_gap, and priority_level. Report: ${textContent}`;

  const result = await model.generateContent(prompt);
  res.send(result.response.text());
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));