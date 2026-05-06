import brandHat from "../../../brand-hat-final.png";

export function LogoExport() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dark background version */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 18,
          padding: "24px 36px",
          background: "#0f172a",
          borderRadius: 20,
        }}
      >
        <img
          src={brandHat}
          width={72}
          height={72}
          alt="BuildMatch"
          style={{ borderRadius: 16, display: "block" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span
            style={{
              fontFamily: "'Arial Black', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: 38,
              letterSpacing: "-1.5px",
              color: "#ffffff",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            BUILD
          </span>
          <span
            style={{
              fontFamily: "'Arial Black', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: 38,
              letterSpacing: "-1.5px",
              color: "#4F73D6",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            MATCH
          </span>
        </div>
      </div>
    </div>
  );
}
