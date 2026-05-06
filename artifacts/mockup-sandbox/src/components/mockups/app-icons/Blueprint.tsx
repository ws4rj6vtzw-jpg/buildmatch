export function Blueprint() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="240" rx="54" fill="#0f172a"/>
        {/* Blueprint grid lines */}
        {[40,70,100,130,160,190,220].map(v => (
          <line key={`h${v}`} x1="20" y1={v} x2="220" y2={v} stroke="#3b82f6" strokeWidth="0.8" opacity="0.3"/>
        ))}
        {[40,70,100,130,160,190,220].map(v => (
          <line key={`v${v}`} x1={v} y1="20" x2={v} y2="220" stroke="#3b82f6" strokeWidth="0.8" opacity="0.3"/>
        ))}
        {/* Location pin — main mark */}
        <circle cx="120" cy="104" r="34" fill="#3b82f6"/>
        <circle cx="120" cy="104" r="14" fill="#0f172a"/>
        <path d="M120 138 L108 158 L120 152 L132 158 Z" fill="#3b82f6"/>
        {/* BM text */}
        <text x="120" y="109" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fill="#f59e0b">BM</text>
      </svg>
    </div>
  );
}
