import express from 'express'
import multer from 'multer'
import { parseReportWithGemini } from '../services/gemini'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const csvText = req.file.buffer.toString('utf-8')
    const result = await parseReportWithGemini(csvText)
    res.json(result)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to process file' })
  }
})

export default router