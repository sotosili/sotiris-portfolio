import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Search, Zap, ShieldCheck, Hammer } from "lucide-react";
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

export default function CaseStudyVelocity() {
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
                  VELO<span className="text-primary italic font-light lowercase">CITY</span>
                </h1>
                <p className="text-lg md:text-2xl text-[#333e4d] font-serif italic max-w-2xl text-balance">
                  "A calm, trustworthy financial experience built on transparency, clarity, and intentional white space. Designed for humans, not just the experts."
                </p>
              </div>
              <div className="lg:col-span-4 grid grid-cols-2 gap-8 border-l border-accent/20 pl-8 py-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">Role</span>
                  <p className="text-sm font-bold uppercase tracking-widest">UX & Ethics</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">Context</span>
                  <p className="text-sm font-bold uppercase tracking-widest">Fintech Logic</p>
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
                src="/images/velocity-mockup.png" 
                alt="Velocity Preview" 
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
              <div className="lg:col-span-8 space-y-8">
                <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed text-balance stagger-item">
                  The European cross-border payment market is projected to reach €587.95 billion by 2031. Velocity leverages SEPA Instant and the Digital Markets Act to create an ethics-first entrant.
                </p>
                <div className="p-8 md:p-10 bg-primary/[0.03] border-l border-primary/20 mt-4 stagger-item hover:bg-primary/[0.05] transition-colors duration-500 cursor-default">
                  <p className="italic font-serif text-xl md:text-3xl text-primary/80 leading-relaxed">
                    "Banking shouldn't feel like punishment. Financial apps should be designed for humans, not the 1% who already get it."
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
              <div className="lg:col-span-8 space-y-10">
                <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl stagger-item">
                  Traditional banks hide fees, take days to transfer, and treat users like suspects. Neither serves the 95% of people who just want to send money without confusion or exploitation.
                </p>
                <div className="overflow-x-auto border border-border/20 bg-background/20 backdrop-blur-sm mt-4 stagger-item hover:border-primary/30 transition-all duration-500">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border/20">
                        <th className="p-6 font-bold uppercase tracking-widest text-[10px] text-accent">Dimension</th>
                        <th className="p-6 font-bold uppercase tracking-widest text-[10px]">Competitors</th>
                        <th className="p-6 font-bold uppercase tracking-widest text-[10px] text-primary">Velocity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/10 group/row hover:bg-primary/[0.02] transition-colors">
                        <td className="p-6 font-serif italic text-lg">Speed</td>
                        <td className="p-6 text-muted-foreground">1–3 days</td>
                        <td className="p-6 text-primary font-bold">&lt;10 seconds</td>
                      </tr>
                      <tr className="group/row hover:bg-primary/[0.02] transition-colors">
                        <td className="p-6 font-serif italic text-lg">Cost</td>
                        <td className="p-6 text-muted-foreground">1–3% fees</td>
                        <td className="p-6 text-primary font-bold">0.18–0.25%</td>
                      </tr>
                    </tbody>
                  </table>
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
              <div className="lg:col-span-5 space-y-12 stagger-item">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Design System</h3>
                    <div className="h-px w-full bg-border/40" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group p-6 border border-border/40 bg-background/20 hover:bg-background/40 transition-colors">
                        <div className="w-full h-12 bg-[#208c8d] mb-4 shadow-inner" />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Teal</p>
                        <p className="text-xs text-muted-foreground mt-1">#208C8D</p>
                      </div>
                      <div className="group p-6 border border-border/40 bg-background/20 hover:bg-background/40 transition-colors">
                        <div className="w-full h-12 bg-[#e0f2f1] mb-4 shadow-inner" />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Surface</p>
                        <p className="text-xs text-muted-foreground mt-1">#E0F2F1</p>
                      </div>
                    </div>
                    <div className="p-10 border border-border/40 bg-background/10 space-y-8 hover:bg-background/20 transition-colors duration-500 group/typo">
                      <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-primary group-hover/typo:tracking-[0.3em] transition-all duration-500">Typography</p>
                        <p className="text-4xl font-bold leading-none text-foreground tracking-tight">DM Sans</p>
                        <p className="text-sm font-light text-muted-foreground tracking-[0.2em] uppercase italic">Precision Banking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 stagger-container">
                  {[
                    { title: "Research", icon: <Search className="w-5 h-5" />, desc: "George (52) & Alex (29) tested the flow. Validated FX transparency and SEPA speed as the core trust drivers." },
                    { title: "Ethics System", icon: <ShieldCheck className="w-5 h-5" />, desc: "WCAG AAA compliance by default. Plain language explainers for all banking terminology and fees." },
                    { title: "Fast Prototyping", icon: <Zap className="w-5 h-5" />, desc: "Built in 48h using Replit Design Mode to test the SEPA instant transfer mental model." },
                    { title: "Accessibility", icon: <Hammer className="w-5 h-5" />, desc: "Designing for cognitive load and vision impairment. High-contrast indicators for all transaction states." }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-6 group p-8 border border-transparent hover:border-border/40 hover:bg-background/5 transition-all duration-500 stagger-item">
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
                    title: "Research & Trust", 
                    desc: "Testing FX transparency. Identified that cross-border users prioritize fee clarity above all else.",
                    side: "left"
                  },
                  { 
                    step: "02", 
                    title: "Ethical IA", 
                    desc: "Mapping the 'Suspect to User' transition. Reframing compliance checks as security features.",
                    side: "right"
                  },
                  { 
                    step: "03", 
                    title: "Precision Design", 
                    desc: "Crafting the high-trust interface. Using intentional white space to reduce financial cognitive load.",
                    side: "left"
                  },
                  { 
                    step: "04", 
                    title: "Rapid Validation", 
                    desc: "Iterating on the SEPA mental model. Confirmed that 10-second transfers fundamentally change user behavior.",
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
                <li>Financial transparency — all fees and rates disclosed upfront</li>
                <li>No false urgency or pressure tactics in transaction flows</li>
                <li>Clear CTAs that always communicate the action and its consequences</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40 overflow-hidden stagger-container">
                {[
                  { title: "AAA Compliance", desc: "WCAG AAA compliance target on all screens for maximum inclusion." },
                  { title: "No Dark Patterns", desc: "Users always in control, easy cancellation, no urgency tactics." },
                  { title: "Plain Language", desc: "All fees explained in simple, transparent terms without jargon." },
                  { title: "Explainable AI", desc: "All financial recommendations include clear 'why?' context links." }
                ].map((item, i) => (
                  <div key={i} className="p-10 bg-background/80 hover:bg-primary/[0.04] transition-all duration-700 stagger-item border-b border-r border-border/10 last:border-0 group/principle">
                    <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-accent mb-6 group-hover/principle:text-primary transition-colors">Principle 0{i+1}</h4>
                    <h5 className="font-serif text-xl text-foreground mb-4">{item.title}</h5>
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
                  <div className="grid grid-cols-2 gap-3" data-testid="metrics-grid-velocity">
                    {[
                      { val: "96/100", label: "Lighthouse Score" },
                      { val: "AA", label: "WCAG Accessibility" },
                      { val: "<1s", label: "Page Load Time" },
                      { val: "0", label: "Dark Patterns Used" }
                    ].map((stat, i) => (
                      <div key={i} className="group/stat p-5 bg-white border-2 border-border/60 hover:border-[#208c8d]/40 transition-colors duration-500">
                        <p className="text-3xl md:text-4xl font-bold text-[#F26C0D] leading-none">{stat.val}</p>
                        <div className="h-px w-full bg-border/40 my-3" />
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
                          src="/images/velocity-testing.png" 
                          alt="User testing session" 
                          className="w-full h-full object-cover grayscale group-hover/observation:grayscale-0 transition-all duration-1000 scale-105 group-hover/observation:scale-100 blur-[0.4px] brightness-[1.05] contrast-[1.05] saturate-[0.8] opacity-90"
                        />
                        <div className="absolute inset-0 bg-primary/10 group-hover/observation:opacity-0 transition-opacity duration-700" />
                      </div>
                      {/* Caption as an "Artifact Tag" */}
                      <div className="absolute -bottom-6 -left-6 bg-background border border-border/60 p-4 md:p-6 z-20 max-w-[200px] -rotate-2 group-hover/observation:rotate-0 transition-transform duration-500">
                        <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-accent block mb-2">Field Observation</span>
                        <p className="text-[10px] leading-relaxed font-bold text-muted-foreground uppercase tracking-widest">User testing session, October 2025</p>
                      </div>
                    </div>

                    {/* The Insight - Overlapping Content */}
                    <div className="md:col-span-5 md:-ml-24 relative z-20 space-y-8 bg-white p-8 md:p-12 border border-border/40">
                      <div className="w-12 h-1 bg-primary mb-8" />
                      <h3 className="text-xs font-bold tracking-[0.4em] text-accent uppercase">User Insight</h3>
                      <p className="text-3xl md:text-4xl font-serif italic text-foreground leading-tight text-balance">
                        "Transparency is not a hurdle; it is a <span className="text-primary">feature</span>."
                      </p>
                      <div className="h-px w-12 bg-border/60" />
                      <p className="text-muted-foreground font-light text-base leading-relaxed">
                        When both test participants independently called the app 'more ethical' than existing alternatives, it confirmed transparency is a core trust driver.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Conclusion */}
                <div className="p-12 md:p-20 border border-border/40 bg-primary/[0.02] relative overflow-hidden reveal-section group/closing">
                  {/* Decorative background mark */}
                  <div className="absolute -top-24 -right-24 text-[200px] font-serif italic text-primary/5 select-none pointer-events-none group-hover/closing:text-primary/10 transition-colors duration-700">
                    V
                  </div>
                  
                  <div className="relative z-10 max-w-2xl space-y-8">
                    <h4 className="text-2xl md:text-4xl font-serif font-light text-foreground">The Lesson</h4>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                      Financial products often hide behind complexity. Velocity proves that clarity and intentional white space can transform a transactional tool into a trustworthy companion.
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
                <a href="/work/gmap" className="group flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Previous</span>
                  <span className="text-4xl md:text-5xl font-serif italic text-foreground group-hover:text-primary transition-colors">G-MAP</span>
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                </a>

                <a href="/work/coffee-world" className="group flex flex-col items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">Next</span>
                  <span className="text-6xl md:text-8xl font-serif italic text-primary group-hover:text-accent transition-all duration-700 leading-none">Coffee World</span>
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
