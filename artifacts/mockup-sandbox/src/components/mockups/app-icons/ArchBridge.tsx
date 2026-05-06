export function ArchBridge() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgArch" x1="0" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a"/>
            <stop offset="100%" stopColor="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="240" height="240" rx="54" fill="url(#bgArch)"/>
        {/* Main arch */}
        <path d="M36 172 Q36 68 120 68 Q204 68 204 172" stroke="#3b82f6" strokeWidth="14" fill="none" strokeLinecap="round"/>
        {/* Road / deck */}
        <rect x="30" y="170" width="180" height="12" rx="6" fill="#ffffff"/>
        {/* Suspension cables — left */}
        <line x1="64" y1="86" x2="64" y2="170" stroke="#f59e0b" strokeWidth="3" opacity="0.9"/>
        <line x1="88" y1="74" x2="88" y2="170" stroke="#f59e0b" strokeWidth="3" opacity="0.9"/>
        <line x1="112" y1="68" x2="112" y2="170" stroke="#f59e0b" strokeWidth="3" opacity="0.9"/>
        {/* Suspension cables — right */}
        <line x1="136" y1="68" x2="136" y2="170" stroke="#f59e0b" strokeWidth="3" opacity="0.9"/>
        <line x1="160" y1="74" x2="160" y2="170" stroke="#f59e0b" strokeWidth="3" opacity="0.9"/>
        <line x1="184" y1="86" x2="184" y2="170" stroke="#f59e0b" strokeWidth="3" opacity="0.9"/>
        {/* Pillars */}
        <rect x="55" y="170" width="12" height="32" rx="3" fill="#ffffff"/>
        <rect x="173" y="170" width="12" height="32" rx="3" fill="#ffffff"/>
      </svg>
    </div>
  );
}
