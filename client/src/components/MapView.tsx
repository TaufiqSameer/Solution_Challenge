/// <reference types="@types/google.maps" />
import { useEffect, useRef } from 'react'
import type { Zone } from '../types'

interface Props {
  zones: Zone[]
}

const loadGoogleMaps = (apiKey: string): Promise<void> => {
  return new Promise((resolve) => {
    if (window.google?.maps) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

export default function MapView({ zones }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
    loadGoogleMaps(apiKey).then(() => {
      if (!mapRef.current) return
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 19.0760, lng: 72.8777 },
        zoom: 11,
      })
    })
  }, [])

  useEffect(() => {
    if (!mapInstance.current || zones.length === 0) return

    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    zones.forEach(zone => {
      const color =
        zone.urgencyScore >= 8 ? '#E24B4A' :
        zone.urgencyScore >= 6 ? '#EF9F27' :
        zone.urgencyScore >= 4 ? '#BA7517' : '#1D9E75'

      const marker = new window.google.maps.Marker({
        position: { lat: zone.lat, lng: zone.lng },
        map: mapInstance.current!,
        title: zone.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 20 + zone.urgencyScore * 2,
          fillColor: color,
          fillOpacity: 0.7,
          strokeColor: color,
          strokeWeight: 1.5
        }
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:sans-serif;padding:8px">
            <strong>${zone.name}</strong><br/>
            Urgency: ${zone.urgencyScore}/10<br/>
            Need: ${zone.needType}<br/>
            Deployed: ${zone.volunteersDeployed} / Needed: ${zone.volunteersNeeded}
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker)
      })

      markersRef.current.push(marker)
    })

    const bounds = new window.google.maps.LatLngBounds()
    zones.forEach(z => bounds.extend({ lat: z.lat, lng: z.lng }))
    mapInstance.current.fitBounds(bounds)

  }, [zones])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', borderRadius: '12px' }}
    />
  )
}