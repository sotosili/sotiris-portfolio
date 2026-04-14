/**
 * CaseStudyVelocity.tsx
 * Design: Adrián Somoza (bold hierarchy, colonize canvas) +
 *         Tristan Harris (purposeful animation, no dark patterns)
 * WCAG 2.1 AA — non-negotiable
 */

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { setupScrollAnimations, setupHeroCounters } from "../utils/animations";

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

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

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
    <div className="bg-[#0A0A0A] text-white min-h-screen overflow-x-hidden selection:bg-[#F26C0D]/20">
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
          className="font-serif text-2xl font-bold tracking-tighter text-white hover:text-[#F26C0D] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26C0D]"
          aria-label="Sotiris Iliadis — home"
        >
          IS.
        </a>
        <a
          href="/#work"
          className="group flex items-center gap-2.5 text-[10px] tracking-[0.35em] uppercase font-bold text-white/40 hover:text-white transition-colors duration-300 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/50 to-transparent" />
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full"
        >
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
                      className="text-[#888888] font-normal"
                      style={{ fontSize: "0.42em" }}
                    >
                      {m.sup}
                    </span>
                  )}
                </p>
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-[#888888] mt-3">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </header>

      <main id="main">

        {/* ══════════════════════════════════════════════════
            01 — PROBLEM
        ══════════════════════════════════════════════════ */}
        <section
          className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto"
          aria-labelledby="problem-heading"
        >
          <div className="bg-[#111111] border border-[#1E1E1E] p-10 md:p-16 anim-fade-up">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#F26C0D] mb-8">
              01 — The Problem
            </p>
            <h2
              id="problem-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-white"
              style={{ fontSize: "clamp(28px, 4.5vw, 60px)" }}
            >
              Cross-border banking treats users
              <br />
              like suspects. Fees hidden. Speed criminal.
            </h2>

            <blockquote className="border-l-2 border-[#0D5EAF] pl-8 mt-12">
              <p className="font-serif text-xl md:text-2xl italic text-white/70 leading-relaxed">
                "I never know what I'll actually be charged until after the transfer. It feels like a trap."
              </p>
              <cite className="block mt-5 text-[10px] uppercase tracking-[0.35em] text-[#888888] not-italic">
                — George, 52, user research participant
              </cite>
            </blockquote>

            {/* Competitor comparison */}
            <div className="mt-12 border border-[#1E1E1E] overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#1E1E1E]">
                    <th className="p-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#0D5EAF]">
                      Dimension
                    </th>
                    <th className="p-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#888888]">
                      Incumbents
                    </th>
                    <th className="p-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#F26C0D]">
                      Velocity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#1E1E1E]">
                    <td className="p-5 font-serif italic text-white">Speed</td>
                    <td className="p-5 text-[#888888]">1–3 business days</td>
                    <td className="p-5 text-[#F26C0D] font-bold">&lt;10 seconds</td>
                  </tr>
                  <tr>
                    <td className="p-5 font-serif italic text-white">Cost</td>
                    <td className="p-5 text-[#888888]">1–3% hidden fees</td>
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
          className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.06]"
          aria-labelledby="solution-heading"
        >
          <div className="mb-16 md:mb-20">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#F26C0D] mb-6 anim-fade-up">
              02 — The Solution
            </p>
            <h2
              id="solution-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-white anim-fade-up"
              style={{ fontSize: "clamp(36px, 6vw, 88px)" }}
            >
              Banking rebuilt
              <br />
              <span className="italic text-white/30">around the human.</span>
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
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">{p.title}</h3>
                <p className="text-sm text-[#888888] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            03 — PROCESS (GSAP scroll activation)
        ══════════════════════════════════════════════════ */}
        <section
          className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.06]"
          aria-labelledby="process-heading"
        >
          <div className="mb-16 md:mb-20">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#F26C0D] mb-6 anim-fade-up">
              03 — The Process
            </p>
            <h2
              id="process-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-white anim-fade-up"
              style={{ fontSize: "clamp(36px, 6vw, 88px)" }}
            >
              Trust earned
              <br />
              <span className="italic text-white/30">through radical honesty.</span>
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
                  className="anim-step-num font-serif font-black text-white/[0.06] leading-none select-none mb-8 transition-colors duration-700"
                  style={{ fontSize: "clamp(64px, 8vw, 104px)" }}
                  aria-hidden="true"
                >
                  {step.num}
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-white mb-4">{step.title}</h3>
                <p className="text-sm text-[#888888] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Field evidence */}
          <figure className="mt-16 md:mt-20 anim-fade-up">
            <div className="relative overflow-hidden">
              <img
                src="/images/velocity-testing.png"
                alt="Velocity usability testing — participants George and Alex reviewing the transfer flow"
                className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                style={{ maxHeight: "420px", objectPosition: "center" }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent pointer-events-none" />
            </div>
            <figcaption className="mt-4 text-[10px] uppercase tracking-[0.35em] font-bold text-[#888888]">
              Validation testing — participants George &amp; Alex · 2026
            </figcaption>
          </figure>
        </section>

        {/* ══════════════════════════════════════════════════
            04 — ETHICAL PRINCIPLES
        ══════════════════════════════════════════════════ */}
        <section
          className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.06]"
          aria-labelledby="ethics-heading"
        >
          <div className="mb-16 md:mb-20">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#0D5EAF] mb-6 anim-fade-up">
              04 — Ethical Framework
            </p>
            <h2
              id="ethics-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-white anim-fade-up"
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
                className="bg-[#111111] border border-[#1E1E1E] p-8 md:p-10 flex gap-6 group hover:bg-[#141414] transition-colors duration-300"
                style={{ borderLeft: "4px solid #0D5EAF" }}
              >
                <ShieldCheck
                  className="w-5 h-5 text-[#0D5EAF] flex-shrink-0 mt-1"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-serif text-xl text-white mb-3 group-hover:text-[#F26C0D] transition-colors duration-300">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[#888888] leading-relaxed">{p.desc}</p>
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
              className="font-serif font-bold leading-[0.88] tracking-tighter text-white anim-fade-up"
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
                  className="font-bold text-white leading-none tabular-nums"
                  style={{ fontSize: "clamp(56px, 9vw, 120px)" }}
                >
                  {r.countable ? (
                    <span className="anim-count" data-target={r.val}>{r.val}</span>
                  ) : (
                    r.val
                  )}
                  {r.sup && (
                    <span
                      className="text-[#888888] font-normal"
                      style={{ fontSize: "0.42em" }}
                    >
                      {r.sup}
                    </span>
                  )}
                </p>
                <div className="h-px w-full bg-[#F26C0D]/40 my-4" aria-hidden="true" />
                <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-[#888888]">
                  {r.label}
                </p>
              </div>
            ))}
          </div>

          {/* The Lesson */}
          <div className="mt-20 p-10 md:p-16 bg-[#111111] border border-[#1E1E1E] relative overflow-hidden anim-fade-up">
            <div
              className="absolute -top-12 -right-12 font-serif italic text-[#F26C0D]/[0.04] select-none leading-none pointer-events-none"
              style={{ fontSize: "clamp(160px, 22vw, 320px)" }}
              aria-hidden="true"
            >
              V
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="font-serif text-2xl md:text-4xl text-white mb-6">The Lesson</h3>
              <p className="text-lg text-[#888888] leading-relaxed">
                Financial products often hide behind complexity.{" "}
                <span className="text-white italic">
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
      <footer className="py-16 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <a
            href="/work/gmap"
            className="group flex items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F26C0D]"
            aria-label="Previous case study: G-MAP"
          >
            <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center group-hover:border-[#F26C0D] group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </div>
            <span
              className="font-serif font-light text-white/25 group-hover:text-[#F26C0D] transition-colors duration-500 leading-none"
              style={{ fontSize: "clamp(24px, 4vw, 56px)" }}
            >
              G-MAP
            </span>
          </a>
          <a
            href="/work/coffee-world"
            className="group flex items-center gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F26C0D]"
            aria-label="Next case study: Coffee World"
          >
            <span
              className="font-serif font-light text-white/25 group-hover:text-[#F26C0D] transition-colors duration-500 leading-none"
              style={{ fontSize: "clamp(32px, 6vw, 72px)" }}
            >
              Coffee World
            </span>
            <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center group-hover:border-[#F26C0D] group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </div>
          </a>
        </div>
      </footer>
    </div>
  );
}
