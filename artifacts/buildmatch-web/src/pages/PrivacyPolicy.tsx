import React from "react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-black tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: 1 May 2025 · Effective: 1 May 2025</p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-10 text-foreground">

          <section>
            <h2 className="text-xl font-black mb-3">1. Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed"><strong className="text-foreground">BuildMatch UK Ltd</strong> ("BuildMatch", "we", "us", "our") is the data controller for personal information collected through the BuildMatch app and website. We are registered in England and Wales and are committed to protecting your privacy in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
            <p className="text-muted-foreground leading-relaxed mt-3">Contact our Data Protection team at: <a href="mailto:privacy@buildmatch.app" className="text-primary font-semibold hover:underline">privacy@buildmatch.app</a></p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We collect the following categories of personal information:</p>
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <h3 className="font-bold text-sm mb-2">Account & Profile Information</h3>
                <p className="text-muted-foreground text-sm">Name, phone number, role (Worker or Builder), profile photo, location (postcode), trade skills, certifications, work history, company name, and bio.</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <h3 className="font-bold text-sm mb-2">Usage Data</h3>
                <p className="text-muted-foreground text-sm">Swipe interactions, match history, messages sent, job postings, in-app activity, and feature usage.</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <h3 className="font-bold text-sm mb-2">Device & Technical Data</h3>
                <p className="text-muted-foreground text-sm">Device type, operating system, app version, IP address, and crash/error reports.</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <h3 className="font-bold text-sm mb-2">Payment Information</h3>
                <p className="text-muted-foreground text-sm">Subscription status and transaction IDs (processed by Apple or Google — we do not store card details).</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We use your personal information to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide and improve the BuildMatch platform and matching algorithm</li>
              <li>Create and manage your account</li>
              <li>Facilitate connections between Builders and Workers</li>
              <li>Process subscription payments through the relevant app store</li>
              <li>Send service-related notifications (new matches, messages, job alerts)</li>
              <li>Detect fraud, abuse, and ensure platform safety</li>
              <li>Comply with our legal obligations</li>
              <li>Conduct aggregated, anonymised analytics to improve the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">4. Legal Basis for Processing</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Under UK GDPR, we process your data on the following legal bases:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Contract performance</strong> — to deliver the BuildMatch service you signed up for</li>
              <li><strong className="text-foreground">Legitimate interests</strong> — to improve our platform, detect fraud, and ensure safety</li>
              <li><strong className="text-foreground">Legal obligation</strong> — where required by UK law</li>
              <li><strong className="text-foreground">Consent</strong> — for optional communications such as marketing emails (you can withdraw at any time)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">5. Sharing Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We share personal information only as necessary:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Other users</strong> — your profile (name, photo, skills, location) is visible to matched users</li>
              <li><strong className="text-foreground">RevenueCat</strong> — for subscription management (anonymous user IDs only)</li>
              <li><strong className="text-foreground">Cloud infrastructure providers</strong> — for hosting and data storage under data processing agreements</li>
              <li><strong className="text-foreground">Legal authorities</strong> — where required by law or court order</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">We never sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">We retain your account data for as long as your account is active. If you delete your account, we will delete your personal information within 30 days, except where we are required to retain it for legal or regulatory purposes (typically up to 7 years for financial records). Anonymised, aggregated data may be retained indefinitely for analytics.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong className="text-foreground">Rectification</strong> — correct inaccurate or incomplete data</li>
              <li><strong className="text-foreground">Erasure</strong> — request deletion of your data ("right to be forgotten")</li>
              <li><strong className="text-foreground">Restriction</strong> — ask us to limit processing in certain circumstances</li>
              <li><strong className="text-foreground">Portability</strong> — receive your data in a machine-readable format</li>
              <li><strong className="text-foreground">Objection</strong> — object to processing based on legitimate interests</li>
              <li><strong className="text-foreground">Withdraw consent</strong> — at any time for consent-based processing</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">To exercise any of these rights, contact us at <a href="mailto:privacy@buildmatch.app" className="text-primary font-semibold hover:underline">privacy@buildmatch.app</a>. You also have the right to lodge a complaint with the <strong className="text-foreground">Information Commissioner's Office (ICO)</strong> at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">ico.org.uk</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">8. Security</h2>
            <p className="text-muted-foreground leading-relaxed">We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. All data is encrypted in transit (TLS) and at rest. Despite these measures, no system is completely secure, and you use the service at your own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">9. Children</h2>
            <p className="text-muted-foreground leading-relaxed">BuildMatch is not directed at children under 18. We do not knowingly collect personal data from anyone under 18. If you believe a child has provided us with their data, please contact us and we will delete it promptly.</p>
          </section>

          <section>
            <h2 className="text-xl font-black mb-3">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">We may update this Privacy Policy periodically. We will notify you of significant changes via in-app notification or email. The "last updated" date at the top reflects the most recent revision.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-primary font-medium transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-primary font-medium transition-colors">Cookie Policy</Link>
          <Link href="/" className="hover:text-primary font-medium transition-colors">← Back to home</Link>
        </div>
      </main>

      <footer className="border-t border-border mt-8 py-8">
        <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} BuildMatch UK Ltd. Registered in England & Wales.</p>
      </footer>
    </div>
  );
}
