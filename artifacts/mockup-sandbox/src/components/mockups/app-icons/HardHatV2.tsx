export function HardHatV2() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Brand navy background gradient — replaces original near-black */}
          <linearGradient id="navyBg" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a"/>
            <stop offset="100%" stopColor="#0f172a"/>
          </linearGradient>
          {/* Hat body — safety yellow, same amber family as original */}
          <linearGradient id="hatBody" x1="80" y1="60" x2="160" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fcd34d"/>
            <stop offset="60%" stopColor="#f59e0b"/>
            <stop offset="100%" stopColor="#d97706"/>
          </linearGradient>
          {/* Brim underside — darker amber, same as original shadow */}
          <linearGradient id="brimUnder" x1="40" y1="130" x2="200" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b45309"/>
            <stop offset="50%" stopColor="#d97706"/>
            <stop offset="100%" stopColor="#b45309"/>
          </linearGradient>
          {/* Highlight on dome top */}
          <radialGradient id="domeShine" cx="35%" cy="30%" r="45%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Background — brand navy gradient */}
        <rect width="240" height="240" rx="0" fill="url(#navyBg)"/>

        {/* ─── Hard hat — same proportions as original ─── */}

        {/* Brim / visor — wide shelf extending either side */}
        <path d="M28 137 Q120 148 212 137 L204 148 Q120 162 36 148 Z" fill="url(#brimUnder)"/>
        <path d="M28 137 Q120 144 212 137 L208 143 Q120 152 32 143 Z" fill="#f59e0b"/>

        {/* Main dome body */}
        <path d="M52 136
          C52 136 44 124 44 108
          C44 72 78 46 120 46
          C162 46 196 72 196 108
          C196 124 188 136 188 136
          Z"
          fill="url(#hatBody)"/>

        {/* Dome specular highlight */}
        <ellipse cx="96" cy="82" rx="32" ry="22" fill="url(#domeShine)"/>

        {/* Centre ridge / top knob */}
        <ellipse cx="120" cy="47" rx="9" ry="5" fill="#fcd34d"/>

        {/* Inner brim edge line (top face of brim) */}
        <path d="M52 136 Q120 142 188 136" stroke="#fcd34d" strokeWidth="2" fill="none" opacity="0.6"/>

        {/* Suspension band visible through front vent — dark band */}
        <path d="M80 118 Q120 126 160 118" stroke="#92400e" strokeWidth="4" fill="none" strokeLinecap="round"/>

        {/* Front vent slot */}
        <rect x="110" y="80" width="20" height="5" rx="2.5" fill="#92400e" opacity="0.5"/>
      </svg>
    </div>
  );
}
