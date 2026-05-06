export function Monogram() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="240" rx="54" fill="#0f172a"/>
        {/* B */}
        <text x="28" y="168" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="148" fill="#ffffff" letterSpacing="-8">B</text>
        {/* M — offset right, blue */}
        <text x="104" y="168" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="148" fill="#3b82f6" letterSpacing="-8">M</text>
        {/* Yellow accent bar */}
        <rect x="28" y="182" width="184" height="10" rx="5" fill="#f59e0b"/>
      </svg>
    </div>
  );
}
