import { useState } from "react";
import {
  Map as MapIcon,
  Upload,
  Activity,
  ShieldAlert,
  FileText,
  ChevronRight,
} from "lucide-react";
import type { Zone } from "../types";
import axios from "axios";

const Dashboard = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3001/api/upload", formData);
      const fetchedZones: Zone[] = res.data.zones;
      setZones(fetchedZones);

      const critical = [...fetchedZones].sort(
        (a, b) => b.urgencyScore - a.urgencyScore
      )[0];
      const overStaffed = [...fetchedZones].sort(
        (a, b) =>
          b.volunteersDeployed - b.volunteersNeeded -
          (a.volunteersDeployed - a.volunteersNeeded)
      )[0];

      if (critical && overStaffed && critical.name !== overStaffed.name) {
        const gap = critical.volunteersNeeded - critical.volunteersDeployed;
        setPrescription(
          `Move ${gap} volunteers from ${overStaffed.name} to ${critical.name} immediately. ` +
          `${critical.name} has a ${critical.needType} gap with urgency score ${critical.urgencyScore}/10.`
        );
      } else if (critical) {
        const gap = critical.volunteersNeeded - critical.volunteersDeployed;
        setPrescription(
          `${critical.name} needs ${gap} more volunteers urgently. ` +
          `Current urgency score: ${critical.urgencyScore}/10. Need type: ${critical.needType}.`
        );
      }
    } catch (err : any) {
        console.error(err);
        alert(err?.response?.data?.message || "Backend error");
  
    } finally {
      setLoading(false);
    }
  };

  const criticalZone = [...zones].sort(
    (a, b) => b.urgencyScore - a.urgencyScore
  )[0];

  const totalDeployed = zones.reduce((s, z) => s + z.volunteersDeployed, 0);
  const misallocated = zones.filter(
    (z) => Math.abs(z.volunteersDeployed - z.volunteersNeeded) > 2
  ).length;
  const avgUrgency =
    zones.length > 0
      ? (zones.reduce((s, z) => s + z.urgencyScore, 0) / zones.length).toFixed(1)
      : "—";
  const criticalCount = zones.filter((z) => z.urgencyScore >= 8).length;
  const highCount = zones.filter(
    (z) => z.urgencyScore >= 6 && z.urgencyScore < 8
  ).length;
  const pendingActions = zones.filter((z) => z.urgencyScore >= 6).length;

  return (
    <div className="flex h-screen bg-[#0f1115] text-slate-200 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#161920] flex flex-col border-r border-white/5">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            Resource<span className="text-blue-500">IQ</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-8">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
              Navigation
            </p>
            <div className="space-y-1">
              <NavItem icon={<MapIcon size={20} />} label="Heatmap" active />
              <NavItem icon={<Activity size={20} />} label="Zone Details" />
              <NavItem icon={<Upload size={20} />} label="Upload Data" />
            </div>
          </div>

          {/* Upload section in sidebar */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
              Data Input
            </p>
            <div className="px-4">
              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-full border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-xl p-4 text-center transition-all">
                  {loading ? (
                    <p className="text-blue-400 text-xs animate-pulse">
                      Processing with Gemini...
                    </p>
                  ) : fileName ? (
                    <p className="text-emerald-400 text-xs">✓ {fileName}</p>
                  ) : (
                    <>
                      <Upload size={20} className="mx-auto mb-2 text-slate-500" />
                      <p className="text-slate-500 text-xs">
                        Upload CSV / TXT report
                      </p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
              Reports
            </p>
            <div className="space-y-1">
              <NavItem icon={<FileText size={20} />} label="Weekly Summary" />
              <NavItem icon={<Activity size={20} />} label="Historical Trends" />
            </div>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#161920]/50">
          <h2 className="text-xl font-semibold text-white">
            Coordinator Dashboard
          </h2>
          <div className="flex gap-3">
            {criticalCount > 0 && (
              <StatusBadge
                label={`${criticalCount} critical`}
                color="bg-red-500/10 text-red-500 border-red-500/20"
              />
            )}
            {highCount > 0 && (
              <StatusBadge
                label={`${highCount} high risk`}
                color="bg-orange-500/10 text-orange-400 border-orange-500/20"
              />
            )}
            <StatusBadge
              label="System Live"
              color="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              dot
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* METRICS */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              label="Total Zones"
              value={zones.length || "—"}
              sub={criticalCount > 0 ? `${criticalCount} Critical` : "No data yet"}
              subColor={criticalCount > 0 ? "text-red-500" : "text-slate-500"}
            />
            <MetricCard
              label="Volunteers Deployed"
              value={totalDeployed || "—"}
              sub={misallocated > 0 ? `${misallocated} zones misallocated` : "No data yet"}
              subColor={misallocated > 0 ? "text-orange-400" : "text-slate-500"}
            />
            <MetricCard
              label="Avg Urgency Score"
              value={avgUrgency}
              sub={zones.length > 0 ? "Across all zones" : "No data yet"}
              subColor="text-red-400"
            />
            <MetricCard
              label="Actions Pending"
              value={pendingActions || "—"}
              sub="AI Prescriptions"
              subColor="text-blue-400"
            />
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* ZONES PANEL */}
            <div className="col-span-8 bg-[#161920] rounded-2xl border border-white/5 p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Demand-supply gap — zone view
                  </h3>
                  <p className="text-sm text-slate-500">
                    {zones.length > 0
                      ? `${zones.length} zones loaded`
                      : "Upload a report to see zones"}
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Critical 8+
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span> High 6–8
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Stable
                  </span>
                </div>
              </div>

              {zones.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-600 text-sm">
                  No zones loaded — upload a CSV to begin
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 justify-start">
                  {zones.map((zone, i) => (
                    <ZoneTile
                      key={i}
                      label={zone.name}
                      score={zone.urgencyScore.toString()}
                      deployed={zone.volunteersDeployed}
                      needed={zone.volunteersNeeded}
                      needType={zone.needType}
                      status={
                        zone.urgencyScore >= 8
                          ? "critical"
                          : zone.urgencyScore >= 6
                          ? "high"
                          : zone.urgencyScore >= 4
                          ? "medium"
                          : "stable"
                      }
                      glow={zone.urgencyScore >= 8}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div className="col-span-4 space-y-6">
              {/* Critical zone card */}
              {criticalZone ? (
                <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-red-500/10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {criticalZone.urgencyScore >= 8 ? "Critical" : "High Risk"}
                    </span>
                    <ShieldAlert className="text-red-500" size={24} />
                  </div>
                  <h3 className="text-slate-900 text-xl font-bold mb-1">
                    {criticalZone.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    {criticalZone.needType} · Immediate attention required
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-black text-red-600">
                      {criticalZone.urgencyScore}
                    </span>
                    <span className="text-slate-400 text-sm ml-2">/10</span>
                    <div className="mt-2 text-slate-400 text-sm">
                      {criticalZone.volunteersDeployed} deployed /{" "}
                      <span className="text-slate-900 font-semibold">
                        {criticalZone.volunteersNeeded} needed
                      </span>
                    </div>
                  </div>
                  <button className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                    View Prescription <ChevronRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="bg-[#161920] rounded-2xl p-8 border border-white/5 text-center text-slate-600 text-sm">
                  No critical zones yet
                </div>
              )}

              {/* Gemini prescription */}
              <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Gemini Prescription
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  {prescription
                    ? `"${prescription}"`
                    : "Upload a report to generate an AI prescription."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const NavItem = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
    active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
  }`}>
    {icon} <span className="font-medium text-sm">{label}</span>
  </div>
);

const StatusBadge = ({ label, color, dot = false }: any) => (
  <div className={`px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 ${color}`}>
    {dot && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>}
    {label}
  </div>
);

const MetricCard = ({ label, value, sub, subColor }: any) => (
  <div className="bg-[#161920] border border-white/5 p-5 rounded-2xl">
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <p className={`text-[11px] font-semibold ${subColor}`}>{sub}</p>
  </div>
);

const ZoneTile = ({ label, score, status, glow, deployed, needed, needType }: any) => {
  const colors: any = {
    critical: "bg-red-600 border-red-400 text-white",
    high: "bg-orange-500 border-orange-400 text-white",
    medium: "bg-yellow-600 border-yellow-400 text-white",
    stable: "bg-emerald-600 border-emerald-400 text-white",
  };

  return (
    <div className={`${colors[status]} w-32 rounded-2xl border-2 p-3 flex flex-col items-center justify-center shadow-xl transition-transform hover:scale-105 cursor-pointer ${
      glow ? "shadow-red-500/30" : ""
    }`}>
      <span className="text-[10px] font-bold uppercase opacity-80 mb-1">{label}</span>
      <span className="text-2xl font-black mb-1">{score}</span>
      <span className="text-[9px] opacity-70">{needType}</span>
      <span className="text-[9px] opacity-70">{deployed}/{needed}</span>
    </div>
  );
};

export default Dashboard;