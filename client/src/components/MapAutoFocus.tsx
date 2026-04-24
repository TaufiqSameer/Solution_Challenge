import { useEffect } from "react"
import L from "leaflet"
import type { Zone } from "../types"

interface Props {
  zone: Zone | null
  map: L.Map | null
}

export default function MapAutoFocus({ zone, map }: Props) {
  useEffect(() => {
    if (!zone || !map) return
    map.setView([zone.lat, zone.lng], 13, { animate: true })
  }, [zone, map])

  return null
}