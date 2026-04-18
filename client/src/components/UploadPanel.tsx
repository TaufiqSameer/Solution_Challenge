import { useState } from 'react'
import axios from 'axios'
import type { Zone } from '../types'

interface Props {
  onZonesLoaded: (zones: Zone[]) => void
}

export default function UploadPanel({ onZonesLoaded }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('http://localhost:3001/api/upload', formData)
      onZonesLoaded(res.data.zones)
    } catch (err) {
      setError('Failed to process file. Try again.')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px'
    }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 500 }}>
        Upload field report
      </h3>

      <label style={{
        display: 'block',
        border: '2px dashed #B5D4F4',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
        cursor: 'pointer',
        background: '#E6F1FB'
      }}>
        <input
          type="file"
          accept=".csv,.pdf,.txt"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        {loading
          ? '⏳ Processing with Gemini...'
          : fileName
          ? `✓ ${fileName}`
          : 'Click to upload CSV / PDF / TXT'
        }
      </label>

      {error && (
        <p style={{ color: '#A32D2D', fontSize: '13px', marginTop: '8px' }}>
          {error}
        </p>
      )}
    </div>
  )
}