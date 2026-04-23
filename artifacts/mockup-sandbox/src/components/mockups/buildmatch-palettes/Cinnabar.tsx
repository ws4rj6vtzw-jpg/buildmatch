import { Star, MapPin, RotateCcw, X, Check } from "lucide-react";

const P = {
  bg: "#18090A",
  card: "#261010",
  elevated: "#2E1515",
  border: "#401A1A",
  fg: "#FAF0F0",
  muted: "#8A5E5E",
  primary: "#E84545",
  primaryFg: "#FFFFFF",
  accent: "#F59E0B",
};

export function Cinnabar() {
  return (
    <div className="flex flex-col h-screen w-full font-['Inter']" style={{ backgroundColor: P.bg, color: P.fg }}>
      {/* Status bar */}
      <div className="h-11 flex items-end px-5 pb-2">
        <span className="text-xs font-semibold" style={{ color: P.muted }}>9:41</span>
        <div className="ml-auto flex gap-1 items-center">
          <div className="w-4 h-2.5 rounded-sm border" style={{ borderColor: P.muted }}>
            <div className="h-full w-3/4 rounded-sm" style={{ backgroundColor: P.muted }} />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <div>
          <p className="text-xl font-bold tracking-tight">Jobs near you</p>
          <p className="text-xs mt-0.5" style={{ color: P.muted }}>Swipe right to apply</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-semibold" style={{ backgroundColor: P.card, borderColor: P.border }}>
          <MapPin size={13} style={{ color: P.primary }} />
          <span>25km</span>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 px-4 pt-1 pb-0 relative">
        <div className="absolute inset-4 rounded-3xl scale-95 translate-y-2 origin-bottom" style={{ backgroundColor: P.card }} />
        <div className="absolute inset-4 rounded-3xl scale-97 translate-y-1 origin-bottom" style={{ backgroundColor: P.elevated }} />

        <div className="relative h-full rounded-3xl overflow-hidden" style={{ backgroundColor: P.card, border: `1px solid ${P.border}` }}>
          <div className="h-52 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #3d1010 0%, #280a0a 100%)` }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: P.primary + "33", color: P.primary }}>M</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: `linear-gradient(to top, ${P.card}, transparent)` }} />
          </div>

          <div className="px-5 py-4 flex flex-col gap-3">
            <div>
              <p className="text-lg font-bold leading-tight">Senior Carpenter</p>
              <p className="text-sm mt-0.5" style={{ color: P.muted }}>Carpentry · Mitchell & Sons</p>
              <p className="text-xs mt-1" style={{ color: P.muted }}>Shoreditch · 12km away · £45/hr</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: P.primary, color: P.primaryFg }}>Carpentry</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: P.elevated, color: P.fg }}>CSCS Card</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: P.elevated, color: P.fg }}>ECS Gold</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Star size={13} fill={P.accent} style={{ color: P.accent }} />
              <span className="text-sm font-semibold">4.8</span>
              <span className="text-xs" style={{ color: P.muted }}>· 24 jobs completed</span>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: P.muted }}>
              20 years' experience in high-end residential and commercial fit-out. CSCS Gold Card holder, available Mon–Fri.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-5 py-5 px-8">
        <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: P.card }}>
          <RotateCcw size={20} style={{ color: P.accent }} />
        </button>
        <button className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: P.card }}>
          <X size={24} style={{ color: P.muted }} />
        </button>
        <button className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: P.primary }}>
          <Check size={28} style={{ color: P.primaryFg }} />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex items-center justify-around px-4 pt-2 pb-5" style={{ backgroundColor: P.card, borderTop: `1px solid ${P.border}` }}>
        {[
          { icon: "⚡", label: "Discover", active: true },
          { icon: "💼", label: "Jobs", active: false },
          { icon: "💬", label: "Matches", active: false },
          { icon: "👤", label: "Profile", active: false },
        ].map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-1">
            <span className="text-lg">{t.icon}</span>
            <span className="text-[10px] font-semibold" style={{ color: t.active ? P.primary : P.muted }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
