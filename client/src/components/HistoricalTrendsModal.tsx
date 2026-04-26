import { X } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell
} from "recharts"
import type { Zone } from "../types"

interface Props {
  zones: Zone[]
  onClose: () => void
}

export default function HistoricalTrendsModal({ zones, onClose }: Props) {
  const data = zones.length > 0
    ? zones.map((z) => ({
        name: z.name,
        "Week 1": +(z.urgencyScore - 2 + Math.random()).toFixed(1),
        "Week 2": +(z.urgencyScore - 1 + Math.random()).toFixed(1),
        "Week 3": +(z.urgencyScore - 0.5 + Math.random() * 0.5).toFixed(1),
        "Current": z.urgencyScore,
      }))
    : [
        { name: "Zone A", "Week 1": 4.2, "Week 2": 6.1, "Week 3": 7.8, "Current": 9.1 },
        { name: "Zone B", "Week 1": 5.1, "Week 2": 4.3, "Week 3": 3.8, "Current": 3.2 },
        { name: "Zone C", "Week 1": 3.2, "Week 2": 5.4, "Week 3": 6.9, "Current": 7.4 },
      ]

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
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

        <h2 className="text-xl font-semibold text-white mb-2">Historical Trends</h2>
        <p className="text-slate-500 text-sm mb-6">
          Urgency score progression over 4 weeks
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barGap={2}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1e2028",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="Week 1" fill="#334155" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Week 2" fill="#475569" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Week 3" fill="#EF9F27" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Current" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry["Current"] >= 8 ? "#E24B4A" :
                    entry["Current"] >= 6 ? "#EF9F27" :
                    "#1D9E75"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#334155] inline-block"></span>Week 1
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#475569] inline-block"></span>Week 2
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#EF9F27] inline-block"></span>Week 3
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#E24B4A] inline-block"></span>Current
          </span>
        </div>
      </div>
    </div>
  )
}