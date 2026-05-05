import React from "react";
import { Link } from "wouter";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight hover:text-primary transition-colors">
            Build<span className="text-primary">Match</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-black tracking-tight mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: 1 May 2025 · Effective: 1 May 2025</p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-10 text-foreground">

          <section>
            <h2 className="text-xl font-black mb-3">1. What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and improve your experience. BuildMatch uses cookies on our marketing website (buildmatch.app). The BuildMatch mobile app uses equivalent local storage technologies.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">2. Cookies We Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use the following categories of cookies:</p>

            <div className="space-y-4">
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-primary/10 px-5 py-3 border-b border-border">
                  <h3 className="font-bold text-sm">Strictly Necessary</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Always active — required for the website to function</p>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide border-b border-border pb-2">
                    <span>Cookie</span><span>Purpose</span><span>Duration</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">bm_session</span>
                    <span>Maintains your session state</span>
                    <span>Session</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">bm_csrf</span>
                    <span>CSRF protection token</span>
                    <span>Session</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary/60 px-5 py-3 border-b border-border">
                  <h3 className="font-bold text-sm">Functional</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Remember your preferences and settings</p>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide border-b border-border pb-2">
                    <span>Cookie</span><span>Purpose</span><span>Duration</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">bm_theme</span>
                    <span>Remembers light/dark mode preference</span>
                    <span>1 year</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">bm_region</span>
                    <span>Stores your preferred UK region</span>
                    <span>1 year</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-secondary/60 px-5 py-3 border-b border-border">
                  <h3 className="font-bold text-sm">Analytics</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Help us understand how the site is used (anonymised)</p>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide border-b border-border pb-2">
                    <span>Cookie</span><span>Purpose</span><span>Duration</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">_bm_anon</span>
                    <span>Anonymous visitor identifier for usage analytics</span>
                    <span>2 years</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">_bm_ref</span>
                    <span>Stores referral source for attribution</span>
                    <span>30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">3. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We may use the following third-party services that set their own cookies:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">RevenueCat</strong> — subscription analytics (anonymised)</li>
              <li><strong className="text-foreground">Expo / React Native</strong> — mobile app crash reporting and diagnostics</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">We do not use Google Analytics, Facebook Pixel, or any advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">4. Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You have several options for controlling cookies:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Browser settings</strong> — most browsers allow you to view, block, or delete cookies via their settings menu. Blocking strictly necessary cookies may affect how the site functions.</li>
              <li><strong className="text-foreground">Our preference centre</strong> — you can opt out of analytics cookies at any time by contacting us at <a href="mailto:accounts@buildmatch.online" className="text-primary font-semibold hover:underline">accounts@buildmatch.online</a>.</li>
              <li><strong className="text-foreground">Mobile app</strong> — you can reset or clear local app storage via your device's app settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">5. Your Consent</h2>
            <p className="text-muted-foreground leading-relaxed">When you first visit our website, we display a cookie notice. Strictly necessary cookies are activated without consent. All other cookies require your explicit consent, in line with the UK Privacy and Electronic Communications Regulations (PECR) and UK GDPR. You can withdraw consent at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">6. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">We may update this Cookie Policy as our practices evolve or as required by law. The "last updated" date at the top of this page reflects the most recent revision.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">7. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">For any questions about our use of cookies, please contact <a href="mailto:accounts@buildmatch.online" className="text-primary font-semibold hover:underline">accounts@buildmatch.online</a>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-primary font-medium transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-primary font-medium transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-primary font-medium transition-colors">← Back to home</Link>
        </div>
      </main>

      <footer className="border-t border-border mt-8 py-8">
        <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} BuildMatch Limited. Registered in England & Wales · Company No. 17191553</p>
      </footer>
    </div>
  );
}
