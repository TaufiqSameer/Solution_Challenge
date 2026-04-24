import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parseReportWithGemini } from '../src/services/gemini'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { csvText } = req.body

    if (!csvText) {
      return res.status(400).json({ error: 'No CSV text provided' })
    }

    let result
    try {
      result = await parseReportWithGemini(csvText)
    } catch (firstErr) {
      console.warn("First attempt failed, retrying in 3s...")
      await new Promise(r => setTimeout(r, 3000))
      result = await parseReportWithGemini(csvText)
    }

    res.status(200).json(result)

  } catch (err: any) {
    console.error("Upload error:", err.message)
    res.status(500).json({ error: err.message || 'Failed to process file' })
  }
}