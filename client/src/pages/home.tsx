import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Menu, X, ArrowRight, Map, Brain, Zap, Lock } from "lucide-react";
import { login } from "../services/auth"

const DEMO_EMAIL = "coordinator@resourceiq.org";
const DEMO_PASSWORD = "demo1234";

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      setLoginOpen(false)
      navigate("/dashboard")
    } catch (err: any) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans overflow-x-hidden">

      {/* LOGIN MODAL */}
      {loginOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-6"
          onClick={() => setLoginOpen(false)}
        >
          <div
            className="bg-[#161920] border border-white/10 rounded-2xl w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLoginOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Lock size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Coordinator Login</h2>
                <p className="text-slate-500 text-xs">ResourceIQ secure access</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coordinator@resourceiq.org"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating...</span>
                ) : (
                  <>Sign in <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
                Demo credentials
              </p>
              <p className="text-xs text-slate-400">coordinator@resourceiq.org</p>
              <p className="text-xs text-slate-400">demo1234</p>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1115]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldAlert size={18} />
            </div>
            <span className="text-lg font-black">
              Resource<span className="text-blue-500">IQ</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How it works</a>
            <a href="#about" className="hover:text-white transition">About</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setLoginOpen(true)}
              className="text-sm text-slate-400 hover:text-white transition px-4 py-2"
            >
              Sign in
            </button>
            <button
              onClick={() => setLoginOpen(true)}
              className="text-sm bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl font-semibold"
            >
              Get Access
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#161920] border-t border-white/5 px-6 py-4 space-y-4">
            <a href="#features" className="block text-sm text-slate-400 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="block text-sm text-slate-400 hover:text-white transition">How it works</a>
            <a href="#about" className="block text-sm text-slate-400 hover:text-white transition">About</a>
            <button
              onClick={() => { setMenuOpen(false); setLoginOpen(true); }}
              className="w-full text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold"
            >
              Sign in
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-16 relative">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            Built for Google Solution Challenge
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Fix Misallocation.
            <br />
            <span className="text-blue-500">Save Lives.</span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            ResourceIQ uses AI to detect where volunteers are wrongly deployed,
            visualize demand-supply gaps in real time, and prescribe
            data-backed reallocation decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 group"
            >
              Launch Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              See how it works
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 justify-center mt-16 text-center">
            <div>
              <p className="text-3xl font-black text-white">24</p>
              <p className="text-xs text-slate-500 mt-1">Zones monitored</p>
            </div>
            <div className="w-px bg-white/10"></div>
            <div>
              <p className="text-3xl font-black text-white">312</p>
              <p className="text-xs text-slate-500 mt-1">Volunteers tracked</p>
            </div>
            <div className="w-px bg-white/10"></div>
            <div>
              <p className="text-3xl font-black text-red-400">48</p>
              <p className="text-xs text-slate-500 mt-1">Misallocations detected</p>
            </div>
            <div className="w-px bg-white/10"></div>
            <div>
              <p className="text-3xl font-black text-emerald-400">5</p>
              <p className="text-xs text-slate-500 mt-1">AI prescriptions</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Everything you need</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A complete intelligence layer for NGO coordinators managing volunteer deployment at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain size={24} />}
            color="bg-blue-600/10 text-blue-400 border-blue-500/20"
            title="AI Data Ingestion"
            desc="Upload CSV or PDF field reports. Gemini AI automatically extracts, normalizes, and scores every zone."
          />
          <FeatureCard
            icon={<Map size={24} />}
            color="bg-emerald-600/10 text-emerald-400 border-emerald-500/20"
            title="Live Heatmaps"
            desc="See demand vs supply gaps visualized geographically. Critical zones glow red. Overstaffed zones show instantly."
          />
          <FeatureCard
            icon={<Zap size={24} />}
            color="bg-orange-600/10 text-orange-400 border-orange-500/20"
            title="Smart Prescriptions"
            desc="The allocation engine analyzes urgency, skills, history, and capacity — then tells you exactly where to move people."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-[#161920]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black mb-4">How it works</h2>
          <p className="text-slate-400">From raw field data to actionable decisions in seconds.</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: "01", title: "Upload", desc: "Drop in your field report CSV or PDF" },
            { step: "02", title: "Analyze", desc: "Gemini AI structures and scores every zone" },
            { step: "03", title: "Visualize", desc: "Heatmap shows misallocation at a glance" },
            { step: "04", title: "Act", desc: "AI prescribes exact reallocation actions" },
          ].map((item, i) => (
            <div key={i} className="text-center relative">
              <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-black text-sm">{item.step}</span>
              </div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-6">Built for impact</h2>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          ResourceIQ was built for the Google Solution Challenge to solve a real problem —
          NGOs don't lack volunteers, they lack the intelligence to deploy them correctly.
          We built an AI engine that detects misallocation and prescribes fixes before crises happen.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <span className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold">Gemini API</span>
          <span className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold">Google Maps</span>
          <span className="px-4 py-2 bg-orange-600/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-semibold">Vertex AI</span>
          <span className="px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold">Firestore</span>
          <span className="px-4 py-2 bg-slate-600/10 border border-slate-500/20 rounded-full text-slate-400 text-xs font-semibold">React + TypeScript</span>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center bg-[#161920] border-t border-white/5">
        <h2 className="text-4xl font-black mb-4">Ready to take control?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Stop making allocation decisions on gut feel. Start making them on data.
        </p>
        <button
          onClick={() => setLoginOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-lg transition-all inline-flex items-center gap-2 group"
        >
          Launch ResourceIQ
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <ShieldAlert size={14} />
            </div>
            <span className="text-sm font-bold">Resource<span className="text-blue-500">IQ</span></span>
          </div>
          <p className="text-slate-600 text-xs">
            Built for Google Solution Challenge 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, color, title, desc }: any) => (
  <div className="bg-[#161920] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
      {icon}
    </div>
    <h3 className="font-bold text-white mb-2 text-lg">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Home;