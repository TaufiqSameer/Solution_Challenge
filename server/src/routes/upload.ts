import express from 'express'
import multer from 'multer'
import { parseReportWithGemini } from '../services/gemini'

const zoneCoordinates: Record<string, { lat: number; lng: number }> = {
  Andheri: { lat: 19.1136, lng: 72.8697 },
  Bandra: { lat: 19.0596, lng: 72.8295 },
  Dadar: { lat: 19.0176, lng: 72.8562 },
  Kurla: { lat: 19.0728, lng: 72.8826 },
  Thane: { lat: 19.2183, lng: 72.9781 },
};
const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const csvText = req.file.buffer.toString('utf-8')
    const result = await parseReportWithGemini(csvText);


    const zonesWithCoords = result.zones.map((z: any) => {
      const fallback = {
        lat: 19.0760 + (Math.random() - 0.5) * 0.1,
        lng: 72.8777 + (Math.random() - 0.5) * 0.1,
      };
    
    
      let lat = z.lat;
      let lng = z.lng;
    
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        const coords = zoneCoordinates[z.name?.trim()];
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        } else {
          lat = fallback.lat;
          lng = fallback.lng;
        }
      }
    
      return {
        ...z,
        lat,
        lng,
      };
    });
    
    res.json({
      ...result,
      zones: zonesWithCoords,
    });

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to process file' })
  }
})

export default router