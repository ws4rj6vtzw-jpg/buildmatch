import { Star, MapPin, RotateCcw, X, Check, Shield, Zap } from "lucide-react";

export function SteelBlue() {
  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden font-['Inter']"
      style={{
        background: "linear-gradient(160deg, #060D1F 0%, #0A1830 45%, #08152B 100%)",
        color: "#E8F0FF",
        position: "relative",
      }}
    >
      {/* Background glow orbs */}
      <div style={{
        position: "absolute", top: -80, right: -60,
        width: 260, height: 260,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 120, left: -80,
        width: 200, height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Status bar */}
      <div className="h-11 flex items-end px-5 pb-2 relative z-10">
        <span className="text-xs font-semibold" style={{ color: "rgba(148,172,218,0.7)" }}>9:41</span>
        <div className="ml-auto flex items-center gap-0.5">
          {[1, 2, 3].map(i => (
            <div key={i} style={{ width: 3, height: 6 + i * 2, borderRadius: 2, backgroundColor: i < 3 ? "rgba(148,172,218,0.8)" : "rgba(148,172,218,0.3)" }} />
          ))}
          <div className="ml-1.5 w-4 h-2.5 rounded-sm border flex items-center pl-px" style={{ borderColor: "rgba(148,172,218,0.5)" }}>
            <div style={{ width: "70%", height: "100%", borderRadius: 2, backgroundColor: "#3B82F6" }} />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-1 pb-3 relative z-10">
        <div>
          <p className="text-[22px] font-bold tracking-tight leading-tight" style={{
            background: "linear-gradient(90deg, #fff 30%, #93C5FD 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Jobs near you</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(148,172,218,0.6)" }}>Swipe right to apply instantly</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 99,
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(59,130,246,0.3)",
          backdropFilter: "blur(12px)",
          fontSize: 13, fontWeight: 600,
          color: "#93C5FD",
        }}>
          <MapPin size={12} />
          25km
        </button>
      </div>

      {/* Card stack */}
      <div className="flex-1 px-4 pt-0 pb-0 relative z-10" style={{ minHeight: 0 }}>
        {/* Shadow cards behind */}
        <div style={{
          position: "absolute", inset: 16, bottom: 0,
          borderRadius: 28, transform: "scale(0.94) translateY(8px)", transformOrigin: "bottom",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
        }} />
        <div style={{
          position: "absolute", inset: 16, bottom: 0,
          borderRadius: 28, transform: "scale(0.97) translateY(4px)", transformOrigin: "bottom",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.07)",
        }} />

        {/* Top card — glassmorphism */}
        <div style={{
          position: "relative", height: "100%", borderRadius: 28, overflow: "hidden",
          background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 0 1px rgba(59,130,246,0.1), 0 24px 48px rgba(0,0,0,0.4)",
        }}>
          {/* Hero gradient area */}
          <div style={{
            height: 190,
            background: "linear-gradient(135deg, #0e2a54 0%, #071830 60%, #0a0f1e 100%)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Subtle grid pattern */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
            {/* Avatar */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 76, height: 76, borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(59,130,246,0.35), rgba(6,182,212,0.25))",
                border: "2px solid rgba(59,130,246,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 700, color: "#93C5FD",
                boxShadow: "0 0 30px rgba(59,130,246,0.3)",
              }}>M</div>
            </div>
            {/* Verified badge */}
            <div style={{
              position: "absolute", top: 14, right: 14,
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 99,
              background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.4)",
              fontSize: 11, fontWeight: 600, color: "#93C5FD",
            }}>
              <Shield size={10} />
              Verified
            </div>
            {/* Bottom fade */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 64,
              background: "linear-gradient(to top, rgba(14,24,48,0.95), transparent)",
            }} />
          </div>

          <div style={{ padding: "14px 20px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Title row */}
            <div>
              <div className="flex items-center justify-between">
                <p style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" }}>Senior Carpenter</p>
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 13, fontWeight: 600,
                  color: "#06B6D4",
                }}>
                  <Zap size={12} fill="#06B6D4" />
                  Active now
                </div>
              </div>
              <p style={{ fontSize: 13, marginTop: 2, color: "rgba(148,172,218,0.7)" }}>Mitchell & Sons · Shoreditch</p>
              <p style={{ fontSize: 12, marginTop: 3, color: "rgba(148,172,218,0.5)" }}>12km away · <span style={{ color: "#93C5FD", fontWeight: 600 }}>£45/hr</span></p>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{
                padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                background: "linear-gradient(90deg, #3B82F6, #06B6D4)",
                color: "#fff",
              }}>Carpentry</span>
              <span style={{
                padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(232,240,255,0.8)",
              }}>CSCS Gold</span>
              <span style={{
                padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(232,240,255,0.8)",
              }}>ECS Card</span>
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={12} fill={i <= 4 ? "#06B6D4" : "transparent"} style={{ color: "#06B6D4" }} />
                ))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700 }}>4.8</span>
              <span style={{ fontSize: 12, color: "rgba(148,172,218,0.5)" }}>· 24 jobs completed</span>
            </div>

            {/* Bio */}
            <p style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(148,172,218,0.65)" }}>
              20 years in high-end residential &amp; commercial fit-out. CSCS Gold Card, available Mon–Fri. Fully insured.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 18, padding: "16px 32px 14px", position: "relative", zIndex: 10,
      }}>
        <button style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(12px)",
        }}>
          <RotateCcw size={18} style={{ color: "#06B6D4" }} />
        </button>
        <button style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(12px)",
        }}>
          <X size={22} style={{ color: "rgba(148,172,218,0.6)" }} />
        </button>
        <button style={{
          width: 68, height: 68, borderRadius: "50%",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 24px rgba(59,130,246,0.5), 0 8px 16px rgba(0,0,0,0.3)",
          border: "none",
        }}>
          <Check size={28} style={{ color: "#fff" }} />
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-around",
        padding: "10px 16px 22px",
        background: "rgba(255,255,255,0.04)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        position: "relative", zIndex: 10,
      }}>
        {[
          { icon: "⚡", label: "Discover", active: true },
          { icon: "💼", label: "Jobs", active: false },
          { icon: "💬", label: "Matches", active: false },
          { icon: "👤", label: "Profile", active: false },
        ].map((t) => (
          <div key={t.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            {t.active && (
              <div style={{
                position: "absolute", width: 32, height: 2, borderRadius: 1,
                background: "linear-gradient(90deg, #3B82F6, #06B6D4)",
                top: 0,
              }} />
            )}
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: t.active ? "#93C5FD" : "rgba(148,172,218,0.4)" }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
