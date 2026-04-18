import type { Zone } from '../types'

interface Props {
  zones: Zone[]
}

function getColor(score: number) {
  if (score >= 8) return { bg: '#FCEBEB', text: '#A32D2D', label: 'Critical' }
  if (score >= 6) return { bg: '#FAEEDA', text: '#633806', label: 'High' }
  if (score >= 4) return { bg: '#FFF8E1', text: '#854F0B', label: 'Medium' }
  return { bg: '#E1F5EE', text: '#085041', label: 'Stable' }
}

export default function AlertPanel({ zones }: Props) {
  const sorted = [...zones].sort((a, b) => b.urgencyScore - a.urgencyScore)

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      maxHeight: '480px',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 500 }}>
        Misallocation alerts
      </h3>

      {zones.length === 0 && (
        <p style={{ fontSize: '13px', color: '#888' }}>
          Upload a report to see alerts
        </p>
      )}

      {sorted.map((zone, i) => {
        const c = getColor(zone.urgencyScore)
        return (
          <div key={i} style={{
            background: c.bg,
            borderLeft: `3px solid ${c.text}`,
            borderRadius: '8px',
            padding: '10px 12px',
            marginBottom: '8px'
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 500,
              color: c.text,
              marginBottom: '3px'
            }}>
              {zone.name} — {c.label}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              Urgency: {zone.urgencyScore}/10 · {zone.needType}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              Deployed: {zone.volunteersDeployed} · Needed: {zone.volunteersNeeded}
            </div>
          </div>
        )
      })}
    </div>
  )
}