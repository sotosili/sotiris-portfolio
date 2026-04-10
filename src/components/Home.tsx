/**
 * Home.tsx — Sotiris Iliadis Portfolio
 * Design: Adrián Somoza (bold hierarchy, colonize the canvas) +
 *         Tristan Harris (purposeful animation only, no dark patterns)
 * WCAG 2.1 AA — non-negotiable on every element
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Eye,
  Scale,
  Smartphone,
  Zap,
  Code,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Globe,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// ── Brand icons (not in lucide-react v1.x) ──────────────────────

const GithubIcon = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ── Framer Motion variants ───────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ── Intro overlay (GSAP — plays once per session) ────────────────

const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const line = lineRef.current;
    if (!overlay || !line) return;

    const iliadisLetters = overlay.querySelectorAll(".intro-letter-iliadis");
    const sotirisLetters = overlay.querySelectorAll(".intro-letter-sotiris");
    const allLetters = overlay.querySelectorAll(".intro-letter");
    const lineLength = line.getTotalLength();

    gsap.set(line, { strokeDasharray: lineLength, strokeDashoffset: lineLength });
    gsap.set(iliadisLetters, { opacity: 0, y: 20 });
    gsap.set(sotirisLetters, { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("introPlayed", "true");
        onComplete();
      },
    });

    tl.to(line, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0)
      .to(
        iliadisLetters,
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power3.out" },
        0.5
      )
      .to(
        sotirisLetters,
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power3.out" },
        0.9
      )
      .to(line, { strokeDashoffset: -lineLength, duration: 0.4, ease: "power2.inOut" }, 2.0)
      .to(allLetters, { opacity: 0, duration: 0.3, ease: "power2.out" }, 2.2)
      .to(overlay, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, 2.5);

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden"
      style={{ zIndex: 100 }}
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="flex flex-col items-center">
        <span className="flex" style={{ letterSpacing: "0.1em" }}>
          {"ILIADIS".split("").map((char, i) => (
            <span
              key={`i-${i}`}
              className="intro-letter intro-letter-iliadis text-6xl md:text-8xl font-serif font-bold inline-block"
              style={{ color: "#F26C0D" }}
            >
              {char}
            </span>
          ))}
        </span>
        <svg
          className="w-full"
          height="4"
          viewBox="0 0 600 4"
          preserveAspectRatio="none"
          style={{ margin: "12px 0" }}
          aria-hidden="true"
        >
          <line
            ref={lineRef}
            x1="0"
            y1="2"
            x2="600"
            y2="2"
            stroke="#F26C0D"
            strokeWidth="1.5"
          />
        </svg>
        <span className="flex" style={{ letterSpacing: "0.1em" }}>
          {"SOTIRIS".split("").map((char, i) => (
            <span
              key={`s-${i}`}
              className="intro-letter intro-letter-sotiris text-6xl md:text-8xl font-serif font-bold inline-block"
              style={{ color: "#0D5EAF" }}
            >
              {char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

// ── Hero (5-level hierarchy) ─────────────────────────────────────

const Hero = ({
  shouldReduceMotion,
  introComplete,
}: {
  shouldReduceMotion: boolean | null;
  introComplete: boolean;
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Hero stays invisible until introComplete — GSAP drives all visibility
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Do not animate until the intro overlay has finished.
    // On return visits introComplete is already true, so this fires immediately.
    if (!introComplete) return;

    if (shouldReduceMotion) {
      setIsReady(true);
      return;
    }

    // Make section visible then hand off to GSAP
    setIsReady(true);

    const ctx = gsap.context(() => {
      // ── Initial states ───────────────────────────────────────
      gsap.set(
        [
          ".animate-logo",
          ".animate-nav",
          ".animate-photo",
          ".animate-heading",
          ".animate-subtitle",
          ".animate-cta",
          ".animate-scroll",
          ".animate-name",
        ],
        { opacity: 0 }
      );
      // Photo slides in from below — no scale so object-contain is never cropped
      gsap.set(".animate-photo", { y: 50 });
      gsap.set(".animate-heading", { y: 32 });
      gsap.set(".animate-subtitle", { y: 20 });
      gsap.set(".animate-cta", { y: 20 });
      gsap.set(".animate-nav", { y: -20 });

      // ── Entry sequence ───────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl
        .to(".animate-name",    { opacity: 1, duration: 1.4 })
        .to(".animate-photo",   { y: 0, opacity: 1, duration: 1.4 }, "-=1.2")
        .to(".animate-heading", { y: 0, opacity: 1, duration: 1.0, ease: "expo.out" }, "-=1.1")
        .to(".animate-subtitle",{ y: 0, opacity: 1, duration: 0.8 }, "-=0.7")
        .to(".animate-cta",     { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .to(".animate-logo",    { opacity: 1, duration: 0.8 }, "-=0.8")
        .to(".animate-nav",     { y: 0, opacity: 1, stagger: 0.06, duration: 0.6 }, "-=0.6")
        .to(".animate-scroll",  { opacity: 1, duration: 0.8 }, "-=0.3");

      // ── Scroll-away parallax ─────────────────────────────────
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        animation: gsap
          .timeline()
          .to(contentRef.current,  { y: -80, opacity: 0, ease: "none" })
          .to(".animate-name",     { y: -40, opacity: 0, ease: "none" }, 0)
          .to(".animate-photo",    { y: -50, ease: "none" }, 0),
      });
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, [shouldReduceMotion, introComplete]);

  return (
    <section
      ref={heroRef}
      className={`relative min-h-screen overflow-hidden border-b border-white/10 transition-opacity duration-500 ${
        !isReady && !shouldReduceMotion ? "opacity-0" : "opacity-100"
      }`}
      aria-label="Introduction"
    >
      {/* Level 5: Watermark — behind everything */}
      <div
        className="animate-name absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <span
          className="font-serif font-black text-white/[0.028] leading-none whitespace-nowrap tracking-tighter"
          style={{ fontSize: "clamp(80px, 18vw, 260px)" }}
        >
          ILIADIS SOTIRIS
        </span>
      </div>

      {/* Level 1: Photo — right half, natural proportions, no crop */}
      <div
        className="animate-photo absolute top-0 right-0 bottom-0 w-full md:w-[55%] z-10 pointer-events-none bg-[#0A0A0A]"
        aria-hidden="true"
      >
        <img
          src="/images/profile.png"
          alt=""
          className="w-full h-full object-contain object-top"
        />
        {/* Left-edge dissolve into bg — wider fade for breathing room */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/55 md:via-[#0A0A0A]/20 to-transparent" />
        {/* Bottom dissolve */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </div>

      {/* Levels 2–4: Text — generous left column */}
      <div
        ref={contentRef}
        className="relative z-20 min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-28 pb-24"
        style={{ maxWidth: "min(52%, 760px)" }}
      >
        {/* Eyebrow */}
        <p className="animate-subtitle text-[10px] font-geist font-bold tracking-[0.5em] uppercase text-[#888888] mb-8">
          Sotiris Iliadis — Thessaloniki, Greece
        </p>

        {/* Level 2: Headline — colonizes the left canvas */}
        <div className="animate-heading">
          <h1
            className="font-serif font-bold leading-[0.86] tracking-tighter"
            style={{ fontSize: "clamp(56px, 7.5vw, 116px)" }}
          >
            <span className="block text-white">AI</span>
            <span className="block text-[#F26C0D] italic">Ethical</span>
            <span className="block text-white">Designer.</span>
          </h1>
        </div>

        {/* Level 3: Accent lines + descriptor */}
        <div className="animate-subtitle mt-10 md:mt-12">
          <div className="flex items-center gap-2 mb-5" aria-hidden="true">
            <div className="h-px w-12 bg-[#F26C0D]" />
            <div className="h-px w-6 bg-[#0D5EAF]" />
          </div>
          <p className="font-geist font-light text-base md:text-[17px] leading-relaxed text-[#888888] max-w-[340px]">
            Designing human-centered AI experiences.{" "}
            <span className="text-[#0D5EAF] font-medium">EU AI Act compliant.</span>
          </p>
        </div>

        {/* Level 4: CTAs */}
        <div className="animate-cta flex flex-col sm:flex-row gap-3 mt-10 md:mt-12">
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-[14px] bg-[#F26C0D] text-white text-[11px] font-geist font-bold uppercase tracking-[0.32em] hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26C0D]"
          >
            View Work
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <a
            href="#process"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-[14px] border border-white/25 text-white text-[11px] font-geist font-bold uppercase tracking-[0.32em] hover:border-white hover:bg-white/5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            My Process
          </a>
        </div>

        {/* Scroll indicator */}
        {!shouldReduceMotion && (
          <div
            className="animate-scroll absolute bottom-10 left-8 md:left-16 lg:left-24 flex items-center gap-3"
            aria-hidden="true"
          >
            <div className="h-10 w-px bg-white/15 overflow-hidden">
              <motion.div
                animate={{ y: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="h-full w-full bg-[#F26C0D]"
              />
            </div>
            <span className="text-[8px] font-geist font-bold uppercase tracking-[0.5em] text-[#888888]">
              Scroll
            </span>
          </div>
        )}
      </div>

      {/* Mobile: photo below fold — pull it behind the text on small screens */}
      <style>{`
        @media (max-width: 767px) {
          .hero-photo-mobile { position: relative !important; width: 100% !important; height: 55vw !important; }
        }
      `}</style>
    </section>
  );
};

// ── Data ─────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: "Coffee World",
    description:
      "Premium QR-code digital menu for a luxury Thessaloniki café. Bilingual Greek/English, dark aesthetic, zero PDF friction.",
    metrics: ["94/100 Lighthouse", "WCAG AA", "Bilingual"],
    image: "/images/coffee-world-mockup.png",
    link: "/work/coffee-world",
    year: "2026",
    category: "UX/UI & Frontend",
    full: true,
  },
  {
    title: "G-MAP",
    description:
      "Gym machine scanner that connects equipment to personalized programs. Tested with gym-goers who understood it without explanation.",
    metrics: ["91/100 Lighthouse", "WCAG AA", "48h prototype"],
    image: "/images/gmap-mockup.png",
    link: "/work/gmap",
    year: "2026",
    category: "UX/UI Design",
    full: false,
  },
  {
    title: "Velocity",
    description:
      "Ethics-first European cross-border payment app. Both test participants independently called it more ethical than alternatives they use.",
    metrics: ["96/100 Lighthouse", "WCAG AA", "0 dark patterns"],
    image: "/images/velocity-mockup.png",
    link: "/work/velocity",
    year: "2025",
    category: "Research & UX",
    full: false,
  },
];

const PRINCIPLES = [
  {
    num: "01",
    icon: <Search className="w-5 h-5" aria-hidden="true" />,
    title: "Research First",
    desc: "Evidence-based decisions driven by user research and accessibility audits before any visual design begins.",
    accent: "#F26C0D",
  },
  {
    num: "02",
    icon: <ShieldCheck className="w-5 h-5" aria-hidden="true" />,
    title: "Inclusive Design",
    desc: "WCAG AA is the baseline. Technology must empower everyone regardless of ability, language, or background.",
    accent: "#0D5EAF",
  },
  {
    num: "03",
    icon: <Eye className="w-5 h-5" aria-hidden="true" />,
    title: "Ethical Agency",
    desc: "Prioritising transparency and fairness so AI serves human interests without hidden harms or manipulative patterns.",
    accent: "#F26C0D",
  },
  {
    num: "04",
    icon: <Scale className="w-5 h-5" aria-hidden="true" />,
    title: "EU AI Act",
    desc: "Full compliance with EU AI Act risk classification, transparency obligations, and human oversight requirements.",
    accent: "#0D5EAF",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    label: "Research",
    icon: <Search className="w-5 h-5" aria-hidden="true" />,
    desc: "User interviews, competitive analysis, and ethical AI risk audits.",
  },
  {
    num: "02",
    label: "Design",
    icon: <ShieldCheck className="w-5 h-5" aria-hidden="true" />,
    desc: "Figma systems with built-in WCAG AA compliance from day one.",
  },
  {
    num: "03",
    label: "Prototype",
    icon: <Smartphone className="w-5 h-5" aria-hidden="true" />,
    desc: "Rapid 48-hour interactive builds for immediate user testing.",
  },
  {
    num: "04",
    label: "Refine",
    icon: <Zap className="w-5 h-5" aria-hidden="true" />,
    desc: "Fast iterations on interactions, accessibility, and visual polish.",
  },
  {
    num: "05",
    label: "Deliver",
    icon: <Code className="w-5 h-5" aria-hidden="true" />,
    desc: "Production-ready code, Figma assets, full accessibility documentation.",
  },
];

// ── Metric pill ──────────────────────────────────────────────────

const Pill = ({ label }: { label: string }) => (
  <span className="px-2 py-1 text-[9px] font-geist font-bold tracking-widest uppercase bg-white/5 text-[#888888] border border-white/10">
    {label}
  </span>
);

// ── Main export ──────────────────────────────────────────────────

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const [introComplete, setIntroComplete] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("introPlayed") === "true";
  });

  // Stable reference — prevents IntroOverlay's useEffect from re-running on re-renders
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // EmailJS — existing credentials preserved
  const handleSendEmail = async () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setFormStatus("sending");
    try {
      await emailjs.send(
        "service_xbuaezg",
        "template_xqca96m",
        {
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          title: "Portfolio contact from your website",
        },
        "8nTfC8whyFlvKD7W4"
      );
      setFormStatus("success");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  // Scroll tracking — passive for performance
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
      const ids = ["work", "philosophy", "process", "contact"];
      const active = ids.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const { top, bottom } = el.getBoundingClientRect();
        return top <= 120 && bottom >= 120;
      });
      if (active) setActiveSection(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth anchor scroll
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor?.hash && anchor.origin === window.location.origin) {
        const el = document.getElementById(anchor.hash.slice(1));
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", anchor.hash);
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // ScrollTrigger reveals + process step lighting
  useEffect(() => {
    if (!introComplete) return;

    const timer = setTimeout(() => {
      ScrollTrigger.getAll().forEach((t) => t.kill());

      // Section reveals
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // Process steps light up sequentially on scroll
      gsap.utils.toArray<HTMLElement>(".process-step").forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 72%",
          once: true,
          onEnter: () => {
            gsap.to(step.querySelector(".step-number"), {
              color: "#F26C0D",
              duration: 0.6,
              ease: "power2.out",
              delay: i * 0.12,
            });
            gsap.to(step.querySelector(".step-line"), {
              scaleX: 1,
              duration: 0.7,
              ease: "power3.out",
              delay: i * 0.12,
            });
            gsap.to(step.querySelector(".step-icon"), {
              color: "#F26C0D",
              duration: 0.4,
              ease: "power2.out",
              delay: i * 0.12 + 0.2,
            });
          },
        });
      });

      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [introComplete]);

  // Logo reveal on hover
  const triggerLogoReveal = (entering: boolean) => {
    const tl = gsap.timeline({ overwrite: "auto" });
    if (entering) {
      tl.to(".animate-logo-container", { width: "auto", duration: 0.4, ease: "expo.out" }).to(
        ".reveal-letter",
        { opacity: 1, x: 0, stagger: 0.02, duration: 0.3, ease: "power2.out" },
        "-=0.2"
      );
    } else {
      tl.to(".reveal-letter", {
        opacity: 0,
        x: -10,
        stagger: { each: 0.01, from: "end" },
        duration: 0.2,
        ease: "power2.in",
      }).to(".animate-logo-container", { width: "40px", duration: 0.3, ease: "expo.in" }, "-=0.1");
    }
  };

  const NAV = [
    { label: "WORK", href: "#work", id: "work" },
    { label: "PHILOSOPHY", href: "#philosophy", id: "philosophy" },
    { label: "PROCESS", href: "#process", id: "process" },
    { label: "CONTACT", href: "#contact", id: "contact" },
  ];

  return (
    <>
      {/* Skip navigation for keyboard / screen-reader users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-[#F26C0D] focus:text-white focus:text-sm focus:font-bold focus:rounded"
      >
        Skip to main content
      </a>

      {/* Intro overlay — plays once per session */}
      {!introComplete && !shouldReduceMotion && (
        <IntroOverlay onComplete={handleIntroComplete} />
      )}

      {/* Subtle global texture */}
      {/* Radial depth: #111 at center fades to #0A0A0A at edges — adds depth without visible gradient */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 35%, #111111 0%, #0A0A0A 70%)" }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/60 z-10" />
        <img
          src="/images/greek-hero-bg.png"
          alt=""
          className="w-full h-full object-cover opacity-[0.04]"
          loading="lazy"
        />
      </div>

      <div className="relative z-10">

        {/* ── Top logo bar ──────────────────────────────────────── */}
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-5 ${
            isScrolled
              ? "bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/[0.05]"
              : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
            {/* Logo with hover-expand */}
            <div
              className="animate-logo-container flex items-center overflow-hidden whitespace-nowrap cursor-pointer"
              style={{ width: "40px" }}
              onMouseEnter={() => triggerLogoReveal(true)}
              onMouseLeave={() => triggerLogoReveal(false)}
              aria-label="Sotiris Iliadis — home"
            >
              <span className="animate-logo font-serif text-2xl font-bold tracking-tighter text-white hover:text-[#F26C0D] transition-colors select-none">
                IS.
              </span>
              <div className="flex ml-3" aria-hidden="true">
                {"ILIADIS SOTIRIS".split("").map((char, i) => (
                  <span
                    key={i}
                    className="reveal-letter opacity-0 inline-block font-serif text-xl font-bold tracking-tighter uppercase text-white"
                    style={{ transform: "translateX(-10px)" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </div>
            </div>

            {/* Mobile nav (top bar) */}
            <nav
              className="flex md:hidden gap-5"
              aria-label="Main navigation"
            >
              {NAV.slice(0, 3).map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-[8px] font-geist font-bold tracking-[0.3em] uppercase min-h-[44px] flex items-center transition-colors ${
                    activeSection === link.id
                      ? "text-[#F26C0D]"
                      : "text-white/35 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Desktop side dot nav ──────────────────────────────── */}
        <nav
          className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-4 pointer-events-none"
          aria-label="Section navigation"
        >
          {NAV.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`animate-nav pointer-events-auto flex items-center gap-2.5 min-h-[44px] items-center transition-all duration-300 group ${
                activeSection === link.id ? "text-white" : "text-white/20 hover:text-white/50"
              }`}
            >
              <span className="text-[8px] font-geist font-bold tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                {link.label}
              </span>
              <div
                className={`rounded-full transition-all duration-300 ${
                  activeSection === link.id
                    ? "w-2 h-2 bg-[#F26C0D]"
                    : "w-1.5 h-1.5 bg-white/20 group-hover:bg-white/50"
                }`}
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <Hero shouldReduceMotion={shouldReduceMotion} introComplete={introComplete} />

        <main id="main">

          {/* ════════════════════════════════════════════════════
              01 — WORK
          ════════════════════════════════════════════════════ */}
          <section
            id="work"
            className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto"
            aria-labelledby="work-heading"
          >
            <motion.div
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-8%" }}
              variants={stagger}
              className="mb-16 md:mb-20"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-4 mb-5">
                <span className="h-px w-10 bg-[#F26C0D]/50" aria-hidden="true" />
                <span className="text-[#F26C0D] text-[10px] font-geist font-bold tracking-[0.45em] uppercase" aria-hidden="true">
                  01
                </span>
              </motion.div>
              <motion.h2
                id="work-heading"
                variants={fadeUp}
                className="font-serif font-light leading-[0.88] tracking-tighter text-white"
                style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
              >
                Selected
                <br />
                <span className="italic text-white/40">Work</span>
              </motion.h2>
            </motion.div>

            <div className="space-y-6">
              {/* Full-width Coffee World */}
              {PROJECTS.filter((p) => p.full).map((project) => (
                <article key={project.title} className="group reveal-section">
                  <a
                    href={project.link}
                    className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F26C0D]"
                    aria-label={`${project.title} — ${project.description} View case study`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[21/9] bg-[#111111] overflow-hidden">
                      <img
                        src={project.image}
                        alt=""
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02] grayscale group-hover:grayscale-0"
                        loading="lazy"
                      />
                      {/* Hover overlay */}
                      <div
                        className="absolute inset-0 bg-[#F26C0D]/0 group-hover:bg-[#F26C0D]/90 transition-all duration-500 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <span className="text-white text-sm font-geist font-bold tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-3">
                          View Case Study
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-start justify-between mt-5 gap-4 flex-wrap">
                      <div>
                        <h3 className="font-serif text-3xl md:text-4xl font-light text-white group-hover:text-[#F26C0D] transition-colors duration-300 leading-none mb-2">
                          {project.title}
                        </h3>
                        <p className="font-geist text-sm font-light text-[#888888] max-w-xl">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right space-y-3">
                        <span className="block text-[9px] font-geist font-bold text-[#F26C0D] tracking-[0.35em] uppercase">
                          {project.year}
                        </span>
                        <div className="flex gap-2 flex-wrap justify-end">
                          {project.metrics.map((m) => (
                            <Pill key={m} label={m} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              ))}

              {/* Half-width G-MAP + Velocity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS.filter((p) => !p.full).map((project) => (
                  <article key={project.title} className="group reveal-section">
                    <a
                      href={project.link}
                      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F26C0D]"
                      aria-label={`${project.title} — ${project.description} View case study`}
                    >
                      <div className="relative aspect-[4/3] bg-[#111111] overflow-hidden">
                        <img
                          src={project.image}
                          alt=""
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02] grayscale group-hover:grayscale-0"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 bg-[#F26C0D]/0 group-hover:bg-[#F26C0D]/90 transition-all duration-500 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <span className="text-white text-sm font-geist font-bold tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-3">
                            View Case Study
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-2xl md:text-3xl font-light text-white group-hover:text-[#F26C0D] transition-colors duration-300 leading-none mb-2">
                            {project.title}
                          </h3>
                          <p className="font-geist text-sm font-light text-[#888888]">
                            {project.description}
                          </p>
                        </div>
                        <span className="text-[9px] font-geist font-bold text-[#F26C0D] tracking-[0.35em] uppercase flex-shrink-0">
                          {project.year}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {project.metrics.map((m) => (
                          <Pill key={m} label={m} />
                        ))}
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <div className="h-px bg-white/[0.06] max-w-7xl mx-auto" aria-hidden="true" />

          {/* ════════════════════════════════════════════════════
              02 — PHILOSOPHY
          ════════════════════════════════════════════════════ */}
          <section
            id="philosophy"
            className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto"
            aria-labelledby="philosophy-heading"
          >
            <motion.div
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-8%" }}
              variants={stagger}
              className="mb-16 md:mb-20"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-4 mb-5">
                <span className="h-px w-10 bg-[#0D5EAF]/50" aria-hidden="true" />
                <span className="text-[#0D5EAF] text-[10px] font-geist font-bold tracking-[0.45em] uppercase" aria-hidden="true">
                  02
                </span>
              </motion.div>
              <motion.h2
                id="philosophy-heading"
                variants={fadeUp}
                className="font-serif font-light leading-[0.88] tracking-tighter text-white"
                style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
              >
                Design with
                <br />
                <span className="italic text-[#F26C0D]">Intent,</span>
                <br />
                <span className="text-white/35">Build with Care</span>
              </motion.h2>
            </motion.div>

            {/* 4-column principle grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05] border border-white/[0.05] overflow-hidden"
              role="list"
            >
              {PRINCIPLES.map((p, i) => (
                <motion.div
                  key={p.num}
                  initial={shouldReduceMotion ? "visible" : "hidden"}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-5%" }}
                  variants={fadeUp}
                  custom={i}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-[#0A0A0A] p-8 md:p-10 hover:bg-[#111111] transition-colors duration-500 reveal-section"
                  role="listitem"
                >
                  {/* Somoza-style bold number */}
                  <div
                    className="font-serif font-black leading-none text-white/[0.05] group-hover:text-[#F26C0D]/15 transition-colors duration-500 mb-6 select-none"
                    style={{ fontSize: "clamp(72px, 8vw, 108px)" }}
                    aria-hidden="true"
                  >
                    {p.num}
                  </div>

                  {/* Icon */}
                  <div
                    className="mb-5 transition-transform duration-300 group-hover:scale-110 origin-left"
                    style={{ color: p.accent }}
                  >
                    {p.icon}
                  </div>

                  <h3 className="font-serif text-xl md:text-2xl font-light text-white mb-3 group-hover:text-[#F26C0D] transition-colors duration-500">
                    {p.title}
                  </h3>
                  <p className="font-geist text-sm text-[#888888] leading-relaxed font-light">
                    {p.desc}
                  </p>

                  {/* Animated bottom accent */}
                  <div
                    className="mt-8 h-px w-0 group-hover:w-full transition-all duration-700"
                    style={{ backgroundColor: p.accent }}
                    aria-hidden="true"
                  />
                </motion.div>
              ))}
            </div>
          </section>

          <div className="h-px bg-white/[0.06] max-w-7xl mx-auto" aria-hidden="true" />

          {/* ════════════════════════════════════════════════════
              03 — PROCESS
          ════════════════════════════════════════════════════ */}
          <section
            id="process"
            className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto overflow-x-hidden"
            aria-labelledby="process-heading"
          >
            <motion.div
              initial={shouldReduceMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-8%" }}
              variants={stagger}
              className="mb-20 md:mb-28"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-4 mb-5">
                <span className="h-px w-10 bg-[#F26C0D]/50" aria-hidden="true" />
                <span className="text-[#F26C0D] text-[10px] font-geist font-bold tracking-[0.45em] uppercase" aria-hidden="true">
                  03
                </span>
              </motion.div>
              <motion.h2
                id="process-heading"
                variants={fadeUp}
                className="font-serif font-light leading-[0.88] tracking-tighter text-white"
                style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
              >
                Design
                <br />
                <span className="italic text-[#F26C0D]">Workflow</span>
              </motion.h2>
            </motion.div>

            {/* 5-step timeline */}
            <div className="relative" role="list" aria-label="Design process steps">
              {/* Horizontal connector (desktop only) */}
              <div
                className="absolute top-[4.5rem] left-0 right-0 h-px bg-white/[0.06] hidden lg:block"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-4">
                {PROCESS_STEPS.map((step, i) => (
                  <div
                    key={step.num}
                    className="process-step flex flex-col items-start lg:items-center"
                    role="listitem"
                  >
                    {/* Timeline node */}
                    <div className="relative mb-4 lg:self-center" aria-hidden="true">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/15 bg-[#0A0A0A] hidden lg:block" />
                    </div>

                    {/* Large number — lights up on scroll via GSAP */}
                    <div
                      className="step-number font-serif font-black leading-none tracking-tighter text-white/[0.07] transition-colors duration-500 mb-5 select-none"
                      style={{ fontSize: "clamp(72px, 8vw, 108px)" }}
                      aria-hidden="true"
                    >
                      {step.num}
                    </div>

                    {/* Underline — scales in via GSAP */}
                    <div
                      className="step-line h-[2px] w-full bg-[#F26C0D] origin-left hidden lg:block mb-5"
                      style={{ transform: "scaleX(0)" }}
                      aria-hidden="true"
                    />

                    {/* Icon */}
                    <div className="step-icon text-white/30 transition-colors duration-500 mb-3">
                      {step.icon}
                    </div>

                    <h3 className="font-serif text-xl font-light text-white mb-2 lg:text-center">
                      {step.label}
                    </h3>
                    <p className="font-geist text-xs text-[#888888] leading-relaxed font-light lg:text-center">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="h-px bg-white/[0.06] max-w-7xl mx-auto" aria-hidden="true" />

          {/* ════════════════════════════════════════════════════
              04 — CONTACT
          ════════════════════════════════════════════════════ */}
          <section
            id="contact"
            className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto"
            aria-labelledby="contact-heading"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

              {/* Left column */}
              <div className="space-y-10 reveal-section">
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-[#0D5EAF]/50" aria-hidden="true" />
                  <span className="text-[#0D5EAF] text-[10px] font-geist font-bold tracking-[0.45em] uppercase" aria-hidden="true">
                    04
                  </span>
                </div>

                <h2
                  id="contact-heading"
                  className="font-serif font-bold leading-[0.88] tracking-tighter text-white"
                  style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
                >
                  Let's build
                  <br />
                  something
                  <br />
                  <span className="italic text-[#F26C0D]">ethical</span>
                  <br />
                  together.
                </h2>

                {/* Direct links */}
                <div className="space-y-4 pt-2">
                  <a
                    href="mailto:ilisotiris@gmail.com"
                    className="flex items-center gap-3 text-white hover:text-[#F26C0D] transition-colors group w-fit min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26C0D]"
                  >
                    <span
                      className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#F26C0D] transition-colors flex-shrink-0"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-3 h-3 -rotate-45" />
                    </span>
                    <span className="font-geist font-light text-base">ilisotiris@gmail.com</span>
                  </a>

                  <div className="flex gap-6 pt-1">
                    <a
                      href="https://github.com/sotosili"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors group/link min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <GithubIcon
                        className="w-4 h-4 group-hover/link:scale-110 transition-transform flex-shrink-0"
                        strokeWidth={1.5}
                      />
                      <span className="text-[10px] font-geist font-bold tracking-[0.25em] uppercase">
                        GitHub
                      </span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sotiris-iliadis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors group/link min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <LinkedinIcon
                        className="w-4 h-4 group-hover/link:scale-110 transition-transform flex-shrink-0"
                        strokeWidth={1.5}
                      />
                      <span className="text-[10px] font-geist font-bold tracking-[0.25em] uppercase">
                        LinkedIn
                      </span>
                    </a>
                  </div>
                </div>

                {/* Availability */}
                <div className="border-t border-white/[0.08] pt-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <p className="font-geist text-sm text-[#888888]">
                      <span className="text-white font-medium">Available</span> for remote &amp;
                      hybrid engagements
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-3.5 h-3.5 text-[#888888] flex-shrink-0" aria-hidden="true" />
                    <p className="font-geist text-sm text-[#888888]">
                      Thessaloniki, Greece · UTC+3
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-3.5 h-3.5 text-[#888888] flex-shrink-0" aria-hidden="true" />
                    <p className="font-geist text-sm text-[#888888]">
                      Greek · English · EU-based
                    </p>
                  </div>
                </div>
              </div>

              {/* Right column — EmailJS form */}
              <div className="bg-[#111111] border border-white/[0.08] p-8 md:p-10 reveal-section relative group">
                {/* Animated left accent line */}
                <div
                  className="absolute top-0 left-0 w-px h-0 bg-[#F26C0D] group-hover:h-full transition-all duration-700"
                  aria-hidden="true"
                />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendEmail();
                  }}
                  className="space-y-7"
                  noValidate
                  aria-label="Contact form"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="block text-[10px] font-geist font-bold uppercase tracking-[0.3em] text-[#0D5EAF]"
                    >
                      Name{" "}
                      <span className="text-[#F26C0D]" aria-label="required">
                        *
                      </span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-transparent border-b border-white/15 focus:border-[#F26C0D] outline-none py-3 font-geist font-light text-base text-white placeholder-[#444444] transition-colors"
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-email"
                      className="block text-[10px] font-geist font-bold uppercase tracking-[0.3em] text-[#0D5EAF]"
                    >
                      Email{" "}
                      <span className="text-[#F26C0D]" aria-label="required">
                        *
                      </span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-white/15 focus:border-[#F26C0D] outline-none py-3 font-geist font-light text-base text-white placeholder-[#444444] transition-colors"
                      placeholder="hello@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-message"
                      className="block text-[10px] font-geist font-bold uppercase tracking-[0.3em] text-[#0D5EAF]"
                    >
                      Message{" "}
                      <span className="text-[#F26C0D]" aria-label="required">
                        *
                      </span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-transparent border-b border-white/15 focus:border-[#F26C0D] outline-none py-3 font-geist font-light text-base text-white placeholder-[#444444] transition-colors resize-none"
                      placeholder="What would you like to discuss?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="w-full bg-[#F26C0D] text-white py-5 text-[11px] font-geist font-bold uppercase tracking-[0.35em] hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26C0D]"
                  >
                    {formStatus === "sending" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>

                  {formStatus === "success" && (
                    <div
                      role="alert"
                      className="flex items-center gap-3 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-3"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <p className="font-geist text-sm font-medium">
                        Sent. I'll reply within 24 hours.
                      </p>
                    </div>
                  )}

                  {formStatus === "error" && (
                    <div
                      role="alert"
                      className="flex items-center gap-3 text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <p className="font-geist text-sm font-medium">
                        Something went wrong.{" "}
                        <a
                          href="mailto:ilisotiris@gmail.com"
                          className="underline hover:no-underline"
                        >
                          Email me directly.
                        </a>
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </section>
        </main>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="py-7 px-6 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] font-geist font-bold uppercase tracking-[0.35em] text-[#888888]">
            <p>© 2026 Sotiris Iliadis</p>
            <p>AI Ethical Designer · Thessaloniki, Greece</p>
          </div>
        </footer>
      </div>

      {/* ── Mobile bottom nav ────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/[0.06] py-3 px-2"
        aria-label="Mobile navigation"
      >
        {NAV.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`flex flex-col items-center gap-1 min-w-[56px] min-h-[44px] justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26C0D] ${
              activeSection === link.id ? "text-[#F26C0D]" : "text-white/30"
            }`}
          >
            <span className="text-[7px] font-geist font-black tracking-widest uppercase">
              {link.label}
            </span>
            {activeSection === link.id && (
              <div className="w-1 h-1 rounded-full bg-[#F26C0D]" aria-hidden="true" />
            )}
          </a>
        ))}
      </nav>
    </>
  );
}
