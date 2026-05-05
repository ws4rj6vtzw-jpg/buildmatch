import { QRCodeSVG } from "qrcode.react";

const SITE_URL = "https://buildmatch.online/web/";
const WORKER_URL = "https://buildmatch.online/web/";
const HIRER_URL = "https://buildmatch.online/web/";

const AppleLogo = () => (
  <svg viewBox="0 0 814 1000" fill="currentColor" style={{ width: 16, height: 16, display: "inline-block", verticalAlign: "middle" }}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-155.5-117.2C156.1 753.7 99 639 99 529.3c0-183.3 120.1-280.5 238.9-280.5 64 0 117.2 42.8 157.2 42.8 38.2 0 98.4-45.2 170.1-45.2 21.3 0 126.4 2.1 197.2 117.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);

const PlayLogo = () => (
  <svg viewBox="0 0 512 512" style={{ width: 16, height: 16, display: "inline-block", verticalAlign: "middle" }}>
    <path d="M48 432L272 256 48 80v352z" fill="#EA4335"/>
    <path d="M48 80l224 176 64-50.4L96 48C79.3 38.9 61.1 39.2 48 80z" fill="#FBBC04"/>
    <path d="M48 432c13.1 40.8 31.3 41.1 48 32l240-137.6-64-50.4L48 432z" fill="#34A853"/>
    <path d="M272 256l128 100.4 56-32.1c18.6-16.5 18.6-43.2 0-59.7l-56-32.1L272 256z" fill="#4285F4"/>
  </svg>
);

const HardHatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2H2v2z"/>
    <path d="M20 15a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2"/>
    <path d="M12 2a8 8 0 0 1 8 8H4a8 8 0 0 1 8-8z"/>
    <path d="M12 2v5"/>
  </svg>
);

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>
  </svg>
);

export default function PrintAdverts() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", background: "#f0f0f0", padding: "24px" }}>

      {/* Screen-only controls */}
      <div className="no-print" style={{ maxWidth: 900, margin: "0 auto 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontWeight: 900, fontSize: 28, textTransform: "uppercase", letterSpacing: -1, margin: 0 }}>Printable Adverts</h1>
          <p style={{ color: "#666", margin: "4px 0 0", fontSize: 14 }}>Two A4 flyers — one for Workers, one for Hirers. Print double-sided or separately.</p>
        </div>
        <button
          onClick={() => window.print()}
          style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 800, fontSize: 16, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}
        >
          Print / Save PDF
        </button>
      </div>

      {/* === FLYER 1: WORKERS === */}
      <div className="print-page" style={{
        width: 794, minHeight: 1123, margin: "0 auto 40px", background: "#fff",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.15)"
      }}>
        {/* Header bar */}
        <div style={{ background: "#0f172a", padding: "32px 48px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "#3b82f6", fontWeight: 900, fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>BuildMatch</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 42, lineHeight: 1, textTransform: "uppercase", letterSpacing: -1 }}>
              Find Work.<br />
              <span style={{ color: "#3b82f6" }}>Fast.</span>
            </div>
          </div>
          <div style={{ color: "#3b82f6", marginTop: 4 }}>
            <HardHatIcon />
          </div>
        </div>

        {/* Blue accent stripe */}
        <div style={{ height: 6, background: "linear-gradient(90deg, #3b82f6, #1d4ed8)" }} />

        {/* Main body */}
        <div style={{ flex: 1, padding: "40px 48px", display: "flex", gap: 40 }}>
          {/* Left column */}
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 20, color: "#0f172a", lineHeight: 1.4, marginBottom: 28 }}>
              Are you a skilled tradesperson looking for your next job in the UK construction industry?
            </p>
            <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              BuildMatch connects workers directly with hirers — no agencies, no fees, no middlemen. Just swipe, match, and get to work.
            </p>

            <div style={{ marginBottom: 32 }}>
              {[
                "Create your free profile in minutes",
                "Set your day rate, skills & travel radius",
                "Swipe through local job opportunities",
                "Chat directly with hirers when you match",
                "Rate and build your reputation on site",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 2 }}>100% Free</div>
              <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>for workers — always.</div>
            </div>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Download on</div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ background: "#000", color: "#fff", borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <AppleLogo />
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: 0.5 }}>Download on the</div>
                    <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1 }}>App Store</div>
                  </div>
                </div>
                <div style={{ background: "#000", color: "#fff", borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <PlayLogo />
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>Get it on</div>
                    <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1 }}>Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — QR */}
          <div style={{ width: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 8 }}>
            <div style={{ background: "#0f172a", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2 }}>Scan to sign up</div>
              <div style={{ background: "#fff", borderRadius: 10, padding: 10 }}>
                <QRCodeSVG
                  value={WORKER_URL}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="H"
                />
              </div>
              <div style={{ color: "#64748b", fontSize: 10, textAlign: "center", fontWeight: 600, wordBreak: "break-all" }}>
                buildmatch.online
              </div>
            </div>

            {/* Trades badges */}
            <div style={{ marginTop: 24, width: "100%" }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, textAlign: "center" }}>Ideal for</div>
              {["Electricians", "Plumbers", "Plasterers", "Carpenters", "Groundworkers", "Bricklayers", "HVAC Engineers", "Steel Fixers"].map(t => (
                <div key={t} style={{ background: "#f1f5f9", borderRadius: 4, padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5, textAlign: "center" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#0f172a", padding: "14px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#475569", fontSize: 11, fontWeight: 600 }}>buildmatch.online · UK Construction Labour Platform</div>
          <div style={{ color: "#475569", fontSize: 11, fontWeight: 600 }}>© {new Date().getFullYear()} BuildMatch Limited · Co. No. 17191553</div>
        </div>
      </div>

      {/* Page break indicator */}
      <div className="no-print" style={{ maxWidth: 794, margin: "0 auto 40px", textAlign: "center", color: "#999", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>
        — Page Break —
      </div>

      {/* === FLYER 2: HIRERS === */}
      <div className="print-page" style={{
        width: 794, minHeight: 1123, margin: "0 auto 40px", background: "#fff",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.15)"
      }}>
        {/* Header bar */}
        <div style={{ background: "#1e3a5f", padding: "32px 48px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "#60a5fa", fontWeight: 900, fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>BuildMatch</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 42, lineHeight: 1, textTransform: "uppercase", letterSpacing: -1 }}>
              Hire Skilled<br />
              <span style={{ color: "#60a5fa" }}>Labour.</span>
            </div>
          </div>
          <div style={{ color: "#60a5fa", marginTop: 4 }}>
            <BuildingIcon />
          </div>
        </div>

        {/* Accent stripe */}
        <div style={{ height: 6, background: "linear-gradient(90deg, #1d4ed8, #3b82f6)" }} />

        {/* Main body */}
        <div style={{ flex: 1, padding: "40px 48px", display: "flex", gap: 40 }}>
          {/* Left column */}
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 20, color: "#0f172a", lineHeight: 1.4, marginBottom: 28 }}>
              Need reliable, qualified labour for your construction site — fast?
            </p>
            <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
              BuildMatch is the UK's first swipe-to-hire platform for the construction industry. Post your job, browse verified workers, and match with the right person — all without calling a single agency.
            </p>

            <div style={{ marginBottom: 32 }}>
              {[
                "Post a job in under 2 minutes",
                "Browse verified, ticket-holding tradespeople",
                "Filter by distance, day rate & availability",
                "Instant messaging when you match",
                "Workers rated after every job",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "16px 20px", marginBottom: 28 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#1d4ed8", marginBottom: 2 }}>No agency fees.</div>
              <div style={{ color: "#1e40af", fontSize: 13, fontWeight: 600 }}>Connect directly with workers. Pay a simple monthly subscription.</div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: 8, padding: "14px 16px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: 900, fontSize: 28, color: "#0f172a" }}>4k+</div>
                <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600 }}>Verified Trades</div>
              </div>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: 8, padding: "14px 16px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: 900, fontSize: 28, color: "#0f172a" }}>UK</div>
                <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600 }}>Construction Focus</div>
              </div>
              <div style={{ flex: 1, background: "#f8fafc", borderRadius: 8, padding: "14px 16px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: 900, fontSize: 28, color: "#0f172a" }}>24h</div>
                <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600 }}>Avg Match Time</div>
              </div>
            </div>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Download on</div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ background: "#000", color: "#fff", borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <AppleLogo />
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: 0.5 }}>Download on the</div>
                    <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1 }}>App Store</div>
                  </div>
                </div>
                <div style={{ background: "#000", color: "#fff", borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <PlayLogo />
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>Get it on</div>
                    <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1 }}>Google Play</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — QR */}
          <div style={{ width: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: 8 }}>
            <div style={{ background: "#1e3a5f", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2 }}>Scan to get started</div>
              <div style={{ background: "#fff", borderRadius: 10, padding: 10 }}>
                <QRCodeSVG
                  value={HIRER_URL}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#0f172a"
                  level="H"
                />
              </div>
              <div style={{ color: "#64748b", fontSize: 10, textAlign: "center", fontWeight: 600 }}>
                buildmatch.online
              </div>
            </div>

            {/* Hiring types */}
            <div style={{ marginTop: 24, width: "100%" }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, textAlign: "center" }}>Used by</div>
              {["Main Contractors", "Sub-Contractors", "House Builders", "Refurb Firms", "M&E Contractors", "Groundwork Firms", "Fit-Out Companies", "Independent PMs"].map(t => (
                <div key={t} style={{ background: "#eff6ff", borderRadius: 4, padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "#1e40af", marginBottom: 5, textAlign: "center" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#1e3a5f", padding: "14px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#4b6a8a", fontSize: 11, fontWeight: 600 }}>buildmatch.online · UK Construction Labour Platform</div>
          <div style={{ color: "#4b6a8a", fontSize: 11, fontWeight: 600 }}>© {new Date().getFullYear()} BuildMatch Limited · Co. No. 17191553</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @media print {
          body { margin: 0; background: #fff; }
          .no-print { display: none !important; }
          .print-page {
            width: 100% !important;
            min-height: 100vh !important;
            box-shadow: none !important;
            margin: 0 !important;
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}
