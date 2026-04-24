import { useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import HeatmapLayer from "./HeatmapLayer"
import MapAutoFocus from "./MapAutoFocus"
import type { Zone } from "../types"

// Fix leaflet default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

interface Props {
  zones: Zone[]
  criticalZone: Zone | null
  prescription: string
}

export default function ZoneMap({ zones, criticalZone, prescription }: Props) {
  const mapRef = useRef<L.Map | null>(null)

  return (
    <div style={{ height: "420px" }} className="rounded-xl overflow-hidden relative">
      <MapContainer
        center={[19.0760, 72.8777]}
        zoom={11}
        ref={mapRef}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatmapLayer zones={zones} map={mapRef.current} />
        <MapAutoFocus zone={criticalZone} map={mapRef.current} />

        {zones.map((z, i) =>
          z.lat && z.lng ? (
            <Marker key={i} position={[z.lat, z.lng]}>
              <Popup>
                <strong>{z.name}</strong><br />
                Urgency: {z.urgencyScore}/10<br />
                {z.volunteersDeployed}/{z.volunteersNeeded}<br />
                Need: {z.needType}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>

      {criticalZone && (
        <div className="absolute bottom-4 left-4 bg-black/80 p-4 rounded-xl text-white w-72 shadow-xl border border-red-500/30 z-[1000]">
          <p className="text-xs text-red-400 font-bold mb-1">CRITICAL ALERT</p>
          <p className="text-sm font-semibold">{criticalZone.name}</p>
          <p className="text-xs opacity-70 mt-1">{prescription}</p>
        </div>
      )}
    </div>
  )
}