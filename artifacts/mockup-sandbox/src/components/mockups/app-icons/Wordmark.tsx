export function Wordmark() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="560" height="160" viewBox="0 0 560 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="560" height="160" rx="16" fill="#0f172a"/>
        {/* Build — white */}
        <text
          x="32"
          y="112"
          fontFamily="'Arial Black', Arial, sans-serif"
          fontWeight="900"
          fontSize="88"
          fill="#ffffff"
          letterSpacing="-3"
        >Build</text>
        {/* Match — blue */}
        <text
          x="280"
          y="112"
          fontFamily="'Arial Black', Arial, sans-serif"
          fontWeight="900"
          fontSize="88"
          fill="#3b82f6"
          letterSpacing="-3"
        >Match</text>
        {/* Amber underline */}
        <rect x="32" y="124" width="496" height="8" rx="4" fill="#f59e0b"/>
      </svg>
    </div>
  );
}
