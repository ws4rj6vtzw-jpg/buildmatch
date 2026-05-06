export function FeatureGraphic() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      `}</style>
      <svg width="1024" height="500" viewBox="0 0 1024 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="500" fill="#F5F7FA"/>
        <defs>
          <radialGradient id="glow" cx="20%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.06"/>
            <stop offset="100%" stopColor="#F5F7FA" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="glow2" cx="85%" cy="60%" r="40%">
            <stop offset="0%" stopColor="#0891B2" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#F5F7FA" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1024" height="500" fill="url(#glow)"/>
        <rect width="1024" height="500" fill="url(#glow2)"/>

        {/* BM icon block */}
        <rect x="56" y="108" width="264" height="264" rx="56" fill="#0A1628"/>
        <text x="78" y="298" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="800" fontSize="140" fill="#ffffff" letterSpacing="-6">B</text>
        <text x="164" y="298" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="800" fontSize="140" fill="#2563EB" letterSpacing="-6">M</text>
        <rect x="78" y="313" width="222" height="10" rx="5" fill="#0891B2"/>

        {/* BUILDMATCH wordmark */}
        <text x="376" y="200" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="800" fontSize="80" fill="#0A1628" letterSpacing="-3">BUILDMATCH</text>

        {/* Thin underline */}
        <rect x="376" y="216" width="604" height="3" rx="1.5" fill="#2563EB" opacity="0.4"/>

        {/* Tagline */}
        <text x="376" y="276" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="700" fontSize="28" fill="#0891B2" letterSpacing="-0.5">Hire Smarter. Build Faster.</text>

        {/* Description */}
        <text x="376" y="322" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="300" fontSize="20" fill="#64748B">The UK's hardest working swipe-to-hire platform for construction.</text>

        {/* Pills */}
        <rect x="376" y="362" width="148" height="40" rx="20" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1"/>
        <text x="450" y="387" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="600" fontSize="15" fill="#2563EB" textAnchor="middle">For Workers</text>

        <rect x="536" y="362" width="148" height="40" rx="20" fill="#ECFEFF" stroke="#A5F3FC" strokeWidth="1"/>
        <text x="610" y="387" fontFamily="'Plus Jakarta Sans', Arial, sans-serif" fontWeight="600" fontSize="15" fill="#0891B2" textAnchor="middle">For Hirers</text>
      </svg>
    </div>
  );
}
