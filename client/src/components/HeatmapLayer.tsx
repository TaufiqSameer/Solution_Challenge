import { useEffect } from "react"
import L from "leaflet"
import "leaflet.heat"
import type { Zone } from "../types"

interface Props {
  zones: Zone[]
  map: L.Map | null
}

export default function HeatmapLayer({ zones, map }: Props) {
  useEffect(() => {
    if (!zones.length || !map) return

    const heatPoints = zones.map((z) => [z.lat, z.lng, z.urgencyScore / 10])
    const heat = (L as any).heatLayer(heatPoints, {
      radius: 25,
      blur: 20,
      maxZoom: 17,
    })

    heat.addTo(map)
    return () => { heat.remove() }
  }, [zones, map])

  return null
}