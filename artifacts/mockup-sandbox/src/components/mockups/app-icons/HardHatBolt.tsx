export function HardHatBolt() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="240" rx="54" fill="#1d4ed8"/>
        {/* Hard hat — large, white */}
        <path d="M120 58 C86 58 60 80 60 108 L60 118 L180 118 L180 108 C180 80 154 58 120 58Z" fill="#ffffff"/>
        <rect x="52" y="116" width="136" height="18" rx="9" fill="#ffffff"/>
        {/* Lightning bolt — yellow, overlaid bottom right */}
        <path d="M138 100 L122 128 L136 128 L118 160 L148 120 L133 120 Z" fill="#f59e0b"/>
      </svg>
    </div>
  );
}
