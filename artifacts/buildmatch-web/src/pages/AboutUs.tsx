import React from "react";
import { Link } from "wouter";
import { HardHat, Zap, MapPin, ShieldCheck, Users, Building2 } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-black text-xl tracking-tight hover:text-primary transition-colors">
            Build<span className="text-primary">Match</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">About BuildMatch</p>
          <h1 className="text-5xl font-black tracking-tight leading-tight mb-6">
            The flatform connecting<br />
            <span className="text-primary">construction</span> with talent.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            BuildMatch is a direct, no-middleman platform built for the UK construction industry — connecting contractors and building firms with the skilled tradespeople and labour they need, when they need them.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* The idea */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-6">Why we built it</h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Finding reliable tradespeople in the UK has always been slow, expensive, and opaque. Contractors spend hours chasing referrals. Skilled workers miss out on good jobs because they're not in the right person's phone book.
                </p>
                <p>
                  BuildMatch changes that. We built a simple, fast platform where builders post what they need and workers showcase what they do. Both sides swipe, connect, and get to work.
                </p>
                <p>
                  No agencies. No fees per hire. No gatekeepers. Just direct connections between the people who build Britain.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, label: "For Hirers", desc: "Post jobs, browse verified workers, and build your trusted crew." },
                { icon: HardHat, label: "For Workers", desc: "Showcase your skills, set your availability, and find work near you." },
                { icon: MapPin, label: "Location-first", desc: "Radius-based matching puts you in front of the right local opportunities." },
                { icon: Zap, label: "Instant connections", desc: "When both sides swipe right, you're connected instantly — no waiting." },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-secondary/50 border border-border rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <p className="font-bold text-sm mb-1">{label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* How it works */}
        <section className="bg-secondary/30 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-black tracking-tight mb-12 text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create your profile",
                  desc: "Workers list their trade, skills, certifications, and radius. Builders describe their company and the types of labour they typically need.",
                },
                {
                  step: "02",
                  title: "Swipe to connect",
                  desc: "Browse jobs or workers in your area. Swipe right on a good fit. When both sides match, a direct chat opens instantly.",
                },
                {
                  step: "03",
                  title: "Get to work",
                  desc: "Agree your terms directly. No commission, no agency cut — just two parties doing business the straightforward way.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="text-5xl font-black text-primary/20 mb-4">{step}</div>
                  <h3 className="text-lg font-black mb-3">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Values */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-black tracking-tight mb-12">What we stand for</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Transparency",
                desc: "No hidden fees, no inflated day rates. What you agree is what you pay.",
              },
              {
                icon: Users,
                title: "Community",
                desc: "Built for the trades, by people who understand how the industry actually works.",
              },
              {
                icon: Zap,
                title: "Speed",
                desc: "Labour shortages don't wait. BuildMatch is designed to get you connected in minutes, not days.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-border rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-5">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-black mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-white py-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black tracking-tight mb-4">Ready to get started?</h2>
            <p className="text-white/70 mb-8 text-lg">Join thousands of contractors and tradespeople already using BuildMatch across the UK.</p>
            <Link href="/">
              <span className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors cursor-pointer">
                Download the app
              </span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BuildMatch Limited. Registered in England & Wales · Company No. 17191553</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-primary font-medium transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary font-medium transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-primary font-medium transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
