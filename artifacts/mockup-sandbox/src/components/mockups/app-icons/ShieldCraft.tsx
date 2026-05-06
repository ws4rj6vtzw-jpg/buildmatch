export function ShieldCraft() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="240" rx="54" fill="#0f172a"/>
        {/* Shield shape */}
        <path d="M120 36 L176 60 L176 126 C176 162 120 196 120 196 C120 196 64 162 64 126 L64 60 Z" fill="#1d4ed8"/>
        {/* Shield inner highlight */}
        <path d="M120 52 L162 70 L162 124 C162 152 120 180 120 180 C120 180 78 152 78 124 L78 70 Z" fill="#3b82f6" opacity="0.4"/>
        {/* Crossed hammer and wrench */}
        {/* Hammer */}
        <rect x="104" y="88" width="10" height="46" rx="5" fill="#ffffff" transform="rotate(-40 104 88)"/>
        <rect x="90" y="82" width="26" height="16" rx="5" fill="#f59e0b" transform="rotate(-40 90 82)"/>
        {/* Wrench */}
        <rect x="126" y="88" width="10" height="46" rx="5" fill="#ffffff" transform="rotate(40 126 88)"/>
        <ellipse cx="150" cy="86" rx="14" ry="9" fill="none" stroke="#f59e0b" strokeWidth="6" transform="rotate(40 150 86)"/>
      </svg>
    </div>
  );
}
