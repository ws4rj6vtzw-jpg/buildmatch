export function FeatureGraphic() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="1024" height="500" viewBox="0 0 1024 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1024" height="500" fill="#0f172a"/>

        {/* Subtle grid texture */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="0.3" opacity="0.06"/>
          </pattern>
        </defs>
        <rect width="1024" height="500" fill="url(#grid)"/>

        {/* Amber accent — top bar */}
        <rect x="0" y="0" width="6" height="500" fill="#f59e0b"/>

        {/* BM icon — left */}
        <rect x="60" y="110" width="280" height="280" rx="64" fill="#1e293b"/>
        <text x="84" y="312" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="148" fill="#ffffff" letterSpacing="-8">B</text>
        <text x="172" y="312" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="148" fill="#3b82f6" letterSpacing="-8">M</text>
        <rect x="84" y="325" width="236" height="12" rx="6" fill="#f59e0b"/>

        {/* Right side text */}
        {/* Build in white, Match in blue */}
        <text x="400" y="230" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="96" fill="#ffffff" letterSpacing="-4">Build</text>
        <text x="608" y="230" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="96" fill="#3b82f6" letterSpacing="-4">Match</text>

        {/* Amber underline under wordmark */}
        <rect x="400" y="248" width="574" height="6" rx="3" fill="#f59e0b"/>

        {/* Tagline */}
        <text x="400" y="320" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="32" fill="#94a3b8" letterSpacing="0">Find your next job. Or your next worker.</text>

        {/* Pill badges */}
        <rect x="400" y="360" width="168" height="44" rx="22" fill="#1e293b"/>
        <text x="484" y="388" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#f59e0b" textAnchor="middle">Workers</text>

        <rect x="580" y="360" width="168" height="44" rx="22" fill="#1e293b"/>
        <text x="664" y="388" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#3b82f6" textAnchor="middle">Builders</text>

        <rect x="760" y="360" width="168" height="44" rx="22" fill="#1e293b"/>
        <text x="844" y="388" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#94a3b8" textAnchor="middle">UK Only</text>

        {/* Bottom label */}
        <text x="400" y="460" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="20" fill="#475569">Construction hiring. Simplified.</text>
      </svg>
    </div>
  );
}
