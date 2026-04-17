/**
 * animations.ts — Unified GSAP animation ecosystem
 *
 * Used across Home.tsx and all three case study components.
 * All animations respect prefers-reduced-motion via the `reducedMotion` flag.
 *
 * Animation classes:
 *   .anim-fade-up   — y:40 opacity:0 → y:0 opacity:1 on scroll enter
 *   .anim-fade-in   — opacity:0 → opacity:1 on scroll enter
 *   .anim-line-grow — scaleX:0 → scaleX:1, transformOrigin:left on scroll enter
 *   .anim-count     — counts 0 → data-target on scroll enter (leaf node only)
 *   .anim-stagger   — children fade-up staggered 0.12s apart on scroll enter
 *   .anim-step      — process step container: illuminates .anim-step-num, .anim-line-grow, .anim-step-icon
 *   .anim-step-num  — ghost number inside .anim-step that turns orange on enter
 *   .anim-step-icon — icon inside .anim-step that turns orange slightly after the number
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

interface NavigateEvent {
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  preventDefault?: () => void;
}

/**
 * Set up all scroll-triggered animations within `container`.
 * Returns a cleanup function — call it in the useEffect return.
 */
export function setupScrollAnimations(
  container: HTMLElement | null,
  reducedMotion: boolean
): () => void {
  if (reducedMotion || !container) return () => {};

  const ctx = gsap.context(() => {

    // ── .anim-fade-up ─────────────────────────────────────────────
    gsap.utils.toArray<HTMLElement>(".anim-fade-up", container).forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    });

    // ── .anim-fade-in ─────────────────────────────────────────────
    gsap.utils.toArray<HTMLElement>(".anim-fade-in", container).forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    });

    // ── .anim-line-grow (standalone — skips lines inside .anim-step) ─
    gsap.utils.toArray<HTMLElement>(".anim-line-grow", container).forEach((el) => {
      if (el.closest(".anim-step")) return;
      gsap.fromTo(
        el,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        }
      );
    });

    // ── .anim-count (leaf node with data-target attribute) ──────────
    // Hide the real HTML value immediately so the page never shows the
    // raw number before the counter starts. It becomes visible the instant
    // onEnter fires, eliminating the jarring "94 → 0 → count" jump.
    gsap.utils.toArray<HTMLElement>(".anim-count", container).forEach((el) => {
      const target = parseFloat(el.dataset.target ?? "0");
      const isInt = Number.isInteger(target);
      const counter = { val: 0 };
      gsap.set(el, { opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.set(el, { opacity: 1 });
          el.textContent = "0";
          gsap.to(counter, {
            val: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = isInt
                ? String(Math.round(counter.val))
                : counter.val.toFixed(1);
            },
          });
        },
      });
    });

    // ── .anim-stagger (children fade-up with 0.12s stagger) ─────────
    gsap.utils.toArray<HTMLElement>(".anim-stagger", container).forEach((el) => {
      const children = Array.from(el.children) as HTMLElement[];
      gsap.fromTo(
        children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    });

    // ── .anim-step (process step sequential illumination) ───────────
    gsap.utils.toArray<HTMLElement>(".anim-step", container).forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 78%",
        once: true,
        onEnter: () => {
          const num = step.querySelector<HTMLElement>(".anim-step-num");
          const line = step.querySelector<HTMLElement>(".anim-line-grow");
          const icon = step.querySelector<HTMLElement>(".anim-step-icon");
          const delay = i * 0.12;

          if (num) {
            gsap.to(num, { color: "#F26C0D", duration: 0.6, ease: "power2.out", delay });
          }
          if (line) {
            gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
            gsap.to(line, { scaleX: 1, duration: 0.7, ease: "power3.out", delay });
          }
          if (icon) {
            gsap.to(icon, { color: "#F26C0D", duration: 0.4, ease: "power2.out", delay: delay + 0.2 });
          }
        },
      });
    });

    ScrollTrigger.refresh();
  }, container);

  return () => ctx.revert();
}

/**
 * Animate hero metric counters on page entry (not scroll).
 * Target elements: .anim-hero-count[data-target]
 * Fires after `delay` ms to let the Framer Motion entry animation complete first.
 */
export function setupHeroCounters(
  reducedMotion: boolean,
  delay = 1300
): () => void {
  if (reducedMotion) return () => {};
  // Hide counters immediately — before the timeout — so raw HTML values
  // are never visible during the 1300ms intro animation window.
  document.querySelectorAll<HTMLElement>(".anim-hero-count").forEach((el) => {
    gsap.set(el, { opacity: 0 });
  });
  const timer = setTimeout(() => {
    document.querySelectorAll<HTMLElement>(".anim-hero-count").forEach((el) => {
      const target = parseFloat(el.dataset.target ?? "0");
      const counter = { val: 0 };
      gsap.to(el, { opacity: 1, duration: 0.15, ease: "none" });
      gsap.to(counter, {
        val: target,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = String(Math.round(counter.val));
        },
      });
    });
  }, delay);
  return () => clearTimeout(timer);
}

/**
 * Navigate to `href` with an orange-sweep overlay transition.
 * Passes through modifier-key clicks so the browser handles cmd+click / ctrl+click normally.
 */
export function navigateWithTransition(href: string, e?: NavigateEvent): void {
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return;
  if (e?.preventDefault) e.preventDefault();

  let overlay = document.getElementById("page-transition-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "page-transition-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      backgroundColor: "#F26C0D",
      zIndex: "99999",
      transformOrigin: "left center",
      transform: "scaleX(0)",
      pointerEvents: "none",
    });
    document.body.appendChild(overlay);
  }

  gsap.to(overlay, {
    scaleX: 1,
    duration: 0.45,
    ease: "power3.inOut",
    onComplete: () => {
      window.location.href = href;
    },
  });
}
