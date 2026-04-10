import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Search, Zap, Smartphone, ShieldCheck, Handshake } from "lucide-react";
import React from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

const SectionHeading = ({ number, title }: { number: string, title: string | React.ReactNode }) => (
  <div className="space-y-6 reveal-section">
    <div className="flex items-center gap-4">
      <span className="h-[1px] w-12 bg-primary/40 inline-block" />
      <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase">{number}</span>
    </div>
    <h2 className="text-5xl md:text-7xl font-serif font-light leading-[0.9] text-balance">
      {title}
    </h2>
  </div>
);

export default function CaseStudyCoffeeWorld() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && (anchor.origin === window.location.origin)) {
        const targetId = anchor.hash.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);

      const hide = (el: HTMLElement) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      };
      const show = (el: HTMLElement) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      };
      const getOwnItems = (container: Element) =>
        Array.from(container.querySelectorAll('.stagger-item')).filter(
          (item) => item.closest('.stagger-container') === container
        );

      document.querySelectorAll('.reveal-section').forEach((el) => hide(el as HTMLElement));
      document.querySelectorAll('.stagger-item').forEach((el) => hide(el as HTMLElement));

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;

          if (el.classList.contains('stagger-container')) {
            getOwnItems(el).forEach((item, i) => {
              setTimeout(() => show(item as HTMLElement), i * 150);
            });
          }

          if (el.classList.contains('reveal-section')) {
            show(el);
            Array.from(el.querySelectorAll('.stagger-item')).filter(
              (item) => {
                const parentContainer = item.closest('.stagger-container');
                return !parentContainer || !el.contains(parentContainer);
              }
            ).forEach((item, i) => {
              setTimeout(() => show(item as HTMLElement), i * 150);
            });
          }

          observer.unobserve(el);
        });
      }, { rootMargin: '-100px' });

      document.querySelectorAll('.reveal-section').forEach((el) => observer.observe(el));
      document.querySelectorAll('.stagger-container').forEach((el) => observer.observe(el));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="smooth-wrapper">
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background z-10" />
        <img 
          src="/images/greek-hero-bg.png" 
          alt="Marble Texture" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div id="smooth-content" className="relative z-10">
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden selection:bg-accent/20 selection:text-white">
          
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 md:px-12 flex justify-between items-center pointer-events-none">
            <a href="/" className="pointer-events-auto font-serif text-2xl font-bold tracking-tighter text-foreground hover:text-accent transition-colors">IS.</a>
            <div className="pointer-events-auto">
              <a href="/#work" className="group flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold text-foreground/60 hover:text-primary transition-colors">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Back to Work
              </a>
            </div>
          </nav>

          {/* Hero Section */}
          <header className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-border/60">
            <motion.div 
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end"
            >
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-accent text-[10px] tracking-[0.4em] uppercase font-black bg-accent/5 px-2 py-1">Case Study — 2026</span>
                </div>
                <h1 className="text-6xl md:text-[8vw] font-serif font-bold tracking-tighter uppercase leading-[0.85] text-balance">
                  Coffee <span className="text-primary italic font-light lowercase">World</span>
                </h1>
                <p className="text-lg md:text-2xl text-[#333e4d] font-serif italic max-w-2xl text-balance">
                  "A premium digital menu experience for a luxury coffee boutique in Thessaloniki, featuring a sophisticated dark aesthetic and seamless bilingual navigation."
                </p>
              </div>
              <div className="lg:col-span-4 grid grid-cols-2 gap-8 border-l border-accent/20 pl-8 py-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">Role</span>
                  <p className="text-sm font-bold uppercase tracking-widest">UX Designer</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">Context</span>
                  <p className="text-sm font-bold uppercase tracking-widest">Digital Menu</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
              className="mt-12 aspect-[21/9] bg-secondary border border-border/40 overflow-hidden relative"
            >
              <img 
                src="/images/coffee-world-mockup.png" 
                alt="Coffee World Preview" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </motion.div>
          </header>

          {/* Context Section */}
          <section className="py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto reveal-section">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 stagger-container">
              <div className="lg:col-span-4 stagger-item">
                <SectionHeading number="01" title="Context" />
              </div>
              <div className="lg:col-span-8 space-y-6">
                <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed text-balance stagger-item">
                  Real café in Ladadika, Thessaloniki — designed for QR code scanning at the table. The project focused on creating a high-end digital touchpoint that complements the physical atmosphere of a luxury boutique.
                </p>
                <div className="p-8 md:p-10 bg-primary/[0.03] border-l border-primary/20 mt-4 stagger-item hover:bg-primary/[0.05] transition-colors duration-500 cursor-default">
                  <p className="italic font-serif text-xl md:text-3xl text-primary/80 leading-relaxed">
                    "A premium, print-inspired interface that balances Swiss typographic precision with the warmth of carved wood and golden hour light."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Goals Section */}
          <section className="py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-border/40 reveal-section">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 stagger-container">
              <div className="lg:col-span-4 stagger-item">
                <SectionHeading number="02" title={<>The <span className="italic">Problem</span></>} />
              </div>
              <div className="lg:col-span-8 space-y-8">
                <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl stagger-item">
                  Café customers in Ladadika scan a QR code expecting a fast, clear menu. Instead, they get PDFs that are hard to read at night, don't switch languages, and don't show clear pricing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 stagger-container">
                  <div className="p-8 bg-background/40 backdrop-blur-sm border border-border/20 space-y-4 stagger-item hover:border-primary/30 hover:bg-background/60 transition-all duration-500 group/goal">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-[0.4em] group-hover/goal:text-primary transition-colors">Goal 01</span>
                    <h3 className="font-serif text-xl md:text-2xl leading-tight">Bilingual support (Greek/English) that doesn't break the layout.</h3>
                  </div>
                  <div className="p-8 bg-background/40 backdrop-blur-sm border border-border/20 space-y-4 stagger-item hover:border-primary/30 hover:bg-background/60 transition-all duration-500 group/goal">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-[0.4em] group-hover/goal:text-primary transition-colors">Goal 02</span>
                    <h3 className="font-serif text-xl md:text-2xl leading-tight">Dark, premium aesthetic suited for evening ambiance.</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-border/40 reveal-section">
            <div className="stagger-item">
              <SectionHeading number="03" title={<>The <span className="italic">Process</span></>} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-12 stagger-container">
              <div className="lg:col-span-5 space-y-8 stagger-item">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Design System</h3>
                    <div className="h-px w-full bg-border/40" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group p-6 border border-border/40 bg-background/20 hover:bg-background/40 transition-colors">
                        <div className="w-full h-12 bg-[#B89760] mb-4 shadow-inner" />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Gold</p>
                        <p className="text-xs text-muted-foreground mt-1">#B89760</p>
                      </div>
                      <div className="group p-6 border border-border/40 bg-background/20 hover:bg-background/40 transition-colors">
                        <div className="w-full h-12 bg-[#353F33] mb-4 shadow-inner" />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Green</p>
                        <p className="text-xs text-muted-foreground mt-1">#353F33</p>
                      </div>
                    </div>
                    <div className="p-10 border border-border/40 bg-background/10 space-y-6 hover:bg-background/20 transition-colors duration-500 group/typo">
                      <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-primary group-hover/typo:tracking-[0.3em] transition-all duration-500">Typography</p>
                        <p className="text-4xl font-serif leading-none italic text-foreground">Playfair Display</p>
                        <p className="text-sm font-light text-muted-foreground tracking-[0.2em] uppercase">GFS Neohellenic</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 stagger-container">
                  {[
                    { title: "Research", icon: <Search className="w-5 h-5" />, desc: "Focused on the Thessaloniki market, specifically Ladadika. Identified that PDF menus are the primary friction point." },
                    { title: "IA & Flows", icon: <Smartphone className="w-5 h-5" />, desc: "Clear category navigation: Coffees, Teas, Tea Odyssey. Consistent model: Name → Description → Price." },
                    { title: "UI Design", icon: <Zap className="w-5 h-5" />, desc: "Dark mode by default to suit evening ambiance. Gold accent for active elements and prices." },
                    { title: "Testing", icon: <Handshake className="w-5 h-5" />, desc: "Tested with Participant Ioanna (46). Validated readability and trust, but found horizontal scroll issues." }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-4 group p-8 border border-transparent hover:border-border/40 hover:bg-background/5 transition-all duration-500 stagger-item">
                      <div className="text-primary group-hover:scale-110 transition-transform duration-500 origin-left">
                        {item.icon}
                      </div>
                      <h4 className="font-serif text-3xl text-foreground italic">{item.title}</h4>
                      <p className="text-muted-foreground font-light leading-relaxed text-sm">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline-style Process Section */}
            <div className="relative mt-12 reveal-section">
              {/* Main Timeline Line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-primary/20 stagger-item" />
              
              <div className="space-y-12 relative stagger-container">
                {[
                  { 
                    step: "01", 
                    title: "Research & Empathy", 
                    desc: "Deep diving into the Ladadika café scene. Identified that PDF menus are the primary friction point for international tourists.",
                    side: "left"
                  },
                  { 
                    step: "02", 
                    title: "Information Architecture", 
                    desc: "Mapping the 'Discovery Flow'. Ensuring the transition from QR scan to category selection is under 2 seconds.",
                    side: "right"
                  },
                  { 
                    step: "03", 
                    title: "Visual Language", 
                    desc: "Crafting the 'Boutique Dark' aesthetic. Balancing gold accents with deep forest greens for an evening ambiance.",
                    side: "left"
                  },
                  { 
                    step: "04", 
                    title: "Prototyping & Testing", 
                    desc: "Rapid iteration in Replit Design Mode. Tested with real users to solve the horizontal category scroll affordance issue.",
                    side: "right"
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center w-full stagger-item ${item.side === "left" ? "flex-row-reverse" : ""}`}>
                    <div className="w-1/2" />
                    
                    {/* Timeline Node */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-20 group-hover:scale-150 transition-transform duration-500" />
                    
                    <div className={`w-1/2 ${item.side === "left" ? "pr-12 md:pr-24 text-right" : "pl-12 md:pl-24"}`}>
                      <div className="space-y-4 group">
                        <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase group-hover:text-primary transition-colors">Phase {item.step}</span>
                        <h3 className="text-3xl md:text-5xl font-serif italic text-foreground leading-none">{item.title}</h3>
                        <p className="text-muted-foreground font-light leading-relaxed max-w-md ml-auto mr-0 md:mr-0 group-hover:text-foreground transition-colors duration-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 md:mt-16 border-t border-border/40 pt-16 reveal-section">
              <div className="flex items-center gap-4 mb-10 stagger-item">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <h3 className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Ethical Framework</h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground font-light text-sm mb-10 stagger-item" data-testid="text-ethical-summary">
                <li>Accessibility-first design ensuring readability for all users</li>
                <li>Bilingual inclusion with equal content parity in Greek and English</li>
                <li>No dark patterns — prices always visible, no manipulative upselling</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40 overflow-hidden stagger-container">
                {[
                  { title: "No Manipulation", desc: "No manipulative upselling or forced item highlighting." },
                  { title: "Price Integrity", desc: "Prices always visible, never hidden behind interaction." },
                  { title: "Inclusive Design", desc: "Bilingual support ensures tourists are not disadvantaged." },
                  { title: "Utility First", desc: "The menu is a utility, not a sales funnel. No dark patterns." }
                ].map((item, i) => (
                  <div key={i} className="p-10 bg-background/80 hover:bg-primary/[0.04] transition-all duration-700 stagger-item border-b border-r border-border/10 last:border-0 group/principle">
                    <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-accent mb-4 group-hover/principle:text-primary transition-colors">Principle 0{i+1}</h4>
                    <h5 className="font-serif text-xl text-foreground mb-3">{item.title}</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Outcome Section */}
          <section className="py-16 md:py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-border/40 reveal-section">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Sticky Sidebar Header */}
              <div className="lg:col-span-4 lg:sticky lg:top-32 self-start stagger-item">
                <SectionHeading number="04" title="Outcome" />
                <div className="mt-12 space-y-6">
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent">Key Metrics</p>
                    <div className="h-px w-full bg-border/40" />
                  </div>
                  <div className="grid grid-cols-2 gap-3" data-testid="metrics-grid-coffeeworld">
                    {[
                      { val: "94/100", label: "Lighthouse Score" },
                      { val: "AA", label: "WCAG Accessibility" },
                      { val: "2s", label: "Menu Load Time" },
                      { val: "100%", label: "Bilingual Parity" }
                    ].map((stat, i) => (
                      <div key={i} className="group/stat p-5 bg-[#B89760]/[0.06] border border-[#B89760]/20 hover:bg-[#B89760]/[0.12] transition-colors duration-500">
                        <p className="text-3xl md:text-4xl font-bold text-[#F26C0D] leading-none">{stat.val}</p>
                        <div className="h-px w-full bg-[#B89760]/30 my-3" />
                        <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-muted-foreground/60">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Outcome Narrative */}
              <div className="lg:col-span-8 stagger-container space-y-16">
                
                {/* The "User Observation" Editorial Block */}
                <div className="relative group/observation reveal-section">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* The Image - Offset & Styled */}
                    <div className="md:col-span-7 relative z-10">
                      <div className="aspect-[4/5] overflow-hidden border border-border/40 relative">
                        <img 
                          src="/images/coffee-world-testing.jpg" 
                          alt="User testing session" 
                          className="w-full h-full object-cover grayscale group-hover/observation:grayscale-0 transition-all duration-1000 scale-105 group-hover/observation:scale-100"
                        />
                        <div className="absolute inset-0 bg-primary/10 group-hover/observation:opacity-0 transition-opacity duration-700" />
                      </div>
                      {/* Caption as an "Artifact Tag" */}
                      <div className="absolute -bottom-6 -left-6 bg-background border border-border/60 p-4 md:p-6 z-20 max-w-[200px] -rotate-2 group-hover/observation:rotate-0 transition-transform duration-500">
                        <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-accent block mb-2">Field Observation</span>
                        <p className="text-[10px] leading-relaxed font-bold text-muted-foreground uppercase tracking-widest">User testing session, Thessaloniki, Feb 2026</p>
                      </div>
                    </div>

                    {/* The Insight - Overlapping Content */}
                    <div className="md:col-span-5 md:-ml-24 relative z-20 space-y-8 bg-white p-8 md:p-12 border border-border/40">
                      <div className="w-12 h-1 bg-primary mb-8" />
                      <h3 className="text-xs font-bold tracking-[0.4em] text-accent uppercase">User Insight</h3>
                      <p className="text-3xl md:text-4xl font-serif italic text-foreground leading-tight text-balance">
                        "The biggest issue was not the visual design — it was <span className="text-primary">affordance</span>."
                      </p>
                      <div className="h-px w-12 bg-border/60" />
                      <p className="text-muted-foreground font-light text-base leading-relaxed">
                        Testing with Ioanna (46) revealed that while the premium aesthetic established immediate trust, the "invisible" horizontal categories needed clearer signifiers to be discovered.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Conclusion */}
                <div className="p-12 md:p-20 border border-border/40 bg-primary/[0.02] relative overflow-hidden reveal-section group/closing">
                  {/* Decorative background mark */}
                  <div className="absolute -top-24 -right-24 text-[200px] font-serif italic text-primary/5 select-none pointer-events-none group-hover/closing:text-primary/10 transition-colors duration-700">
                    CW
                  </div>
                  
                  <div className="relative z-10 max-w-2xl space-y-8">
                    <h4 className="text-2xl md:text-4xl font-serif font-light text-foreground">The Lesson</h4>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                      This project reinforced that for a luxury digital product, <span className="text-foreground font-normal italic">usability is the highest form of luxury</span>. A beautiful menu means nothing if it isn't intuitive enough to be ignored.
                    </p>
                    <div className="pt-8">
                      <div className="inline-flex items-center gap-4 text-xs font-bold tracking-[0.3em] text-primary uppercase">
                        <div className="w-8 h-px bg-primary" />
                        Validated for Production
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <footer className="py-16 border-t border-border/40 reveal-section">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-12">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">Explore More</span>
                <h2 className="text-5xl md:text-8xl font-serif font-light">Next Chapter</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <a href="/work/velocity" className="group flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Previous</span>
                  <span className="text-4xl md:text-5xl font-serif italic text-foreground group-hover:text-primary transition-colors">Velocity</span>
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                </a>

                <a href="/work/gmap" className="group flex flex-col items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Next</span>
                  <span className="text-6xl md:text-8xl font-serif italic text-primary group-hover:text-accent transition-all duration-700 leading-none">G-MAP</span>
                  <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:border-accent group-hover:scale-110 transition-all duration-500">
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </div>

              <div className="pt-12">
                <a href="/" className="text-[10px] uppercase tracking-[0.5em] font-bold text-muted-foreground hover:text-primary transition-colors">Back to Overview</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
