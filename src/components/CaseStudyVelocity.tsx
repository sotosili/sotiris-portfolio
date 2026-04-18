/**
 * CaseStudyVelocity.tsx
 * Design: Adrián Somoza (bold hierarchy, colonize canvas) +
 *         Tristan Harris (purposeful animation, no dark patterns)
 * WCAG 2.1 AA — non-negotiable
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { setupScrollAnimations, setupHeroCounters, setupPageEntry, navigateWithTransition } from "../utils/animations";
import Footer from "./Footer";

// ── Data ─────────────────────────────────────────────────────────

const HERO_METRICS = [
  { val: "96", sup: "/100", label: "Lighthouse Score", countable: true },
  { val: "AA", sup: "", label: "WCAG Accessibility" },
  { val: "0", sup: "", label: "Dark Patterns", countable: true },
];

const SOLUTION_PILLARS = [
  {
    num: "01",
    title: "SEPA Instant Speed",
    desc: "Cross-border transfers in under 10 seconds. Not 1–3 business days. Not pending. Gone, arrived, done.",
  },
  {
    num: "02",
    title: "Radical Transparency",
    desc: "Full fee disclosure before you confirm. The exact amount you'll pay — 0.18–0.25% — shown upfront, always.",
  },
  {
    num: "03",
    title: "Plain Language Finance",
    desc: "Every banking term explained in plain language. No jargon, no fine print surprises, no 'subject to change' opacity.",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Research & Trust",
    desc: "Tested FX transparency with George (52) and Alex (29). Confirmed: fee clarity is the primary trust driver for cross-border users.",
  },
  {
    num: "02",
    title: "Ethical IA",
    desc: "Mapped the 'suspect to user' transition. Reframed compliance checks as security features — transparency as a feature, not a burden.",
  },
  {
    num: "03",
    title: "Precision Design",
    desc: "Intentional white space to reduce financial cognitive load. Every element earns its place — nothing decorative, everything purposeful.",
  },
  {
    num: "04",
    title: "Rapid Validation",
    desc: "Built in 48 hours using Replit Design Mode. Both participants called it 'more ethical' than alternatives they use daily.",
  },
];

const ETHICAL_PRINCIPLES = [
  {
    title: "WCAG AAA Target",
    desc: "Financial apps carry high cognitive and emotional stakes. We targeted AAA compliance for maximum inclusion across all users.",
  },
  {
    title: "No Dark Patterns",
    desc: "Users always in control. Easy cancellation. No false urgency. No pre-checked boxes. No manipulative confirmation dialogs.",
  },
  {
    title: "Plain Language",
    desc: "Every fee, every rate, every term explained in simple language before commitment. Not in footnotes. Not after the fact.",
  },
  {
    title: "Explainable AI",
    desc: "All financial recommendations include a clear 'why?' context. If the algorithm decides something, you're told why.",
  },
];

const RESULTS = [
  { val: "96", sup: "/100", label: "Lighthouse Score", countable: true },
  { val: "AA", sup: "", label: "WCAG Accessibility" },
  { val: "<1s", sup: "", label: "Page Load Time" },
  { val: "0", sup: "", label: "Dark Patterns", countable: true },
];

// ── Component ─────────────────────────────────────────────────────

export default function CaseStudyVelocity() {
  const shouldReduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Hero entry — coordinates with page-entry overlay reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      setupPageEntry(rootRef.current, shouldReduceMotion ?? false);
    }, 0);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  // Unified GSAP scroll animations
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const timer = setTimeout(() => {
      cleanup = setupScrollAnimations(document.body, shouldReduceMotion ?? false);
    }, 150);
    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [shouldReduceMotion]);

  // Hero metric counters — fire after entry animation completes
  useEffect(() => {
    const cleanup = setupHeroCounters(shouldReduceMotion ?? false);
    return cleanup;
  }, [shouldReduceMotion]);

  return (
    <div ref={rootRef} className="relative z-[1] text-[#1A1410] min-h-screen overflow-x-hidden selection:bg-[#F26C0D]/20">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[#F26C0D] focus:text-white focus:text-sm focus:font-bold"
      >
        Skip to main content
      </a>

      {/* CSS noise grain */}
      <div
        className="fixed inset-0 pointer-events-none select-none"
        style={{ zIndex: 999, opacity: 0.04 }}
        aria-hidden="true"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="vel-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#vel-grain)" />
        </svg>
      </div>

      {/* ── Navigation ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center"
        aria-label="Page navigation"
      >
        <a
          href="/"
          onClick={(e) => navigateWithTransition("/", e)}
          className="font-serif text-2xl font-bold tracking-tighter text-white hover:text-[#F26C0D] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26C0D]"
          aria-label="Sotiris Iliadis — home"
        >
          IS.
        </a>
        <a
          href="/#work"
          onClick={(e) => navigateWithTransition("/#work", e)}
          className="group flex items-center gap-2.5 text-[10px] tracking-[0.35em] uppercase font-bold text-white/70 hover:text-white transition-colors duration-300 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ArrowLeft
            className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform"
            aria-hidden="true"
          />
          Back to Work
        </a>
      </nav>

      {/* ══════════════════════════════════════════════════
          HERO — Full viewport, mockup background
      ══════════════════════════════════════════════════ */}
      <header
        className="relative min-h-screen flex flex-col justify-end pb-20 md:pb-28 overflow-hidden"
        aria-label="Velocity case study overview"
      >
        {/* Background: mockup + layered gradients */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img
            src="/images/velocity-mockup.png"
            alt=""
            className="hero-bg-img w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/60 to-[#0D1117]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          {/* Eyebrow */}
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#F26C0D] mb-8">
            Case Study — 2026
          </p>

          {/* Giant title */}
          <h1
            className="font-serif font-bold leading-[0.82] tracking-tighter text-white mb-16"
            style={{ fontSize: "clamp(72px, 11vw, 176px)" }}
          >
            VELO
            <span className="italic text-[#F26C0D]">CITY</span>
          </h1>

          {/* 3 hero metrics */}
          <div
            className="grid grid-cols-3 gap-6 md:gap-12 pt-10 border-t border-white/10"
            role="list"
            aria-label="Key project metrics"
          >
            {HERO_METRICS.map((m, i) => (
              <div key={i} role="listitem">
                <p
                  className="font-bold text-white leading-none tabular-nums"
                  style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
                >
                  {m.countable ? (
                    <span className="anim-hero-count" data-target={m.val}>{m.val}</span>
                  ) : (
                    m.val
                  )}
                  {m.sup && (
                    <span
                      className="text-white/60 font-normal"
                      style={{ fontSize: "0.42em" }}
                    >
                      {m.sup}
                    </span>
                  )}
                </p>
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/60 mt-3">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main id="main">

        {/* ══════════════════════════════════════════════════
            01 — PROBLEM
        ══════════════════════════════════════════════════ */}
        <section
          className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto"
          aria-labelledby="problem-heading"
        >
          <div className="bg-[#EDE9E3] border border-[#D4CFC8] p-10 md:p-16 anim-fade-up">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#F26C0D] mb-8">
              01 — The Problem
            </p>
            <h2
              id="problem-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-[#1A1410]"
              style={{ fontSize: "clamp(28px, 4.5vw, 60px)" }}
            >
              Cross-border banking treats users
              <br />
              like suspects. Fees hidden. Speed criminal.
            </h2>

            <blockquote className="border-l-2 border-[#0D5EAF] pl-8 mt-12">
              <p className="font-serif text-xl md:text-2xl italic text-[#1A1410]/70 leading-relaxed">
                "I never know what I'll actually be charged until after the transfer. It feels like a trap."
              </p>
              <cite className="block mt-5 text-[10px] uppercase tracking-[0.35em] text-[#6B6560] not-italic">
                — George, 52, user research participant
              </cite>
            </blockquote>

            {/* Competitor comparison */}
            <div className="mt-12 border border-[#D4CFC8] overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#D4CFC8]">
                    <th className="p-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#0D5EAF]">
                      Dimension
                    </th>
                    <th className="p-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6560]">
                      Incumbents
                    </th>
                    <th className="p-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#F26C0D]">
                      Velocity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#D4CFC8]">
                    <td className="p-5 font-serif italic text-[#1A1410] font-semibold">Speed</td>
                    <td className="p-5 text-[#6B6560]">1–3 business days</td>
                    <td className="p-5 text-[#F26C0D] font-bold">&lt;10 seconds</td>
                  </tr>
                  <tr>
                    <td className="p-5 font-serif italic text-[#1A1410] font-semibold">Cost</td>
                    <td className="p-5 text-[#6B6560]">1–3% hidden fees</td>
                    <td className="p-5 text-[#F26C0D] font-bold">0.18–0.25%, upfront</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            02 — SOLUTION
        ══════════════════════════════════════════════════ */}
        <section
          className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1410]/[0.06]"
          aria-labelledby="solution-heading"
        >
          <div className="mb-16 md:mb-20">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#F26C0D] mb-6 anim-fade-up">
              02 — The Solution
            </p>
            <h2
              id="solution-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-[#1A1410] anim-fade-up"
              style={{ fontSize: "clamp(36px, 6vw, 88px)" }}
            >
              Banking rebuilt
              <br />
              <span className="italic text-[#1A1410]/30">around the human.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 anim-stagger">
            {SOLUTION_PILLARS.map((p, i) => (
              <div key={i}>
                <div
                  className="font-serif font-black text-[#F26C0D]/[0.09] leading-none select-none mb-6"
                  style={{ fontSize: "clamp(80px, 10vw, 120px)" }}
                  aria-hidden="true"
                >
                  {p.num}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#1A1410] mb-4">{p.title}</h3>
                <p className="text-sm text-[#6B6560] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            03 — PROCESS (GSAP scroll activation)
        ══════════════════════════════════════════════════ */}
        <section
          className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1410]/[0.06]"
          aria-labelledby="process-heading"
        >
          <div className="mb-16 md:mb-20">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#F26C0D] mb-6 anim-fade-up">
              03 — The Process
            </p>
            <h2
              id="process-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-[#1A1410] anim-fade-up"
              style={{ fontSize: "clamp(36px, 6vw, 88px)" }}
            >
              Trust earned
              <br />
              <span className="italic text-[#1A1410]/30">through radical honesty.</span>
            </h2>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6"
            role="list"
            aria-label="Design process phases"
          >
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={i}
                className="anim-step anim-fade-up"
                role="listitem"
              >
                <div
                  className="anim-step-num font-serif font-black text-[#1A1410]/[0.09] leading-none select-none mb-8 transition-colors duration-700"
                  style={{ fontSize: "clamp(64px, 8vw, 104px)" }}
                  aria-hidden="true"
                >
                  {step.num}
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-[#1A1410] mb-4">{step.title}</h3>
                <p className="text-sm text-[#6B6560] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Field evidence — editorial portrait layout */}
          <figure className="mt-16 md:mt-24 anim-fade-up" aria-label="Field testing evidence">
            <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] items-stretch border border-[#D4CFC8]">
              {/* Portrait photo — full device-in-hand visible */}
              <div className="relative overflow-hidden bg-[#1A1410] aspect-[3/4] md:aspect-auto">
                <img
                  src="/images/case-studies/velocity-testing.png"
                  alt="Velocity usability testing — participants George and Alex reviewing the transfer flow"
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.25] brightness-75"
                  style={{ objectPosition: "50% 65%" }}
                  loading="lazy"
                />
                {/* Film grain — makes candid photography read as intentional documentary */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    opacity: 0.08,
                    mixBlendMode: "overlay" as const,
                  }}
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 left-0 w-px h-12 bg-[#F26C0D]" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 w-12 h-px bg-[#F26C0D]" aria-hidden="true" />
              </div>

              {/* Editorial context panel */}
              <div className="bg-[#EDE9E3] p-8 md:p-12 flex flex-col justify-between gap-8">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#F26C0D] mb-8">
                    Field Evidence
                  </p>
                  <blockquote className="border-l-2 border-[#0D5EAF] pl-6">
                    <p className="font-serif text-lg md:text-xl italic text-[#1A1410]/70 leading-relaxed">
                      "Finally, a money app that doesn't make me feel stupid about my choices."
                    </p>
                    <cite className="block mt-4 text-[10px] uppercase tracking-[0.35em] text-[#6B6560] not-italic">
                      — George · Validation testing participant
                    </cite>
                  </blockquote>
                </div>
                <figcaption className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#6B6560] border-t border-[#D4CFC8] pt-6">
                  Validation testing — participants George &amp; Alex · 2026
                </figcaption>
              </div>
            </div>
          </figure>
        </section>

        {/* ══════════════════════════════════════════════════
            04 — ETHICAL PRINCIPLES
        ══════════════════════════════════════════════════ */}
        <section
          className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1410]/[0.06]"
          aria-labelledby="ethics-heading"
        >
          <div className="mb-16 md:mb-20">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#0D5EAF] mb-6 anim-fade-up">
              04 — Ethical Framework
            </p>
            <h2
              id="ethics-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-[#1A1410] anim-fade-up"
              style={{ fontSize: "clamp(36px, 6vw, 88px)" }}
            >
              Finance with
              <br />
              <span className="italic text-[#0D5EAF]">nothing to hide.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 anim-stagger">
            {ETHICAL_PRINCIPLES.map((p, i) => (
              <div
                key={i}
                className="bg-[#EDE9E3] border border-[#D4CFC8] p-8 md:p-10 flex gap-6 group hover:bg-[#E4E0DA] transition-colors duration-300"
                style={{ borderLeft: "4px solid #0D5EAF" }}
              >
                <ShieldCheck
                  className="w-5 h-5 text-[#0D5EAF] flex-shrink-0 mt-1"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-serif text-xl text-[#1A1410] mb-3 group-hover:text-[#F26C0D] transition-colors duration-300">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[#6B6560] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            05 — RESULTS
        ══════════════════════════════════════════════════ */}
        <section
          className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#F26C0D]/30"
          aria-labelledby="results-heading"
        >
          <div className="mb-16 md:mb-20">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#F26C0D] mb-6 anim-fade-up">
              05 — Results
            </p>
            <h2
              id="results-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-[#1A1410] anim-fade-up"
              style={{ fontSize: "clamp(36px, 6vw, 88px)" }}
            >
              Measured impact.
            </h2>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 anim-stagger"
            role="list"
            aria-label="Project results"
          >
            {RESULTS.map((r, i) => (
              <div key={i} role="listitem">
                <p
                  className="font-bold text-[#1A1410] leading-none tabular-nums"
                  style={{ fontSize: "clamp(56px, 9vw, 120px)" }}
                >
                  {r.countable ? (
                    <span className="anim-count" data-target={r.val}>{r.val}</span>
                  ) : (
                    r.val
                  )}
                  {r.sup && (
                    <span
                      className="text-[#6B6560] font-normal"
                      style={{ fontSize: "0.42em" }}
                    >
                      {r.sup}
                    </span>
                  )}
                </p>
                <div className="h-px w-full bg-[#F26C0D]/40 my-4" aria-hidden="true" />
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-[#6B6560]">
                  {r.label}
                </p>
              </div>
            ))}
          </div>

          {/* The Lesson */}
          <div className="mt-20 p-10 md:p-16 bg-[#EDE9E3] border border-[#D4CFC8] relative overflow-hidden anim-fade-up">
            <div
              className="absolute -top-12 -right-12 font-serif italic text-[#F26C0D]/[0.04] select-none leading-none pointer-events-none"
              style={{ fontSize: "clamp(160px, 22vw, 320px)" }}
              aria-hidden="true"
            >
              V
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="font-serif text-2xl md:text-4xl text-[#1A1410] mb-6">The Lesson</h3>
              <p className="text-lg text-[#6B6560] leading-relaxed">
                Financial products often hide behind complexity.{" "}
                <span className="text-[#1A1410] italic font-semibold">
                  Velocity proves that clarity and intentional white space can transform a transactional tool into a trustworthy companion
                </span>
                . Both test participants independently confirmed it.
              </p>
              <div className="inline-flex items-center gap-3 mt-8 text-[10px] font-bold uppercase tracking-[0.35em] text-[#F26C0D]">
                <div className="w-8 h-px bg-[#F26C0D]" aria-hidden="true" />
                Validated for Production
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer navigation ── */}
      <footer className="py-16 border-t border-[#1A1410]/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <a
            href="/work/gmap"
            onClick={(e) => navigateWithTransition("/work/gmap", e)}
            className="group flex items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F26C0D]"
            aria-label="Previous case study: G-MAP"
          >
            <div className="w-14 h-14 rounded-full border border-[#1A1410]/30 flex items-center justify-center group-hover:border-[#F26C0D] group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </div>
            <span
              className="font-serif font-light text-[#6B6560] group-hover:text-[#F26C0D] transition-colors duration-500 leading-none"
              style={{ fontSize: "clamp(24px, 4vw, 56px)" }}
            >
              G-MAP
            </span>
          </a>
          <a
            href="/work/coffee-world"
            onClick={(e) => navigateWithTransition("/work/coffee-world", e)}
            className="group flex items-center gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F26C0D]"
            aria-label="Next case study: Coffee World"
          >
            <span
              className="font-serif font-light text-[#6B6560] group-hover:text-[#F26C0D] transition-colors duration-500 leading-none"
              style={{ fontSize: "clamp(32px, 6vw, 72px)" }}
            >
              Coffee World
            </span>
            <div className="w-14 h-14 rounded-full border border-[#1A1410]/30 flex items-center justify-center group-hover:border-[#F26C0D] group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </div>
          </a>
        </div>
      </footer>
      <Footer />
    </div>
  );
}
