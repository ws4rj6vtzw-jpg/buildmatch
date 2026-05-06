export function WeldSpark() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glowBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1d4ed8"/>
            <stop offset="100%" stopColor="#0f172a"/>
          </radialGradient>
        </defs>
        <rect width="240" height="240" rx="54" fill="url(#glowBg)"/>
        {/* Spark rays — yellow/orange */}
        {[0,30,60,90,120,150,210,240,270,300,330].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 120 + Math.cos(rad) * 28;
          const y1 = 120 + Math.sin(rad) * 28;
          const x2 = 120 + Math.cos(rad) * (i % 3 === 0 ? 90 : 65);
          const y2 = 120 + Math.sin(rad) * (i % 3 === 0 ? 90 : 65);
          return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 3 === 0 ? "#f59e0b" : "#fde68a"} strokeWidth={i % 3 === 0 ? 5 : 3} strokeLinecap="round"/>;
        })}
        {/* Centre glow circle */}
        <circle cx="120" cy="120" r="30" fill="#fde68a"/>
        <circle cx="120" cy="120" r="20" fill="#ffffff"/>
        {/* BM mark in centre */}
        <text x="120" y="126" textAnchor="middle" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="18" fill="#0f172a">BM</text>
      </svg>
    </div>
  );
}
