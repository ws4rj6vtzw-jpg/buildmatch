import { HardHat, Zap, MapPin, ShieldCheck, Building2, Apple, Play, X, Hammer, Menu } from "lucide-react";

export function LightTheme() {
  return (
    <div className="min-h-screen font-sans overflow-hidden" style={{ background: "#F5F7FA", color: "#0A1628" }}>

      {/* Nav */}
      <nav style={{ background: "rgba(255,255,255,0.9)", borderBottom: "1px solid #E2E8F0", backdropFilter: "blur(12px)" }} className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: "#2563EB", transform: "skewX(-12deg)" }}>
              <Hammer className="w-4 h-4 text-white" style={{ transform: "skewX(12deg)" }} />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase" style={{ color: "#0A1628" }}>BUILDMATCH</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-wide uppercase" style={{ color: "#64748B" }}>
            <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-blue-600 transition-colors">For Trades</a>
            <a href="#" className="hover:text-blue-600 transition-colors">For Builders</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-none transition-colors hover:text-blue-600" style={{ color: "#0A1628" }}>Log In</button>
            <button className="text-xs font-black uppercase tracking-wider px-4 py-2 text-white rounded-none" style={{ background: "#2563EB" }}>Get the App</button>
          </div>

          <Menu className="md:hidden w-5 h-5" style={{ color: "#0A1628" }} />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6 min-h-screen flex items-center" style={{ background: "linear-gradient(135deg, #F0F4FF 0%, #F5F7FA 50%, #EFF6FF 100%)" }}>

        {/* Blueprint grid overlay — very subtle */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold uppercase tracking-widest" style={{ border: "1px solid rgba(37,99,235,0.3)", background: "rgba(37,99,235,0.08)", color: "#2563EB", transform: "skewX(-6deg)" }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#2563EB" }} />
              <span style={{ transform: "skewX(6deg)" }}>Live: 482 Sites Hiring Today</span>
            </div>

            {/* Headline */}
            <h1 className="font-black leading-[0.95] mb-6 uppercase tracking-tighter" style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "#0A1628" }}>
              Hire Smarter,{" "}
              <br />
              <span className="relative inline-block" style={{ color: "#2563EB" }}>
                Build Faster.
                <div className="absolute bottom-1 left-0 w-full" style={{ height: "10px", background: "rgba(37,99,235,0.15)", zIndex: -1, transform: "skewX(-12deg)" }} />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg mb-10 max-w-lg leading-snug font-medium" style={{ color: "#475569" }}>
              The UK's first swipe-to-hire platform for construction. Match and connect with qualified and reliable labour and skilled tradespeople in your area.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-3 h-14 px-8 text-sm font-black uppercase tracking-wider text-white transition-all" style={{ background: "#2563EB", boxShadow: "0 4px 24px rgba(37,99,235,0.3)" }}>
                <Apple className="w-5 h-5" />
                iOS App
              </button>
              <button className="flex items-center justify-center gap-3 h-14 px-8 text-sm font-black uppercase tracking-wider transition-all" style={{ border: "2px solid #CBD5E1", color: "#0A1628", background: "white" }}>
                <Play className="w-5 h-5" />
                Android
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4 text-xs font-bold uppercase tracking-wider pt-8" style={{ borderTop: "1px solid #E2E8F0", color: "#64748B" }}>
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-white" style={{ background: "#2563EB" }}><HardHat className="w-4 h-4 text-white" /></div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-white" style={{ background: "#0891B2" }}><Zap className="w-4 h-4 text-white" /></div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-white text-xs font-black text-white" style={{ background: "#334155" }}>4k+</div>
              </div>
              <p>Trusted by <span style={{ color: "#0A1628" }}>4,000+</span> trades across London</p>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative h-[520px] hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-[280px] aspect-[9/19] rounded-[2.5rem] overflow-hidden border-[10px] ring-1" style={{ background: "#0A1628", borderColor: "#1E293B", ringColor: "rgba(255,255,255,0.08)", boxShadow: "0 40px 80px rgba(10,22,40,0.25)" }}>
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-5 rounded-b-3xl mx-auto w-1/3 z-20" style={{ background: "#1E293B" }} />

              <div className="absolute inset-0 flex flex-col p-3 pt-8">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-black tracking-tighter text-white">BM.</div>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm" style={{ border: "1px solid #0891B2", color: "#0891B2", background: "rgba(8,145,178,0.1)" }}>Matching</span>
                </div>

                <div className="relative rounded-xl overflow-hidden flex-1" style={{ background: "#1E293B" }}>
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">Worker profile</div>

                  <div className="absolute top-3 right-3 rounded px-2 py-1 flex items-center gap-1" style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <MapPin className="w-3 h-3" style={{ color: "#0891B2" }} />
                    <span className="text-xs font-bold text-white">2.4m</span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-4 pt-16" style={{ background: "linear-gradient(to top, #0A1628, rgba(10,22,40,0.85), transparent)" }}>
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-black text-white flex items-center gap-1 uppercase tracking-tight">
                          Liam M. <ShieldCheck className="w-4 h-4" style={{ color: "#0891B2" }} />
                        </h3>
                        <p className="text-xs font-bold" style={{ color: "#2563EB" }}>Level 3 Electrician</p>
                      </div>
                      <p className="text-lg font-black" style={{ color: "#0891B2" }}>£220<span className="text-[10px] font-normal text-white/50">/day</span></p>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {["JIB Gold", "IPAF", "Own Tools"].map(t => (
                        <span key={t} className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center mt-4 mb-3">
                  <button className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                    <X className="w-6 h-6" />
                  </button>
                  <button className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: "#2563EB", boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}>
                    <Zap className="w-6 h-6 fill-current" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute top-1/4 -right-8 p-3 max-w-[180px] rotate-3" style={{ background: "white", border: "1px solid #E2E8F0", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
              <div className="flex items-start gap-2 mb-1">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.1)", color: "#2563EB" }}><Building2 className="w-4 h-4" /></div>
                <div>
                  <div className="text-xs font-black uppercase tracking-tight leading-none mb-1" style={{ color: "#0A1628" }}>Canary Wharf</div>
                  <div className="text-[10px] font-bold" style={{ color: "#64748B" }}>5 Trades needed</div>
                </div>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#2563EB" }}>Posted 12m ago</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — teaser */}
      <section className="py-16 px-6" style={{ background: "white", borderTop: "1px solid #E2E8F0" }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#2563EB" }}>How it works</p>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-10" style={{ color: "#0A1628" }}>Three steps to your next hire</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "01", t: "Post Your Job", d: "Describe the role, trade, and location. Takes 60 seconds." },
              { n: "02", t: "Swipe & Match", d: "Browse verified profiles. Swipe right to express interest." },
              { n: "03", t: "Start Work", d: "Connect directly. No agency fees, no middlemen." },
            ].map(s => (
              <div key={s.n} className="p-6" style={{ border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                <div className="text-4xl font-black mb-3 opacity-20" style={{ color: "#2563EB" }}>{s.n}</div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2" style={{ color: "#0A1628" }}>{s.t}</h3>
                <p className="text-sm" style={{ color: "#64748B" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
