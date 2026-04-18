import express from 'express'
import cors from 'cors'
import uploadRouter from './routes/upload'
import dotenv from "dotenv";

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', uploadRouter)
console.log("API KEY:",process.env.GEMINI_API_KEY)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})