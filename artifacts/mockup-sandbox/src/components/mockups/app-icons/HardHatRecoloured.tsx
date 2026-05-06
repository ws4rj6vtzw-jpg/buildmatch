import brandHat from "../../../brand-hat-final.png";

export function HardHatRecoloured() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={brandHat} width={240} height={240} alt="Hard hat brand colours" />
    </div>
  );
}
