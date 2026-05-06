export function HardHatBranded() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgHH" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        {/* Background */}
        <rect width="240" height="240" rx="54" fill="url(#bgHH)"/>

        {/* Hard hat dome — safety yellow */}
        <path d="M120 46
          C76 46 44 78 44 114
          L44 126
          L196 126
          L196 114
          C196 78 164 46 120 46Z"
          fill="#f59e0b"/>

        {/* Hat brim — slightly lighter yellow */}
        <rect x="32" y="122" width="176" height="20" rx="10" fill="#fbbf24"/>

        {/* Blue stripe across dome */}
        <path d="M50 102 Q120 88 190 102 L190 112 Q120 98 50 112Z" fill="#3b82f6" opacity="0.6"/>

        {/* Centre ridge line on dome */}
        <rect x="116" y="50" width="8" height="74" rx="4" fill="#fbbf24" opacity="0.5"/>

        {/* Hard hat suspension knob on top */}
        <ellipse cx="120" cy="47" rx="10" ry="6" fill="#f59e0b"/>

        {/* Blue accent bar below brim */}
        <rect x="32" y="146" width="176" height="6" rx="3" fill="#3b82f6"/>

        {/* "BM" wordmark at bottom */}
        <text
          x="120"
          y="196"
          text-anchor="middle"
          font-family="'Arial Black', Arial, sans-serif"
          font-weight="900"
          font-size="32"
          letter-spacing="4"
          fill="#ffffff"
          opacity="0.9"
        >BM</text>
      </svg>
    </div>
  );
}
