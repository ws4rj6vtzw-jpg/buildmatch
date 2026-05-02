export function Syne() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        .font-preview * { font-family: 'Syne', sans-serif !important; }
      `}</style>
      <AppPreview fontName="Syne" />
    </>
  );
}

function AppPreview({ fontName }: { fontName: string }) {
  return (
    <div className="font-preview" style={{ background: "#F0F5FF", minHeight: "100vh", display: "flex", flexDirection: "column", width: 320 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #DBEAFE", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#0A1628", textTransform: "uppercase" }}>BUILDMATCH</span>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>DM</span>
        </div>
      </div>

      <div style={{ padding: "16px 18px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.8px", color: "#5B7AA8", textTransform: "uppercase" }}>Discover</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#3B82F6" }}>London · 5km</span>
      </div>

      <div style={{ margin: "0 14px", background: "#fff", borderRadius: 18, border: "1px solid #DBEAFE", overflow: "hidden", flex: 1, maxHeight: 420, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "linear-gradient(135deg, #1E3152 0%, #3B82F6 100%)", height: 220, position: "relative" }}>
          <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "4px 8px" }}>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>📍 2.4km</span>
          </div>
          <div style={{ position: "absolute", top: 14, left: 14, background: "#22C55E", borderRadius: 99, padding: "3px 10px" }}>
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Available now</span>
          </div>
        </div>

        <div style={{ padding: "14px 16px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0A1628", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                JAMES T. <span style={{ fontSize: 16, color: "#3B82F6" }}>✓</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#3B82F6", marginTop: 2 }}>Scaffolder · NW London</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0891B2" }}>£180<span style={{ fontSize: 11, fontWeight: 500, color: "#5B7AA8" }}>/day</span></div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {["CSCS Gold", "IPAF", "12 yrs exp"].map(t => (
              <span key={t} style={{ background: "#EFF4FF", border: "1px solid #DBEAFE", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.3px" }}>{t}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#F59E0B", fontSize: 14 }}>★</span>)}
            <span style={{ fontSize: 12, fontWeight: 600, color: "#5B7AA8" }}>5.0 · 48 jobs</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", padding: "18px 0 10px" }}>
        <button style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff", border: "1.5px solid #DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✕</button>
        <button style={{ width: 56, height: 56, borderRadius: "50%", background: "#3B82F6", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff" }}>⚡</button>
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #DBEAFE", display: "flex", justifyContent: "space-around", padding: "10px 0 6px" }}>
        {["Discover", "Jobs", "Matches", "Profile"].map((tab, i) => (
          <div key={tab} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: 22, height: 22, borderRadius: 4, background: i === 0 ? "#3B82F6" : "#EFF4FF" }} />
            <span style={{ fontSize: 10, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "#3B82F6" : "#5B7AA8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{tab}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "#0A1628", padding: "8px 16px", textAlign: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", letterSpacing: "1px", textTransform: "uppercase" }}>{fontName}</span>
      </div>
    </div>
  );
}
