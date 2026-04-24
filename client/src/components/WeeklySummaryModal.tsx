import { X } from "lucide-react"
import type { Zone } from "../types"

interface Props {
  zones: Zone[]
  onClose: () => void
}

export default function WeeklySummaryModal({ zones, onClose }: Props) {
  const criticalCount = zones.filter((z) => z.urgencyScore >= 8).length
  const misallocated = zones.filter(
    (z) => Math.abs(z.volunteersDeployed - z.volunteersNeeded) > 2
  ).length
  const totalDeployed = zones.reduce((s, z) => s + z.volunteersDeployed, 0)

  return (
    <div
    className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#161920] border border-white/10 rounded-2xl w-full max-w-2xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-2">Weekly Summary</h2>
        <p className="text-slate-500 text-sm mb-6">
          Current allocation status across all zones
        </p>

        {zones.length === 0 ? (
          <p className="text-slate-500 text-sm">No data loaded. Upload a report first.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="text-left pb-3">Zone</th>
                <th className="text-left pb-3">Need Type</th>
                <th className="text-left pb-3">Deployed</th>
                <th className="text-left pb-3">Needed</th>
                <th className="text-left pb-3">Urgency</th>
                <th className="text-left pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...zones]
                .sort((a, b) => b.urgencyScore - a.urgencyScore)
                .map((zone, i) => {
                  const gap = zone.volunteersNeeded - zone.volunteersDeployed
                  const status =
                    zone.urgencyScore >= 8 ? "Critical" :
                    zone.urgencyScore >= 6 ? "High Risk" :
                    gap < -2 ? "Overstaffed" : "Stable"
                  const statusColor =
                    status === "Critical" ? "text-red-400" :
                    status === "High Risk" ? "text-orange-400" :
                    status === "Overstaffed" ? "text-blue-400" :
                    "text-emerald-400"

                  return (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3 font-medium text-white">{zone.name}</td>
                      <td className="py-3 text-slate-400">{zone.needType}</td>
                      <td className="py-3 text-slate-400">{zone.volunteersDeployed}</td>
                      <td className="py-3 text-slate-400">{zone.volunteersNeeded}</td>
                      <td className="py-3">
                        <span className={`font-bold ${
                          zone.urgencyScore >= 8 ? "text-red-400" :
                          zone.urgencyScore >= 6 ? "text-orange-400" :
                          "text-emerald-400"
                        }`}>
                          {zone.urgencyScore}/10
                        </span>
                      </td>
                      <td className={`py-3 font-semibold text-xs ${statusColor}`}>
                        {status}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        )}

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
            <p className="text-xs text-slate-500 mt-1">Critical zones</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">{misallocated}</p>
            <p className="text-xs text-slate-500 mt-1">Misallocated</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{totalDeployed}</p>
            <p className="text-xs text-slate-500 mt-1">Total deployed</p>
          </div>
        </div>
      </div>
    </div>
  )
}