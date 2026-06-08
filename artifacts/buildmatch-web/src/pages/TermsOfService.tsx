import React from "react";
import { Link } from "wouter";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-black tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: 1 May 2025 · Effective: 1 May 2025</p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-10 text-foreground">

          <section>
            <h2 className="text-xl font-black mb-3">1. About BuildMatch</h2>
            <p className="text-muted-foreground leading-relaxed">BuildMatch is operated by <strong className="text-foreground">BuildMatch Limited</strong> (Company No. 17191553), a company registered in England and Wales. Our platform connects construction businesses ("Builders") with skilled tradespeople ("Workers") across the United Kingdom. By accessing or using BuildMatch, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">2. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">You must be at least 18 years old and legally permitted to work in the United Kingdom to create an account. By registering, you confirm that all information you provide is accurate and that you have the legal right to enter into this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">3. Your Account</h2>
            <p className="text-muted-foreground leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately if you suspect any unauthorised use. BuildMatch reserves the right to suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">4. How BuildMatch Works</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">BuildMatch acts solely as an introduction platform. We facilitate connections between Builders and Workers but are not a party to any employment, contracting, or payment arrangement between them. We do not:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Employ, direct, or supervise Workers</li>
              <li>Guarantee the quality, safety, or completion of any work</li>
              <li>Verify professional qualifications unless explicitly stated</li>
              <li>Manage or process payments between Builders and Workers</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">It is your responsibility to conduct your own due diligence before entering into any work arrangement.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">5. Subscriptions and Payments</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">BuildMatch offers paid subscription plans ("BuildMatch Pro") processed through Apple App Store or Google Play. By subscribing you agree to the relevant store's billing terms. Key points:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Subscriptions renew automatically unless cancelled at least 24 hours before the renewal date</li>
              <li>Prices are displayed in GBP and include VAT where applicable</li>
              <li>Worker Boost: £9.99/month (includes a 7-day free trial for new subscribers) — verified badge, priority listing, instant job alerts, profile boosting</li>
              <li>Hirer Basic: £14.90/month + £5 per successful match</li>
              <li>Hirer Pro: £24.90/month + £5 per successful match (includes boosted listings, verified builder badge, priority support)</li>
              <li>Refunds are handled in accordance with Apple App Store or Google Play Store policies</li>
              <li>We reserve the right to change pricing with 30 days' notice to existing subscribers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">6. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You agree not to use BuildMatch to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Harass, abuse, or threaten other users</li>
              <li>Circumvent the platform to avoid fees or obligations</li>
              <li>Violate any applicable employment, data protection, or health and safety law</li>
              <li>Scrape, reverse-engineer, or interfere with the platform's operation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">7. Content and Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">You retain ownership of content you post (profile information, photos, messages). By posting content, you grant BuildMatch a non-exclusive, royalty-free licence to use, display, and distribute that content solely for the purpose of operating the platform. BuildMatch's brand, design, and underlying technology remain the exclusive property of BuildMatch Limited.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">To the fullest extent permitted by English law, BuildMatch Limited shall not be liable for any indirect, incidental, or consequential loss arising from your use of the platform, including disputes between Builders and Workers, loss of earnings, or reliance on information provided by other users. Our total aggregate liability shall not exceed the fees you paid to us in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">9. Right to Work</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              BuildMatch does not verify, and accepts no responsibility for verifying, any user's right to work in the United Kingdom. It is the sole responsibility of each Builder (as the engaging party) to carry out all legally required right-to-work checks before allowing any Worker to commence work, in full compliance with the Immigration, Asylum and Nationality Act 2006 and any applicable Home Office guidance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BuildMatch explicitly disclaims all liability for any penalties, fines, or legal consequences arising from a failure to conduct such checks. By using the platform, Builders confirm they understand and accept this obligation. Workers represent that they have the legal right to work in the UK for any engagement arranged through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">10. Insurance</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              BuildMatch is not an insurer and provides no insurance of any kind to any party. Each user is solely responsible for obtaining and maintaining all insurance cover appropriate to their activities, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-3">
              <li><strong className="text-foreground">Public liability insurance</strong> — covering injury to third parties or damage to third-party property arising from their work</li>
              <li><strong className="text-foreground">Employers' liability insurance</strong> — where legally required for any workers engaged</li>
              <li><strong className="text-foreground">Professional indemnity insurance</strong> — where applicable to the nature of the work undertaken</li>
              <li><strong className="text-foreground">Plant, tools, and equipment insurance</strong> — covering any machinery, tools, or materials brought on to a site</li>
              <li><strong className="text-foreground">Property or site insurance</strong> — Builders are responsible for ensuring adequate cover for works carried out at their premises or sites</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              BuildMatch accepts no liability for any loss, damage, injury, or claim arising from uninsured or underinsured activities. Users are strongly advised to confirm appropriate cover is in place before any work commences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">11. Tax, Self-Employment & IR35</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              BuildMatch is a technology platform that facilitates introductions only. It does not employ Workers, operate a payroll, or act as an agency within the meaning of the Employment Agencies Act 1973. Each user is solely responsible for their own tax affairs, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-3">
              <li>Registration with HM Revenue & Customs (HMRC) as self-employed or via a limited company, as appropriate</li>
              <li>Submission of Self Assessment tax returns and payment of Income Tax and National Insurance contributions</li>
              <li>VAT registration and returns where applicable</li>
              <li>Corporation Tax obligations for limited company contractors</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-3">
              <strong className="text-foreground">IR35 / Off-Payroll Working Rules:</strong> Where the off-payroll working rules (commonly known as IR35, governed by Chapter 10, ITEPA 2003, as amended by the Finance Act 2021) may apply to an engagement arranged through BuildMatch, it is the sole responsibility of the Builder (as the client/end-user of services) to carry out a Status Determination Statement (SDS) assessment and, where required, to operate PAYE and account for National Insurance. BuildMatch takes no responsibility for any IR35 determination or any resulting tax liability, penalties, or interest.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BuildMatch strongly recommends that both Workers and Builders seek independent professional tax and legal advice before entering into any engagement where employment status or IR35 may be a consideration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">12. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">You may delete your account at any time within the app. We may suspend or terminate your account if you breach these Terms, with or without notice depending on the severity of the breach. Upon termination, your right to use the platform ceases immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">13. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">14. Changes to These Terms</h2>
            <p className="text-muted-foreground leading-relaxed">We may update these Terms from time to time. We will notify you of material changes via the app or email at least 14 days before they take effect. Continued use of BuildMatch after that date constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">15. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">For questions about these Terms, please contact us at <a href="mailto:accounts@buildmatch.online" className="text-primary font-semibold hover:underline">accounts@buildmatch.online</a>.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-primary font-medium transition-colors">Privacy Policy</Link>
          <Link href="/cookies" className="hover:text-primary font-medium transition-colors">Cookie Policy</Link>
          <Link href="/" className="hover:text-primary font-medium transition-colors">← Back to home</Link>
        </div>
      </main>

      <footer className="border-t border-border mt-8 py-8">
        <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} BuildMatch Limited. Registered in England & Wales · Company No. 17191553</p>
      </footer>
    </div>
  );
}
