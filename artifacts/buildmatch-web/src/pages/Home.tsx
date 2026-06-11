import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardHat, Smartphone, Zap, MapPin, CheckCircle, ShieldCheck, ArrowRight, Star, Clock, Building2, Apple, Play, ChevronRight, ChevronLeft, Menu, X, Users, ThumbsUp, Award, Bell, FileText, TrendingUp } from "lucide-react";

const FadeIn = ({ children, delay = 0, className = "", direction = "up" }: { children: React.ReactNode, delay?: number, className?: string, direction?: "up" | "left" | "right" }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const y = direction === "up" ? 40 : 0;
  const x = direction === "left" ? 40 : direction === "right" ? -40 : 0;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y, x },
        visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, delay, ease: "easeOut" } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-accent selection:text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-black text-2xl tracking-tighter uppercase">BUILDMATCH</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide uppercase text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#trades" className="hover:text-foreground transition-colors">For Workers</a>
            <a href="#builders" className="hover:text-foreground transition-colors">For Hirers</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-foreground hover:bg-foreground/5 hover:text-foreground rounded-none font-bold uppercase tracking-wider">Log In</Button>
            <Button className="bg-accent hover:bg-accent/90 text-white rounded-none font-black uppercase tracking-wider shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all">Get the App</Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-black uppercase tracking-wider">
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-border pb-4">How it works</a>
              <a href="#trades" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-border pb-4">For Workers</a>
              <a href="#builders" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-border pb-4">For Hirers</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-border pb-4">Pricing</a>
              <Button className="bg-accent text-white rounded-none h-14 mt-4 text-lg font-black uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)]">Get the App</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt="Construction worker" className="w-full h-full object-cover opacity-15 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <FadeIn delay={0.1}>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.95] mb-6 uppercase tracking-tighter">
                Hire Smarter, <br />
                <span className="text-primary relative inline-block">
                  Build Faster.
                  <div className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10 transform -skew-x-12"></div>
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-lg leading-snug font-medium">
                The UK's first swipe-to-hire platform for construction. Match and connect with qualified and reliable labour and skilled tradespeople in your area.
              </p>
            </FadeIn>
            <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4 items-center">
              <a href="#" className="hover:opacity-80 transition-opacity" style={{ display: 'flex', alignItems: 'center', height: 48, overflow: 'hidden' }}>
                <img src={`${import.meta.env.BASE_URL}images/badge-app-store.svg`} alt="Download on the App Store" style={{ height: 48, width: 'auto' }} />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.gordonwilson.buildmatch" className="hover:opacity-80 transition-opacity" style={{ display: 'flex', alignItems: 'center', height: 48, overflow: 'hidden' }}>
                <img src={`${import.meta.env.BASE_URL}images/badge-google-play.png`} alt="Get it on Google Play" style={{ height: 71, width: 'auto' }} />
              </a>
            </FadeIn>
            
            <FadeIn delay={0.4} className="mt-12 flex items-center gap-4 text-sm font-bold text-muted-foreground uppercase tracking-wider border-t border-border pt-8">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-background"><HardHat className="w-5 h-5 text-white" /></div>
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center border-2 border-background"><Zap className="w-5 h-5 text-white" /></div>
                <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center border-2 border-background text-xs text-background">4k+</div>
              </div>
              <p>Trusted by <span className="text-foreground">4,000+</span> trades across London</p>
            </FadeIn>
          </div>

          {/* Phone mock — reflects current dark-theme app UI */}
          <div className="relative h-[600px] hidden lg:flex items-center justify-center">
            <FadeIn delay={0.4} direction="left" className="relative w-full max-w-[300px] aspect-[9/19] bg-[#0f172a] rounded-[3rem] border-[10px] border-[#1E293B] shadow-2xl overflow-hidden ring-1 ring-black/10">
              {/* Status bar */}
              <div className="absolute top-0 inset-x-0 h-7 bg-[#0f172a] flex items-center justify-center z-20">
                <div className="w-20 h-4 bg-[#1E293B] rounded-b-xl"></div>
              </div>
              
              {/* App UI */}
              <div className="absolute inset-0 flex flex-col pt-8">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3">
                  <div className="text-base font-black tracking-tighter text-white">DISCOVER</div>
                  <Badge className="border-none bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-sm uppercase text-[9px] tracking-widest font-bold">
                    🔥 3 nearby
                  </Badge>
                </div>
                
                {/* Swipe card */}
                <div className="flex-1 mx-3 mb-2 relative rounded-2xl overflow-hidden bg-[#1E293B] border border-white/10 shadow-xl">
                  <img src={`${import.meta.env.BASE_URL}images/worker-1.png`} alt="Worker profile" className="w-full h-full object-cover" />
                  
                  {/* Distance badge */}
                  <div className="absolute top-3 right-3 bg-[#0f172a]/80 backdrop-blur border border-white/10 rounded-md px-2 py-1 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-[#F59E0B]" />
                    <span className="text-[10px] font-bold text-white">2.4 mi</span>
                  </div>

                  {/* Verified badge */}
                  <div className="absolute top-3 left-3 bg-[#4F73D6]/90 rounded-md px-2 py-1 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-white" />
                    <span className="text-[9px] font-bold text-white uppercase">Verified</span>
                  </div>

                  {/* Worker info overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/85 to-transparent p-4 pt-16">
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">Liam M.</h3>
                        <p className="text-[#4F73D6] font-bold text-xs mt-0.5">Level 3 Electrician</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-[#F59E0B]">£220<span className="text-[10px] text-white/50 font-normal">/day</span></p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-white/10 text-white text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded-sm border border-white/10">JIB Gold</span>
                      <span className="bg-white/10 text-white text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded-sm border border-white/10">IPAF</span>
                      <span className="bg-white/10 text-white text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded-sm border border-white/10">Own Tools</span>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-5 justify-center py-3">
                  <button className="w-12 h-12 rounded-full bg-[#1E293B] border border-white/10 flex items-center justify-center shadow-lg">
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                  <button className="w-14 h-14 rounded-full bg-[#4F73D6] flex items-center justify-center shadow-[0_0_20px_rgba(79,115,214,0.5)]">
                    <Zap className="w-6 h-6 text-white fill-current" />
                  </button>
                </div>

                {/* Tab bar */}
                <div className="flex justify-around items-center px-4 py-2 border-t border-white/10 bg-[#0f172a]/90 backdrop-blur">
                  {[
                    { icon: "⚡", label: "Discover", active: true },
                    { icon: "💼", label: "Jobs", active: false },
                    { icon: "💬", label: "Matches", active: false },
                    { icon: "👤", label: "Profile", active: false },
                  ].map((tab) => (
                    <div key={tab.label} className="flex flex-col items-center gap-0.5">
                      <span className="text-sm">{tab.icon}</span>
                      <span className={`text-[8px] font-bold uppercase ${tab.active ? "text-[#4F73D6]" : "text-white/30"}`}>{tab.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            
            {/* Floating match notification */}
            <FadeIn delay={0.6} direction="right" className="absolute top-1/4 -right-10 bg-card p-4 border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[200px] transform rotate-3">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500/20 flex items-center justify-center text-green-500 flex-shrink-0 rounded-sm">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-tight leading-none mb-1">It's a Match!</div>
                  <p className="text-[10px] text-muted-foreground font-medium">Liam M. is ready to start Monday.</p>
                </div>
              </div>
            </FadeIn>
            
            {/* Floating document verified */}
            <FadeIn delay={0.7} direction="left" className="absolute bottom-1/3 -left-14 bg-card p-4 border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] transform -rotate-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-[#4F73D6]/20 flex items-center justify-center text-[#4F73D6]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase">CSCS Verified</div>
                  <div className="text-[10px] text-muted-foreground font-medium">Docs checked in-app</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 md:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Swipe. <span className="text-accent">Match.</span> Build.</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">No CVs. No cover letters. Just raw credentials, day rates, and location.</p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-[10%] right-[10%] h-px bg-border -z-10"></div>
            
            <FadeIn delay={0.1}>
              <div className="bg-card border border-border p-8 text-center h-full hover:bg-secondary/50 transition-colors group">
                <div className="w-20 h-20 mx-auto bg-background border border-border flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Set Your Terms</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Trades set their day rate, skills, and travel radius. Builders post site needs, duration, and budget. Upload your tickets once and they're verified for every job.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-card border border-border p-8 text-center h-full hover:bg-secondary/50 transition-colors group relative">
                <div className="w-20 h-20 mx-auto bg-background border border-border flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Swipe to Match</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Review profiles showing only what matters: tickets, distance, rate, and past ratings. Right swipe if they fit. It's mutual — both sides have to say yes.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-card border border-border p-8 text-center h-full hover:bg-secondary/50 transition-colors group">
                <div className="w-20 h-20 mx-auto bg-background border border-border flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <CheckCircle className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Chat & Hire</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">When both sides swipe right, instant messaging opens up. Agree on start times, share site inductions, get to work. No middleman, no delays.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* For Trades Section */}
      <section id="trades" className="py-24 md:py-32 px-6 bg-secondary relative border-y border-border">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" />
            <line x1="20" y1="100" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" />
            <line x1="40" y1="100" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" />
            <line x1="60" y1="100" x2="100" y2="60" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <FadeIn>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-border p-6 transform hover:-translate-y-1 transition-transform shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-black text-xl mb-2 uppercase tracking-tight">No Agencies</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">Cut out the middleman. Talk direct to site managers and keep 100% of your day rate. No umbrella company cuts.</p>
                  </div>
                  
                  <div className="bg-card border border-border p-6 sm:mt-12 transform hover:-translate-y-1 transition-transform shadow-sm">
                    <div className="w-12 h-12 bg-accent/10 flex items-center justify-center mb-6">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-black text-xl mb-2 uppercase tracking-tight">Local Work</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">Set your postcode and max travel distance. Only see jobs you can actually commute to without spending hours on the M25.</p>
                  </div>
                  
                  <div className="bg-card border border-border p-6 transform hover:-translate-y-1 transition-transform shadow-sm">
                    <div className="w-12 h-12 bg-foreground/5 flex items-center justify-center mb-6">
                      <FileText className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="font-black text-xl mb-2 uppercase tracking-tight">Digital Tickets</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">Upload your CSCS, SMSTS, IPAF, PASMA, First Aid, and insurance docs once. Verified and ready to share — no more emailing photos.</p>
                  </div>
                  
                  <div className="bg-card border border-border p-6 sm:mt-12 transform hover:-translate-y-1 transition-transform shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6">
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-black text-xl mb-2 uppercase tracking-tight">Toggle Status</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">Got a long contract? Toggle "Unavailable" and go hidden. Job finishing Friday? Toggle "Looking" and line up the next one.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <div className="order-1 md:order-2">
              <FadeIn>
                <div className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6">For Workers</div>
                <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-6">
                  The jobs come <span className="text-primary">to you.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
                  Stop scrolling through endless job boards filled with fake agency listings. Create a profile, set your rate, and let contractors swipe right on you.
                </p>
                
                <div className="flex flex-col gap-6 mb-10">
                  <div className="flex items-center gap-4 bg-card border border-border p-4 shadow-sm">
                    <div className="w-12 h-12 flex-shrink-0 bg-secondary flex items-center justify-center border border-border">
                      <span className="font-black text-xl text-muted-foreground">£</span>
                    </div>
                    <div>
                      <div className="font-black uppercase tracking-tight">You set the rate</div>
                      <div className="text-sm text-muted-foreground">Builders see your minimum. Take it or leave it.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-card border border-border p-4 shadow-sm">
                    <div className="w-12 h-12 flex-shrink-0 bg-secondary flex items-center justify-center border border-border">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-black uppercase tracking-tight">Worker Boost — £9.99/mo</div>
                      <div className="text-sm text-muted-foreground">Verified badge, priority listing, instant job alerts. 7-day free trial.</div>
                    </div>
                  </div>
                </div>

                <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-none h-14 px-8 text-lg font-black uppercase tracking-wider w-full sm:w-auto">
                  Create Worker Profile <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* For Builders Section */}
      <section id="builders" className="py-24 md:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn>
              <div className="inline-block bg-accent text-background text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6">For Hirers</div>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-6">
                Never Stop <span className="text-accent">Building.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
                Site manager nightmare: It's Thursday afternoon and your bricklayers just pulled out. With BuildMatch, fill gaps on site in hours, not days.
              </p>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.15rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                
                <div className="relative flex items-start gap-6">
                  <div className="w-10 h-10 rounded-full bg-card border border-accent flex items-center justify-center flex-shrink-0 relative z-10 shadow-[0_0_15px_rgba(8,145,178,0.2)]">
                    <span className="text-accent font-black">1</span>
                  </div>
                  <div className="pt-2 pb-6">
                    <h4 className="font-black text-xl uppercase tracking-tight mb-2">Post requirement</h4>
                    <p className="text-muted-foreground font-medium bg-secondary border border-border p-4 text-sm font-mono">
                      &gt; Need 2 Carpenters<br/>
                      &gt; Location: Kensington W8<br/>
                      &gt; Duration: 4 weeks<br/>
                      &gt; Budget: £240/day
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-6">
                  <div className="w-10 h-10 rounded-full bg-card border border-primary flex items-center justify-center flex-shrink-0 relative z-10 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                    <span className="text-primary font-black">2</span>
                  </div>
                  <div className="pt-2 pb-6">
                    <h4 className="font-black text-xl uppercase tracking-tight mb-2">Swipe Available Local Labour</h4>
                    <p className="text-muted-foreground font-medium">The algorithm instantly shows you verified tradespeople who match your criteria, are available now, and within range. Every profile has verified tickets.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-6">
                  <div className="w-10 h-10 rounded-full bg-card border border-foreground/30 flex items-center justify-center flex-shrink-0 relative z-10 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                    <span className="text-foreground font-black">3</span>
                  </div>
                  <div className="pt-2">
                    <h4 className="font-black text-xl uppercase tracking-tight mb-2">Match & Chat</h4>
                    <p className="text-muted-foreground font-medium">When they swipe back, open a direct chat. Confirm induction times and get the site moving.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
          
          <div className="relative">
            <FadeIn direction="left">
              <div className="relative aspect-[4/5] bg-secondary border border-border p-6 overflow-hidden">
                <img src={`${import.meta.env.BASE_URL}images/manager-1.png`} alt="Site Manager" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="self-end bg-white/90 backdrop-blur-md border border-border px-4 py-2 flex items-center gap-3 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-xs uppercase tracking-widest text-foreground">Project: Elephant &amp; Castle</span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 text-foreground text-shadow-sm">Daily Site Dashboard</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-white/90 backdrop-blur border border-border p-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 flex items-center justify-center"><Zap className="w-4 h-4 text-primary" /></div>
                          <div>
                            <div className="font-bold text-foreground text-sm uppercase">Electricians</div>
                            <div className="text-xs text-muted-foreground">3 needed • 3 filled</div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-600 border-none rounded-sm">STAFFED</Badge>
                      </div>

                      <div className="bg-white/90 backdrop-blur border border-accent/40 p-4 flex justify-between items-center transform scale-105 shadow-[0_4px_20px_rgba(8,145,178,0.15)] relative">
                        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-accent"></div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent/20 flex items-center justify-center"><Users className="w-4 h-4 text-accent" /></div>
                          <div>
                            <div className="font-bold text-foreground text-sm uppercase">Dryliners</div>
                            <div className="text-xs text-muted-foreground">2 needed • 0 filled</div>
                          </div>
                        </div>
                        <Button size="sm" className="bg-accent hover:bg-accent/80 text-white rounded-none text-xs font-bold uppercase h-8">Find Now</Button>
                      </div>
                      
                      <div className="bg-white/90 backdrop-blur border border-border p-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-foreground/8 flex items-center justify-center"><HardHat className="w-4 h-4 text-foreground" /></div>
                          <div>
                            <div className="font-bold text-foreground text-sm uppercase">Labourers</div>
                            <div className="text-xs text-muted-foreground">4 needed • 4 filled</div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-600 border-none rounded-sm">STAFFED</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4} direction="up" className="absolute -bottom-8 -right-8 bg-primary p-6 border-4 border-background shadow-2xl z-20 max-w-[200px]">
              <div className="text-5xl font-black text-white mb-2">8hr</div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80 leading-tight">Average time to fill an urgent site vacancy.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing Section — updated to match actual in-app pricing */}
      <section id="pricing" className="py-24 md:py-32 px-6 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center mb-16 relative z-10">
          <FadeIn>
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-6">Straight Up <span className="text-primary">Pricing.</span></h2>
            <p className="text-xl text-muted-foreground font-medium">No hidden agency fees. No percentages taken from day rates. Ever.</p>
          </FadeIn>
        </div>

        {/* Workers row */}
        <div className="max-w-5xl mx-auto relative z-10 mb-10">
          <FadeIn>
            <div className="bg-card border border-border p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8 shadow-sm">
              <div className="flex-1">
                <div className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4">For Workers</div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl font-black text-foreground">Free</span>
                  <span className="text-muted-foreground font-bold uppercase tracking-wider text-sm">always</span>
                </div>
                <p className="text-muted-foreground font-medium text-lg">You do the hard work. We don't take a cut.</p>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Unlimited job matching",
                  "Digital ticket storage (CSCS, IPAF, PASMA…)",
                  "Document verification",
                  "Keep 100% of your agreed rate",
                  "Direct messaging with matches",
                  "Apply to jobs directly",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
              <div className="md:w-64 flex-shrink-0">
                <div className="bg-secondary border border-border p-6 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="text-xs font-black uppercase tracking-widest text-accent">Worker Boost</span>
                  </div>
                  <div className="text-3xl font-black text-foreground mb-0.5">£9.99</div>
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-4">/month</div>
                  <div className="bg-accent/10 border border-accent/30 rounded-sm px-3 py-1.5 text-xs font-bold text-accent mb-4">7-day free trial</div>
                  <ul className="text-left space-y-2 mb-4">
                    {[
                      "Verified badge on profile",
                      "Boosted to top of discover",
                      "Instant job alerts",
                      "5 DMs / month before matching",
                    ].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full rounded-none border-accent text-accent hover:bg-accent hover:text-white h-10 font-black uppercase text-xs tracking-wider">
                    Try Free
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Builder tiers */}
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-8">
              <div className="inline-block bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest px-3 py-1 mb-2">For Hirers</div>
              <p className="text-muted-foreground font-medium">Start with 5 free swipes, then choose the plan that fits your site.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-0">
            {/* Basic */}
            <FadeIn delay={0.1} direction="right">
              <div className="bg-card border border-border p-8 h-full flex flex-col shadow-sm hover:bg-secondary/30 transition-colors">
                <h3 className="text-xl font-black uppercase tracking-tight mb-1 text-foreground">Basic</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-foreground">£14.90</span>
                  <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">/mo</span>
                </div>
                <p className="text-sm text-accent font-bold mb-6">+ £8 per placement</p>
                <ul className="space-y-3 mb-8 flex-1 text-sm font-medium text-foreground/80">
                  {[
                    "Unlimited swipes",
                    "3 job posts / month",
                    "Browse worker contact info",
                    "Matched workers messaging",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full rounded-none h-12 font-black uppercase tracking-wider border-border hover:bg-foreground/5">Get Started</Button>
              </div>
            </FadeIn>

            {/* Pro — featured */}
            <FadeIn delay={0.2}>
              <div className="bg-primary p-8 h-full flex flex-col relative shadow-[0_0_50px_rgba(59,130,246,0.25)] md:-my-4 md:z-10">
                <div className="absolute top-0 right-0 bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-3 py-1.5">Most Popular</div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-1 text-white mt-3">Pro</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">£24.90</span>
                  <span className="text-white/70 text-sm font-bold uppercase tracking-wider">/mo</span>
                </div>
                <p className="text-sm text-accent font-bold mb-6">+ £5 per placement</p>
                <ul className="space-y-3 mb-8 flex-1 text-sm font-medium text-white">
                  {[
                    "Unlimited swipes",
                    "Unlimited job posts",
                    "Browse worker contact info",
                    "5 DMs / month before matching",
                    "Verified builder badge",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-none h-12 font-black uppercase tracking-wider shadow-xl">Get Started</Button>
              </div>
            </FadeIn>

            {/* Elite */}
            <FadeIn delay={0.3} direction="left">
              <div className="bg-card border border-border p-8 h-full flex flex-col shadow-sm hover:bg-secondary/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Elite</h3>
                  <span className="text-[10px] bg-accent/20 text-accent font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">Best value</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-foreground">£49.90</span>
                  <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">/mo</span>
                </div>
                <p className="text-sm text-green-500 font-bold mb-6">No placement fee</p>
                <ul className="space-y-3 mb-8 flex-1 text-sm font-medium text-foreground/80">
                  {[
                    "Unlimited swipes",
                    "Unlimited job posts",
                    "Browse worker contact info",
                    "Unlimited DMs before matching",
                    "Verified builder badge",
                    "Priority support & analytics",
                    "Job listings boosted to top",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full rounded-none h-12 font-black uppercase tracking-wider border-border hover:bg-foreground/5">Get Started</Button>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4}>
            <p className="text-center text-sm text-muted-foreground font-medium mt-6">All plans billed monthly. Cancel any time from the app. Placement fee charged only when a hire is confirmed.</p>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden bg-accent border-y border-white/10">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-8 text-background drop-shadow-sm">
              Tools down. <br />
              <span className="text-white">Phones out.</span>
            </h2>
            <p className="text-xl sm:text-2xl text-background/80 font-bold mb-12 max-w-2xl mx-auto uppercase tracking-wide">
              Join thousands of professionals changing how the UK builds. Stop calling agencies. Start matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#" className="hover:opacity-80 transition-opacity" style={{ display: 'flex', alignItems: 'center', height: 48, overflow: 'hidden' }}>
                <img src={`${import.meta.env.BASE_URL}images/badge-app-store.svg`} alt="Download on the App Store" style={{ height: 48, width: 'auto' }} />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.gordonwilson.buildmatch" className="hover:opacity-80 transition-opacity" style={{ display: 'flex', alignItems: 'center', height: 48, overflow: 'hidden' }}>
                <img src={`${import.meta.env.BASE_URL}images/badge-google-play.png`} alt="Get it on Google Play" style={{ height: 71, width: 'auto' }} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-black text-xl tracking-tighter uppercase">BUILDMATCH</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-6">The swipe-to-hire network for the UK construction industry. Built by trades, for trades.</p>
          </div>
          
          <div>
            <h4 className="font-black text-foreground uppercase tracking-wider mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><a href="#trades" className="hover:text-primary transition-colors">For Workers</a></li>
              <li><a href="#builders" className="hover:text-primary transition-colors">For Hirers</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Safety &amp; Verification</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-foreground uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-foreground uppercase tracking-wider mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-border text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">© {new Date().getFullYear()} BuildMatch Limited. Registered in England &amp; Wales · Company No. 17191553</p>
          <div className="flex gap-3 items-center">
            <a href="#" className="hover:opacity-80 transition-opacity" style={{ display: 'flex', alignItems: 'center', height: 40, overflow: 'hidden' }}>
              <img src={`${import.meta.env.BASE_URL}images/badge-app-store.svg`} alt="Download on the App Store" style={{ height: 40, width: 'auto' }} />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.gordonwilson.buildmatch" className="hover:opacity-80 transition-opacity" style={{ display: 'flex', alignItems: 'center', height: 40, overflow: 'hidden' }}>
              <img src={`${import.meta.env.BASE_URL}images/badge-google-play.png`} alt="Get it on Google Play" style={{ height: 59, width: 'auto' }} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
