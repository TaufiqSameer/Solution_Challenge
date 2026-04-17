import React from "react";
import {
  LayoutDashboard,
  Map as MapIcon,
  Upload,
  Activity,
  ShieldAlert,
  FileText,
  ChevronRight,
  Filter,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#0f1115] text-slate-200 font-sans selection:bg-blue-500/30">
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

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
              Filters
            </p>
            <div className="px-4 space-y-3">
              <Checkbox label="Medical Needs" color="bg-red-500" />
              <Checkbox label="Logistic Needs" color="bg-blue-500" />
              <Checkbox label="Education Needs" color="bg-yellow-500" />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
              Reports
            </p>
            <div className="space-y-1">
              <NavItem icon={<FileText size={20} />} label="Weekly Summary" />
              <NavItem
                icon={<Activity size={20} />}
                label="Historical Trends"
              />
            </div>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER BAR */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#161920]/50 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white">
            Coordinator Dashboard
          </h2>
          <div className="flex gap-3">
            <StatusBadge
              label="3 critical"
              color="bg-red-500/10 text-red-500 border-red-500/20"
            />
            <StatusBadge
              label="2 high risk"
              color="bg-orange-500/10 text-orange-400 border-orange-500/20"
            />
            <StatusBadge
              label="System Live"
              color="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              dot
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* TOP METRICS ROW (From Wireframe) */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard
              label="Total Zones"
              value="24"
              sub="3 Critical"
              subColor="text-red-500"
            />
            <MetricCard
              label="Volunteers Deployed"
              value="312"
              sub="48 Misallocated"
              subColor="text-orange-400"
            />
            <MetricCard
              label="Avg Urgency Score"
              value="6.4"
              sub="↑ 1.2 from last week"
              subColor="text-red-400"
            />
            <MetricCard
              label="Actions Pending"
              value="5"
              sub="AI Prescriptions"
              subColor="text-blue-400"
            />
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* HEATMAP CARD */}
            <div className="col-span-8 bg-[#161920] rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden">
              {/* Background Grid Pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              ></div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Demand-supply gap heatmap
                  </h3>
                  <p className="text-sm text-slate-500">
                    Region North • Real-time status
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition">
                    Last 7 Days
                  </button>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition">
                    Export
                  </button>
                </div>
              </div>

              {/* MOCK MAP ZONES */}
              <div className="h-[400px] flex items-center justify-center gap-6 relative z-10">
                <ZoneTile label="Zone A" score="8.7" status="critical" glow />
                <div className="w-px h-12 bg-white/5"></div>
                <ZoneTile label="Zone B" score="3.1" status="medium" />
                <ZoneTile label="Zone C" score="2.2" status="stable" />
                <ZoneTile label="Zone D" score="1.1" status="stable" />
              </div>
            </div>

            {/* ALERTS PANEL */}
            <div className="col-span-4 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)] border-[6px] border-red-500/10">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Understaffed
                  </span>
                  <ShieldAlert className="text-red-500" size={24} />
                </div>
                <h3 className="text-slate-900 text-xl font-bold mb-1">
                  Zone A Critical
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  Immediate reallocation required
                </p>

                <div className="mb-8">
                  <span className="text-6xl font-black text-red-600 tracking-tighter">
                    8.7
                  </span>
                  <div className="mt-2 text-slate-400 text-sm font-medium">
                    2 Deployed /{" "}
                    <span className="text-slate-900">8 Needed</span>
                  </div>
                </div>

                <button className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg">
                  View Prescription <ChevronRight size={18} />
                </button>
              </div>

              {/* GEMINI BOX */}
              <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <Activity size={40} className="text-blue-500" />
                </div>
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Gemini Prescription
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "Move all available Staff from Zone D to Zone A immediately.
                  Zone A's medical gap has increased by 15% in the last 2
                  hours."
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
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
    }`}
  >
    {icon} <span className="font-medium text-sm">{label}</span>
  </div>
);

const Checkbox = ({ label, color }: any) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className="relative flex items-center">
      <input
        type="checkbox"
        className="peer appearance-none w-5 h-5 border border-white/10 rounded bg-white/5 checked:bg-blue-600 checked:border-blue-600 transition-all"
      />
      <div
        className={`absolute w-1.5 h-1.5 rounded-full left-[7px] ${color} opacity-40 peer-checked:opacity-100 transition-opacity`}
      ></div>
    </div>
    <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
      {label}
    </span>
  </label>
);

const StatusBadge = ({ label, color, dot = false }: any) => (
  <div
    className={`px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 ${color}`}
  >
    {dot && (
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
    )}
    {label}
  </div>
);

const MetricCard = ({ label, value, sub, subColor }: any) => (
  <div className="bg-[#161920] border border-white/5 p-5 rounded-2xl">
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <p className={`text-[11px] font-semibold ${subColor}`}>{sub}</p>
  </div>
);

const ZoneTile = ({ label, score, status, glow = false }: any) => {
  const colors: any = {
    critical: "bg-red-600 border-red-400 text-white",
    medium: "bg-emerald-600 border-emerald-400 text-white",
    stable: "bg-slate-800 border-slate-700 text-slate-400",
  };

  return (
    <div
      className={`
      ${colors[status]} 
      w-28 h-28 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer
      ${glow ? "shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)] animate-pulse-subtle" : ""}
    `}
    >
      <span className="text-[10px] font-bold uppercase opacity-80 mb-1">
        {label}
      </span>
      <span className="text-2xl font-black">{score}</span>
    </div>
  );
};

export default Dashboard;
