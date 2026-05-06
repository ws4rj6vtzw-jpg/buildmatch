export function TwoWorkers() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a8a"/>
            <stop offset="100%" stopColor="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="240" height="240" rx="54" fill="url(#bg2)"/>
        {/* Left worker — blue */}
        <circle cx="80" cy="82" r="26" fill="#3b82f6"/>
        {/* Hard hat left */}
        <path d="M80 62 C66 62 58 72 58 82 L102 82 C102 72 94 62 80 62Z" fill="#ffffff"/>
        <rect x="56" y="80" width="48" height="6" rx="3" fill="#ffffff"/>
        {/* Left body */}
        <path d="M50 180 C50 148 60 136 80 136 C100 136 110 148 110 180Z" fill="#3b82f6"/>
        {/* Right worker — yellow */}
        <circle cx="160" cy="82" r="26" fill="#f59e0b"/>
        {/* Hard hat right */}
        <path d="M160 62 C146 62 138 72 138 82 L182 82 C182 72 174 62 160 62Z" fill="#ffffff"/>
        <rect x="136" y="80" width="48" height="6" rx="3" fill="#ffffff"/>
        {/* Right body */}
        <path d="M130 180 C130 148 140 136 160 136 C180 136 190 148 190 180Z" fill="#f59e0b"/>
        {/* Connecting arc / match spark between them */}
        <path d="M110 100 Q120 86 130 100" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <circle cx="120" cy="88" r="6" fill="#ffffff"/>
      </svg>
    </div>
  );
}
