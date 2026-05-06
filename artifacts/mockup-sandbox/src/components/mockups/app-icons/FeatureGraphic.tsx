export function FeatureGraphic() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800;900&display=swap');
      `}</style>
      <svg width="1024" height="500" viewBox="0 0 1024 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect width="1024" height="500" fill="#060D1F"/>

        {/* Subtle blue radial glow top-left */}
        <defs>
          <radialGradient id="glow" cx="20%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#060D1F" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="glow2" cx="85%" cy="60%" r="40%">
            <stop offset="0%" stopColor="#0891B2" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#060D1F" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1024" height="500" fill="url(#glow)"/>
        <rect width="1024" height="500" fill="url(#glow2)"/>

        {/* Left accent bar */}
        <rect x="0" y="0" width="5" height="500" fill="#2563EB"/>

        {/* BM icon block */}
        <rect x="56" y="108" width="264" height="264" rx="56" fill="#0A1628"/>
        <rect x="56" y="108" width="264" height="264" rx="56" fill="none" stroke="#1E3A5F" strokeWidth="1.5"/>
        <text x="78" y="298" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="140" fill="#ffffff" letterSpacing="-6">B</text>
        <text x="164" y="298" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="140" fill="#2563EB" letterSpacing="-6">M</text>
        <rect x="78" y="313" width="222" height="10" rx="5" fill="#0891B2"/>

        {/* BUILDMATCH wordmark */}
        <text x="376" y="196" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="76" fill="#ffffff" letterSpacing="-2">BUILDMATCH</text>

        {/* Blue underline — skewed style */}
        <rect x="376" y="210" width="604" height="5" rx="2" fill="#2563EB"/>

        {/* Tagline */}
        <text x="376" y="274" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="28" fill="#0891B2" letterSpacing="0">Hire Smarter. Build Faster.</text>

        {/* Description */}
        <text x="376" y="320" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="20" fill="#64748B">The UK's first swipe-to-hire platform for construction.</text>

        {/* Pills */}
        <rect x="376" y="355" width="150" height="40" rx="20" fill="#0A1628" stroke="#1E3A5F" strokeWidth="1"/>
        <text x="451" y="380" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16" fill="#2563EB" textAnchor="middle">For Workers</text>

        <rect x="538" y="355" width="150" height="40" rx="20" fill="#0A1628" stroke="#1E3A5F" strokeWidth="1"/>
        <text x="613" y="380" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16" fill="#0891B2" textAnchor="middle">For Hirers</text>

        <rect x="700" y="355" width="130" height="40" rx="20" fill="#0A1628" stroke="#1E3A5F" strokeWidth="1"/>
        <text x="765" y="380" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16" fill="#64748B" textAnchor="middle">UK Only</text>

        {/* Footer social proof */}
        <text x="376" y="456" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="18" fill="#334155">Trusted by 4,000+ trades across London</text>

        {/* Dot separator */}
        <circle cx="358" cy="448" r="3" fill="#2563EB"/>
      </svg>
    </div>
  );
}
