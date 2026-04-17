/**
 * CaseStudyCoffeeWorld.tsx
 * Design: Adrián Somoza (bold hierarchy, colonize canvas) +
 *         Tristan Harris (purposeful animation, no dark patterns)
 * WCAG 2.1 AA — non-negotiable
 */

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { setupScrollAnimations, setupHeroCounters } from "../utils/animations";
import Footer from "./Footer";

// ── Data ─────────────────────────────────────────────────────────

const HERO_METRICS = [
  { val: "94", sup: "/100", label: "Lighthouse Score", countable: true },
  { val: "AA", sup: "", label: "WCAG Accessibility" },
  { val: "2s", sup: "", label: "Menu Load Time" },
];

const SOLUTION_PILLARS = [
  {
    num: "01",
    title: "QR-First Access",
    desc: "Instant digital menu — no app, no friction. Scan, read, order. QR code to category selection in under 2 seconds.",
  },
  {
    num: "02",
    title: "Bilingual by Default",
    desc: "Greek and English with full content parity. Not a lesser translation — every item, every description, first-class in both languages.",
  },
  {
    num: "03",
    title: "Boutique Dark System",
    desc: "Gold accents, deep forest tones, Playfair Display headlines. Premium that matches and amplifies the physical café atmosphere.",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Field Research",
    desc: "Immersed in the Ladadika café scene. Identified PDF menus as the primary friction point for international guests scanning at night.",
  },
  {
    num: "02",
    title: "Information Architecture",
    desc: "Mapped the discovery flow: QR scan → category → item in under 2 seconds. Structure mirrors the physical menu experience.",
  },
  {
    num: "03",
    title: "Visual Language",
    desc: "Developed the Boutique Dark system: deep forest greens, gold accents, Playfair Display for headlines, GFS Neohellenic for Greek body text.",
  },
  {
    num: "04",
    title: "Testing & Refinement",
    desc: "Validated with Participant Ioanna (46). Premium aesthetic established immediate trust. Horizontal scroll affordance required a second iteration.",
  },
];

const ETHICAL_PRINCIPLES = [
  {
    title: "No Manipulation",
    desc: "No upselling, forced highlighting, or artificial scarcity. The menu is a utility, not a sales funnel.",
  },
  {
    title: "Price Integrity",
    desc: "All prices visible immediately — no interaction required, no 'price on request' patterns, no hidden costs.",
  },
  {
    title: "Inclusive by Default",
    desc: "Greek and English with full parity. Both languages are first-class citizens, not one primary and one afterthought.",
  },
  {
    title: "Utility Over Performance",
    desc: "Beautiful design is worthless if it cannot be used. Every aesthetic choice was validated against real-world usability.",
  },
];

const RESULTS = [
  { val: "94", sup: "/100", label: "Lighthouse Score", countable: true },
  { val: "AA", sup: "", label: "WCAG Accessibility" },
  { val: "2s", sup: "", label: "Menu Load Time" },
  { val: "100%", sup: "", label: "Bilingual Parity" },
];

// ── Component ─────────────────────────────────────────────────────

export default function CaseStudyCoffeeWorld() {
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
    <div className="relative z-[1] text-[#1A1410] min-h-screen overflow-x-hidden selection:bg-[#F26C0D]/20">
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
          <filter id="cw-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cw-grain)" />
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
        aria-label="Coffee World case study overview"
      >
        {/* Background: mockup + layered gradients */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img
            src="/images/coffee-world-mockup.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/60 to-[#0D1117]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1117]/50 to-transparent" />
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

          {/* Giant title — Somoza colonizes the canvas */}
          <h1
            className="font-serif font-bold leading-[0.82] tracking-tighter text-white mb-16"
            style={{ fontSize: "clamp(72px, 11vw, 176px)" }}
          >
            Coffee
            <br />
            <span className="italic text-[#F26C0D]">World</span>
          </h1>

          {/* 3 hero metrics — prominent numbers */}
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
          <div className="bg-[#EDE9E3] border border-[#D4CFC8] p-10 md:p-16 anim-fade-up">
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#F26C0D] mb-8">
              01 — The Problem
            </p>
            <h2
              id="problem-heading"
              className="font-serif font-bold leading-[0.88] tracking-tighter text-[#1A1410]"
              style={{ fontSize: "clamp(28px, 4.5vw, 60px)" }}
            >
              Café menus are PDF prisons.
              <br />
              Tourists scan QR codes and find nothing legible.
            </h2>

            <blockquote className="border-l-2 border-[#0D5EAF] pl-8 mt-12">
              <p className="font-serif text-xl md:text-2xl italic text-[#1A1410]/70 leading-relaxed">
                "I just wanted to know what the drinks were, but the PDF was too dark to read on my phone."
              </p>
              <cite className="block mt-5 text-[10px] uppercase tracking-[0.35em] text-[#6B6560] not-italic">
                — Field observation, Ladadika, Thessaloniki
              </cite>
            </blockquote>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              <div className="p-6 border border-[#D4CFC8] bg-[#EDE9E3]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#0D5EAF] font-bold mb-3">
                  Goal 01
                </p>
                <p className="font-serif text-lg text-[#1A1410] leading-snug">
                  Bilingual support (Greek/English) that never breaks the layout.
                </p>
              </div>
              <div className="p-6 border border-[#D4CFC8] bg-[#EDE9E3]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#0D5EAF] font-bold mb-3">
                  Goal 02
                </p>
                <p className="font-serif text-lg text-[#1A1410] leading-snug">
                  Dark, premium aesthetic that suits evening café ambiance.
                </p>
              </div>
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
              A mobile-first digital menu,
              <br />
              <span className="italic text-[#1A1410]/30">built for the night.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 anim-stagger">
            {SOLUTION_PILLARS.map((p, i) => (
              <div key={i}>
                {/* Somoza-style ghost number */}
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
              Four phases,
              <br />
              <span className="italic text-[#1A1410]/30">one direction.</span>
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
                {/* Number lights up orange on scroll via GSAP */}
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
              <div className="relative overflow-hidden bg-[#EDE9E3] aspect-[3/4] md:aspect-auto">
                <img
                  src="/images/case-studies/coffee-world-testing.jpg"
                  alt="Coffee World usability testing — participant reviewing the digital menu on mobile at a café table"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading="lazy"
                />
                {/* Orange bottom-left corner accent */}
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
                      "The aesthetic immediately felt premium. I trusted it before I even read anything."
                    </p>
                    <cite className="block mt-4 text-[10px] uppercase tracking-[0.35em] text-[#6B6560] not-italic">
                      — Ioanna, 46 · Field testing participant
                    </cite>
                  </blockquote>
                </div>
                <figcaption className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#6B6560] border-t border-[#D4CFC8] pt-6">
                  Field testing — Ladadika, Thessaloniki · 2026
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
              Design without
              <br />
              <span className="italic text-[#0D5EAF]">manipulation.</span>
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

          {/* Giant result numbers — Somoza scale */}
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
              style={{ fontSize: "clamp(120px, 18vw, 240px)" }}
              aria-hidden="true"
            >
              CW
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="font-serif text-2xl md:text-4xl text-[#1A1410] mb-6">The Lesson</h3>
              <p className="text-lg text-[#6B6560] leading-relaxed">
                For a luxury product,{" "}
                <span className="text-[#1A1410] italic font-semibold">
                  usability is the highest form of luxury
                </span>
                . A beautiful menu means nothing if it cannot be discovered.
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
            href="/work/velocity"
            className="group flex items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F26C0D]"
            aria-label="Previous case study: Velocity"
          >
            <div className="w-14 h-14 rounded-full border border-[#1A1410]/30 flex items-center justify-center group-hover:border-[#F26C0D] group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </div>
            <span
              className="font-serif font-light text-[#6B6560] group-hover:text-[#F26C0D] transition-colors duration-500 leading-none"
              style={{ fontSize: "clamp(24px, 4vw, 56px)" }}
            >
              Velocity
            </span>
          </a>
          <a
            href="/work/gmap"
            className="group flex items-center gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F26C0D]"
            aria-label="Next case study: G-MAP"
          >
            <span
              className="font-serif font-light text-[#6B6560] group-hover:text-[#F26C0D] transition-colors duration-500 leading-none"
              style={{ fontSize: "clamp(32px, 6vw, 72px)" }}
            >
              G-MAP
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
