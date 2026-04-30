import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardHat, Smartphone, Zap, MapPin, CheckCircle, ShieldCheck, ArrowRight, Star, Clock, Hammer, Building2, Apple, Play, ChevronRight, ChevronLeft, Menu, X, Users, ThumbsUp } from "lucide-react";

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
            <div className="w-10 h-10 bg-primary flex items-center justify-center transform -skew-x-12 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Hammer className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase">BUILDMATCH</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide uppercase text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#trades" className="hover:text-foreground transition-colors">For Trades</a>
            <a href="#builders" className="hover:text-foreground transition-colors">For Builders</a>
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
              <a href="#trades" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-border pb-4">For Trades</a>
              <a href="#builders" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-border pb-4">For Builders</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-border pb-4">Pricing</a>
              <Button className="bg-accent text-white rounded-none h-14 mt-4 text-lg font-black uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)]">Get the App</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-bg.png" alt="Construction worker" className="w-full h-full object-cover opacity-15 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          {/* Blueprint grid overlay */}
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(to right, #2563EB 1px, transparent 1px), linear-gradient(to bottom, #2563EB 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 border border-accent/30 bg-accent/10 px-4 py-2 mb-8 transform -skew-x-6">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span className="text-accent text-sm font-bold uppercase tracking-widest">Live: 482 Sites Hiring Today</span>
              </div>
            </FadeIn>
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
            <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none h-16 px-8 text-lg font-black uppercase tracking-wider w-full sm:w-auto shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">
                <Apple className="w-6 h-6 mr-3 mb-1" />
                iOS App
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 hover:border-white/40 text-white rounded-none h-16 px-8 text-lg font-black uppercase tracking-wider w-full sm:w-auto transition-all">
                <Play className="w-6 h-6 mr-3 mb-1" />
                Android
              </Button>
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

          <div className="relative h-[600px] hidden lg:flex items-center justify-center">
            <FadeIn delay={0.4} direction="left" className="relative w-full max-w-[340px] aspect-[9/19] bg-[#060D1F] rounded-[3rem] border-[12px] border-[#1E293B] shadow-2xl overflow-hidden ring-1 ring-black/10">
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-[#1E293B] rounded-b-3xl mx-auto w-1/3 z-20"></div>
              
              {/* App UI */}
              <div className="absolute inset-0 flex flex-col p-4 pt-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-black tracking-tighter text-white">BM.</div>
                  <Badge variant="outline" className="border-accent text-accent bg-accent/10 px-2 py-0.5 rounded-sm uppercase text-[10px] tracking-widest font-bold">Matching</Badge>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden flex-1 bg-[#1E293B] shadow-lg border border-white/10">
                  <img src="/images/worker-1.png" alt="Worker profile" className="w-full h-full object-cover" />
                  
                  <div className="absolute top-4 right-4 bg-[#060D1F]/80 backdrop-blur border border-white/10 rounded px-2 py-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-accent" />
                    <span className="text-xs font-bold text-white">2.4m</span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#060D1F] via-[#060D1F]/80 to-transparent p-5 pt-20">
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
                          Liam M. <ShieldCheck className="w-5 h-5 text-accent" />
                        </h3>
                        <p className="text-primary font-bold">Level 3 Electrician</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-accent">£220<span className="text-xs text-white/60 font-normal">/day</span></p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-white/10 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm border border-white/10">JIB Gold Card</span>
                      <span className="bg-white/10 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm border border-white/10">IPAF</span>
                      <span className="bg-white/10 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm border border-white/10">Own Tools</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center mt-6 mb-4">
                  <button className="w-16 h-16 rounded-full bg-[#1E293B] border border-white/10 text-white/50 flex items-center justify-center shadow-lg hover:bg-destructive hover:text-white transition-all transform hover:scale-105">
                    <X className="w-8 h-8" />
                  </button>
                  <button className="w-16 h-16 rounded-full bg-primary border-none text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-primary/90 transition-all transform hover:scale-105">
                    <Zap className="w-8 h-8 fill-current" />
                  </button>
                </div>
              </div>
            </FadeIn>
            
            {/* Floating Elements */}
            <FadeIn delay={0.6} direction="right" className="absolute top-1/4 -right-12 bg-card p-4 border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[220px] transform rotate-3">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/20 flex items-center justify-center text-primary flex-shrink-0"><Building2 className="w-5 h-5" /></div>
                <div>
                  <div className="text-sm font-black uppercase tracking-tight leading-none mb-1">Canary Wharf Tower</div>
                  <p className="text-xs text-muted-foreground font-medium">Needs 2 Dryliners. Starts Monday.</p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.7} direction="left" className="absolute bottom-1/3 -left-16 bg-card p-4 border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] transform -rotate-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black uppercase">CSCS Verified</div>
                  <div className="text-xs text-muted-foreground font-medium">Auto-checked against CITB</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats ticker marquee */}
      <div className="border-y border-border bg-secondary/50 py-4 flex overflow-hidden whitespace-nowrap">
        <div className="animate-[marquee_20s_linear_infinite] flex items-center gap-12 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Islington: 42 Jobs Posted</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Camden: Electricians needed</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Kensington: High-end refurb</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Canary Wharf: Commercial fit out</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Stratford: 5 Groundworkers matched</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Croydon: 3 Carpenters needed</span>
        </div>
      </div>

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
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-24 left-[10%] right-[10%] h-px bg-border -z-10"></div>
            
            <FadeIn delay={0.1}>
              <div className="bg-card border border-border p-8 text-center h-full hover:bg-secondary/50 transition-colors group">
                <div className="w-20 h-20 mx-auto bg-background border border-border flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <span className="text-4xl font-black text-foreground/15">01</span>
                  <Smartphone className="w-8 h-8 text-primary absolute" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Set Your Terms</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Trades set their day rate, skills, and travel radius. Builders post site needs, duration, and budget. The algorithm filters the noise.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-card border border-border p-8 text-center h-full hover:bg-secondary/50 transition-colors group relative">
                <div className="w-20 h-20 mx-auto bg-background border border-border flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <span className="text-4xl font-black text-foreground/15">02</span>
                  <Zap className="w-8 h-8 text-accent absolute" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Swipe to Match</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Review anonymous profiles highlighting only what matters: tickets, distance, rate, and past ratings. Right swipe if they fit.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-card border border-border p-8 text-center h-full hover:bg-secondary/50 transition-colors group">
                <div className="w-20 h-20 mx-auto bg-background border border-border flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <span className="text-4xl font-black text-foreground/15">03</span>
                  <Hammer className="w-8 h-8 text-foreground absolute" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Chat & Hire</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">When both sides swipe right, it's a match. Instant messaging opens up. Agree on start times, share site inductions, get to work.</p>
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
                      <ShieldCheck className="w-6 h-6 text-foreground" />
                    </div>
                    <h3 className="font-black text-xl mb-2 uppercase tracking-tight">Digital Tickets</h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed">Upload your CSCS, SMSTS, and IPAF once. We verify them automatically so you never have to email photos of them again.</p>
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
                <div className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6">For The Workers</div>
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
                      <Star className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-black uppercase tracking-tight">Build your reputation</div>
                      <div className="text-sm text-muted-foreground">Get rated after every job. High ratings = higher rates.</div>
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
              <div className="inline-block bg-accent text-background text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6">For Contractors</div>
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
                    <p className="text-muted-foreground font-medium bg-secondary border border-border p-4 font-mono text-sm">
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
                    <h4 className="font-black text-xl uppercase tracking-tight mb-2">Swipe Available Local Labor</h4>
                    <p className="text-muted-foreground font-medium">The algorithm instantly shows you profiles of verified tradesmen who match your criteria, are available now, and within range.</p>
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
                <img src="/images/manager-1.png" alt="Site Manager" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="self-end bg-white/90 backdrop-blur-md border border-border px-4 py-2 flex items-center gap-3 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-xs uppercase tracking-widest text-foreground">Project: Elephant & Castle</span>
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
                          <div className="w-8 h-8 bg-accent/20 flex items-center justify-center"><Hammer className="w-4 h-4 text-accent" /></div>
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
            
            {/* Stat overlay */}
            <FadeIn delay={0.4} direction="up" className="absolute -bottom-8 -right-8 bg-primary p-6 border-4 border-background shadow-2xl z-20 max-w-[200px]">
              <div className="text-5xl font-black text-white mb-2">8hr</div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80 leading-tight">Average time to fill an urgent site vacancy.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-y border-border bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <FadeIn>
              <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Word on the <span className="text-foreground">Site.</span></h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="flex gap-2">
                <div className="w-12 h-12 border border-border flex items-center justify-center hover:bg-foreground/5 cursor-pointer transition-colors"><ChevronLeft className="w-6 h-6 text-foreground" /></div>
                <div className="w-12 h-12 bg-primary flex items-center justify-center hover:bg-primary/90 cursor-pointer transition-colors"><ChevronRight className="w-6 h-6 text-white" /></div>
              </div>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={0.2}>
              <Card className="bg-card border-border rounded-none p-8 hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
                </div>
                <p className="text-xl font-medium text-foreground/90 mb-8 leading-relaxed">
                  "Agencies used to take £50 off my daily rate. With BuildMatch I set £250/day and that's exactly what lands in my account on Friday. Haven't made a cold call in 6 months."
                </p>
                <div className="flex items-center gap-4 border-t border-border pt-6">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center text-lg font-black uppercase border border-border">MB</div>
                  <div>
                    <div className="font-bold text-foreground uppercase tracking-wider">Mark B.</div>
                    <div className="text-sm text-primary font-medium">Level 3 Carpenter, Croydon</div>
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card className="bg-card border-border rounded-none p-8 hover:border-accent/50 transition-colors shadow-sm">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
                </div>
                <p className="text-xl font-medium text-foreground/90 mb-8 leading-relaxed">
                  "Had two plasterers no-show on a Tuesday. Put it on the app at 8am, matched with two verified guys locally by 9am, they were on site for 11. Saved the entire week's schedule."
                </p>
                <div className="flex items-center gap-4 border-t border-border pt-6">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center text-lg font-black uppercase text-white">TD</div>
                  <div>
                    <div className="font-bold text-foreground uppercase tracking-wider">Tom D.</div>
                    <div className="text-sm text-accent font-medium">Site Manager, MainContractor Ltd</div>
                  </div>
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 px-6 bg-background relative overflow-hidden">
        {/* Background graphic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
          <FadeIn>
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-6">Straight Up <span className="text-primary">Pricing.</span></h2>
            <p className="text-xl text-muted-foreground font-medium">No hidden agency fees. No percentages taken from day rates. Ever.</p>
          </FadeIn>
        </div>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-0 relative z-10">
          <FadeIn direction="right" delay={0.1}>
            <div className="bg-card border border-border p-10 h-full flex flex-col relative z-0 md:pr-16 shadow-sm">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2">For Trades</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-6xl font-black text-foreground">Free</span>
                <span className="text-muted-foreground uppercase tracking-widest text-sm font-bold">forever</span>
              </div>
              <p className="text-muted-foreground font-medium mb-10 text-lg">You do the hard work. We don't take a cut.</p>
              
              <ul className="space-y-5 mb-10 flex-1 text-foreground/80 font-medium">
                <li className="flex items-center gap-4"><CheckCircle className="w-6 h-6 text-primary flex-shrink-0" /> <span>Unlimited job matching</span></li>
                <li className="flex items-center gap-4"><CheckCircle className="w-6 h-6 text-primary flex-shrink-0" /> <span>Digital ticket storage (CSCS, etc)</span></li>
                <li className="flex items-center gap-4"><CheckCircle className="w-6 h-6 text-primary flex-shrink-0" /> <span>Direct messaging with builders</span></li>
                <li className="flex items-center gap-4"><CheckCircle className="w-6 h-6 text-primary flex-shrink-0" /> <span>Keep 100% of your agreed rate</span></li>
              </ul>
              
              <Button variant="outline" className="w-full bg-transparent hover:bg-foreground/5 text-foreground rounded-none border border-border h-14 font-black uppercase tracking-wider text-lg">Create Profile</Button>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <div className="bg-primary p-10 h-full flex flex-col relative z-10 shadow-[0_0_50px_rgba(59,130,246,0.3)] md:-ml-8 md:my-[-20px]">
              <div className="absolute top-0 right-0 bg-foreground text-background text-xs font-black uppercase tracking-widest px-4 py-2 border-b border-l border-white/10">Industry Standard</div>
              
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white mt-4">For Builders</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-6xl font-black text-white">£49</span>
                <span className="text-white/70 uppercase tracking-widest text-sm font-bold">/month</span>
              </div>
              <p className="text-white/90 font-medium mb-10 text-lg leading-snug">Cheaper than an agency's margin on a single worker for half a day.</p>
              
              <ul className="space-y-5 mb-10 flex-1 text-white font-medium">
                <li className="flex items-center gap-4"><CheckCircle className="w-6 h-6 text-accent flex-shrink-0" /> <span>Post unlimited job requirements</span></li>
                <li className="flex items-center gap-4 bg-white/10 p-2 -mx-2"><CheckCircle className="w-6 h-6 text-accent flex-shrink-0" /> <span className="font-bold">5 Free Matches to start</span></li>
                <li className="flex items-center gap-4"><CheckCircle className="w-6 h-6 text-accent flex-shrink-0" /> <span>Access to verified CSCS database</span></li>
                <li className="flex items-center gap-4"><CheckCircle className="w-6 h-6 text-accent flex-shrink-0" /> <span>Instant chat & hiring tools</span></li>
              </ul>
              
              <Button className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-none h-14 font-black uppercase tracking-wider text-lg shadow-xl">Start Free Trial</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden bg-accent border-y border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 2px, transparent 2px)', backgroundSize: '60px 60px' }}></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-8 text-background drop-shadow-sm">
              Tools down. <br />
              <span className="text-white">Phones out.</span>
            </h2>
            <p className="text-xl sm:text-2xl text-background/80 font-bold mb-12 max-w-2xl mx-auto uppercase tracking-wide">
              Join thousands of professionals changing how the UK builds. Stop calling agencies. Start matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-none h-16 px-10 text-xl font-black uppercase tracking-wider shadow-xl transition-transform hover:scale-105">
                <Apple className="w-6 h-6 mr-3 mb-1" />
                App Store
              </Button>
              <Button size="lg" className="bg-white hover:bg-white/90 text-background rounded-none h-16 px-10 text-xl font-black uppercase tracking-wider shadow-xl transition-transform hover:scale-105">
                <Play className="w-6 h-6 mr-3 mb-1" />
                Google Play
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary flex items-center justify-center transform -skew-x-12">
                <Hammer className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">BUILDMATCH</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-6">The swipe-to-hire network for the UK construction industry. Built by trades, for trades.</p>
          </div>
          
          <div>
            <h4 className="font-black text-foreground uppercase tracking-wider mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">For Trades</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">For Builders</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Safety & Verification</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-foreground uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-foreground uppercase tracking-wider mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-border text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">© {new Date().getFullYear()} BuildMatch UK Ltd. Registered in England & Wales.</p>
          <div className="flex gap-4">
            {/* Social mock links */}
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer border border-border text-muted-foreground">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer border border-border text-muted-foreground">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer border border-border text-muted-foreground">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}