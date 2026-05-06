export function GeometricMark() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background — blue gradient */}
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1d4ed8"/>
            <stop offset="100%" stopColor="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="240" height="240" rx="54" fill="url(#bg)"/>
        {/* Two overlapping hexagons — construction/industrial feel */}
        {/* Left hex — white */}
        <polygon points="88,52 118,52 134,78 118,104 88,104 72,78" fill="#ffffff" opacity="0.95"/>
        {/* Right hex — yellow, offset */}
        <polygon points="108,88 138,88 154,114 138,140 108,140 92,114" fill="#f59e0b" opacity="0.95"/>
        {/* Overlap area — blue (creates intersection effect) */}
        <polygon points="108,88 118,88 118,104 108,104" fill="#3b82f6"/>
        {/* B in white hex */}
        <text x="98" y="84" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="36" fill="#0f172a">B</text>
        {/* M in yellow hex */}
        <text x="110" y="128" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="36" fill="#0f172a">M</text>
      </svg>
    </div>
  );
}
