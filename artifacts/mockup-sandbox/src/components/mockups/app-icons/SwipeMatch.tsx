export function SwipeMatch() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="240" rx="54" fill="#0f172a"/>
        {/* Back card — yellow */}
        <rect x="68" y="52" width="118" height="148" rx="16" fill="#f59e0b" opacity="0.9" transform="rotate(-8 68 52)"/>
        {/* Front card — white */}
        <rect x="54" y="44" width="118" height="148" rx="16" fill="#ffffff"/>
        {/* Hard hat icon on card */}
        <path d="M113 88 C113 76 131 76 131 88 L136 88 C136 94 130 100 112 100 C94 100 88 94 88 88 Z" fill="#0f172a"/>
        <rect x="88" y="98" width="48" height="7" rx="3.5" fill="#0f172a"/>
        {/* Swipe arrow */}
        <path d="M148 130 L168 130 M162 122 L170 130 L162 138" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Match heart */}
        <path d="M104 140 C104 136 108 133 112 136 C116 133 120 136 120 140 C120 144 112 150 112 150 C112 150 104 144 104 140Z" fill="#3b82f6"/>
      </svg>
    </div>
  );
}
