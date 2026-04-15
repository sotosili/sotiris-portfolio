/**
 * EthicsGrid.tsx — Canvas-based ethics grid background
 *
 * A sparse 12 × 8 grid of ultra-thin white lines covers every page.
 * Four orange + crosshairs mark key viewport positions.
 *
 * On load   : lines draw in left→right and top→bottom over 1.2s (power3.out)
 * On scroll  : grid translates at 0.15× scroll speed — depth parallax
 * On cursor  : two nearest crosshairs within 120px pulse (scale 1→1.6,
 *              color #444444→#F26C0D) via GSAP quickTo
 * Reduced motion: static grid at full opacity, no cursor effect, no draw-in
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

// ── Constants ────────────────────────────────────────────────────────────────

const COLS = 12;
const ROWS = 8;

// Extra rows drawn above the viewport to prevent gaps during parallax.
// At 0.15× factor, 10 extra rows covers ~10 × (vh/8) / 0.15 ≈ 8× viewport
// heights of scroll — enough for any portfolio page length.
const EXTRA_ABOVE = 10;
const EXTRA_BELOW = 2;

// Crosshair grid positions as exact col/row intersection fractions.
// Chosen to land near the four main section anchor points.
const CROSSHAIR_DEFS = [
  { cf: 3 / COLS,  rf: 2 / ROWS },   // hero — left
  { cf: 9 / COLS,  rf: 2 / ROWS },   // hero — right
  { cf: 2 / COLS,  rf: 5 / ROWS },   // work / process zone
  { cf: 10 / COLS, rf: 7 / ROWS },   // contact zone
] as const;

const PROXIMITY_RADIUS = 120; // px — cursor distance to activate a crosshair
const ARM_BASE = 8;           // px — crosshair arm length at scale 1
const ACTIVE_SCALE = 1.6;

// ── Color helpers ────────────────────────────────────────────────────────────

// t=0 → #444444 (cold grey),  t=1 → #F26C0D (orange)
function lerpColor(t: number): string {
  const r = Math.round(0x44 + (0xf2 - 0x44) * t);
  const g = Math.round(0x44 + (0x6c - 0x44) * t);
  const b = Math.round(0x44 + (0x0d - 0x44) * t);
  return `rgb(${r},${g},${b})`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function EthicsGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Mutable state (read each rAF frame) ─────────────────────────────────
    const prog = { h: reduced ? 1 : 0, v: reduced ? 1 : 0 };
    let scrollY = 0;
    let cellW = 0;
    let cellH = 0;
    let rafId = 0;

    // ── Crosshair proxies ───────────────────────────────────────────────────
    // GSAP animates `proxy.color` (0→1) and `proxy.scale` (1→ACTIVE_SCALE).
    // The rAF loop reads these values each frame when drawing.
    const crosshairs = CROSSHAIR_DEFS.map(({ cf, rf }) => ({
      cf,
      rf,
      proxy: { color: 0 as number, scale: 1 as number },
      active: false,
      quickColor: null as Function | null,
      quickScale: null as Function | null,
    }));

    if (!reduced) {
      for (const ch of crosshairs) {
        ch.quickColor = gsap.quickTo(ch.proxy, "color", {
          duration: 0.4,
          ease: "power2.out",
        });
        ch.quickScale = gsap.quickTo(ch.proxy, "scale", {
          duration: 0.25,
          ease: "power2.out",
        });
      }
    }

    // ── Resize ──────────────────────────────────────────────────────────────
    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      cellW = W / COLS;
      cellH = H / ROWS;
    }

    // ── Draw loop ────────────────────────────────────────────────────────────
    function draw() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const parallaxY = -scrollY * 0.15;

      // Clear using physical pixel dimensions (before any transform)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);       // work in logical (CSS) pixel space
      ctx.translate(0, parallaxY); // scroll parallax

      // ── Grid lines ─────────────────────────────────────────────────────
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 0.5;

      // Horizontal: draw from x=0 to x=W*prog.h (wipe left→right)
      const hRight = W * prog.h;
      for (let r = -EXTRA_ABOVE; r <= ROWS + EXTRA_BELOW; r++) {
        const y = r * cellH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(hRight, y);
        ctx.stroke();
      }

      // Vertical: draw from yTop to yTop + totalHeight*prog.v (wipe top→bottom)
      const yTop = -EXTRA_ABOVE * cellH;
      const totalH = (ROWS + EXTRA_ABOVE + EXTRA_BELOW) * cellH;
      for (let c = 0; c <= COLS; c++) {
        const x = c * cellW;
        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yTop + totalH * prog.v);
        ctx.stroke();
      }

      // ── Crosshairs ─────────────────────────────────────────────────────
      for (const ch of crosshairs) {
        const x = ch.cf * W;
        const y = ch.rf * H;
        const arm = ARM_BASE * ch.proxy.scale;

        ctx.strokeStyle = lerpColor(ch.proxy.color);
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(x - arm, y);
        ctx.lineTo(x + arm, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y - arm);
        ctx.lineTo(x, y + arm);
        ctx.stroke();
      }

      ctx.restore();

      rafId = requestAnimationFrame(draw);
    }

    // ── Event handlers ───────────────────────────────────────────────────────
    function onScroll() {
      scrollY = Math.max(0, window.scrollY);
    }

    function onMouseMove(e: MouseEvent) {
      if (reduced) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const parallaxY = -scrollY * 0.15;

      // Rank crosshairs by distance to cursor (accounting for parallax offset)
      const ranked = crosshairs
        .map((ch) => {
          const cx = ch.cf * W;
          // Crosshair's screen-space y shifts with parallax
          const cy = ch.rf * H + parallaxY;
          return { ch, dist: Math.hypot(e.clientX - cx, e.clientY - cy) };
        })
        .sort((a, b) => a.dist - b.dist);

      ranked.forEach(({ ch, dist }, idx) => {
        const nowActive = dist < PROXIMITY_RADIUS && idx < 2;
        if (nowActive !== ch.active) {
          ch.active = nowActive;
          ch.quickColor?.(nowActive ? 1 : 0);
          ch.quickScale?.(nowActive ? ACTIVE_SCALE : 1);
        }
      });
    }

    // ── Bootstrap ────────────────────────────────────────────────────────────
    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);

    if (!reduced) {
      gsap.to(prog, { h: 1, duration: 1.2, ease: "power3.out", delay: 0.2 });
      gsap.to(prog, { v: 1, duration: 1.2, ease: "power3.out", delay: 0.35 });
    }

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      gsap.killTweensOf(prog);
      for (const ch of crosshairs) {
        gsap.killTweensOf(ch.proxy);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
