export function Crane() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="240" rx="54" fill="#0f172a"/>
        {/* Mast — vertical tower */}
        <rect x="106" y="80" width="14" height="130" rx="4" fill="#ffffff"/>
        {/* Horizontal boom */}
        <rect x="48" y="80" width="140" height="10" rx="4" fill="#3b82f6"/>
        {/* Counter-jib (short, left) */}
        <rect x="48" y="80" width="48" height="10" rx="4" fill="#3b82f6"/>
        {/* Counter-weight block */}
        <rect x="40" y="76" width="20" height="18" rx="4" fill="#f59e0b"/>
        {/* Top cap */}
        <path d="M106 80 L113 52 L120 80Z" fill="#f59e0b"/>
        {/* Hook line */}
        <line x1="168" y1="90" x2="168" y2="148" stroke="#ffffff" strokeWidth="3" strokeDasharray="4 3"/>
        {/* Hook */}
        <path d="M162 148 Q162 162 174 162 Q186 162 186 148" stroke="#f59e0b" strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Ground */}
        <rect x="40" y="196" width="160" height="8" rx="4" fill="#3b82f6" opacity="0.5"/>
      </svg>
    </div>
  );
}
