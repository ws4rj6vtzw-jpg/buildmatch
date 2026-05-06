import originalIcon from "../../../original-icon.png";

export function OriginalRef() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={originalIcon} width={240} height={240} style={{ borderRadius: 54 }} alt="Original icon" />
    </div>
  );
}
