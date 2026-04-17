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
 *
 * Architecture note: the canvas fills with a #0D1117→#0F0A1F gradient each
 * frame so it acts as the page's background layer, not a transparent overlay.
 * Grid lines are always visible regardless of what page elements do with their
 * own backgrounds.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

// ── Constants ────────────────────────────────────────────────────────────────

const COLS = 12;
const ROWS = 8;

// Extra rows above/below viewport prevent blank edges during parallax scroll.
// 10 rows above covers ~10 × (vh/8) / 0.15 ≈ 8 viewport heights of scroll.
const EXTRA_ABOVE = 10;
const EXTRA_BELOW = 2;

const CROSSHAIR_DEFS = [
  { cf: 3 / COLS,  rf: 2 / ROWS },   // hero — left
  { cf: 9 / COLS,  rf: 2 / ROWS },   // hero — right
  { cf: 2 / COLS,  rf: 5 / ROWS },   // work / process zone
  { cf: 10 / COLS, rf: 7 / ROWS },   // contact zone
] as const;

const PROXIMITY_RADIUS = 120; // px — cursor distance to activate
const ARM_BASE = 8;           // px — crosshair arm at scale 1
const ACTIVE_SCALE = 1.6;

// ── Color helper ─────────────────────────────────────────────────────────────

// t=0 → #C0BAB3 (warm neutral grey)   t=1 → #F26C0D (orange)
function lerpColor(t: number): string {
  const r = Math.round(0xC0 + (0xf2 - 0xC0) * t);
  const g = Math.round(0xBA + (0x6c - 0xBA) * t);
  const b = Math.round(0xB3 + (0x0d - 0xB3) * t);
  return `rgb(${r},${g},${b})`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function EthicsGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Non-null assertion: getContext("2d") always succeeds on a real canvas element.
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Mutable state — mutated by GSAP / events, read each rAF tick ─────────
    const prog = { h: reduced ? 1 : 0, v: reduced ? 1 : 0 };
    let scrollY = 0;
    let cellW = 0;
    let cellH = 0;
    let rafId = 0;

    // ── Per-crosshair animated proxies ───────────────────────────────────────
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
        ch.quickColor = gsap.quickTo(ch.proxy, "color", { duration: 0.4, ease: "power2.out" });
        ch.quickScale = gsap.quickTo(ch.proxy, "scale", { duration: 0.25, ease: "power2.out" });
      }
    }

    // ── Arrow functions inherit the narrowed canvas / ctx from the closure ────

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      cellW = W / COLS;
      cellH = H / ROWS;
    };

    const draw = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const parallaxY = -scrollY * 0.15;

      ctx.save();
      ctx.scale(dpr, dpr); // logical (CSS) pixel space

      // ── Background ────────────────────────────────────────────────────────
      // Radial depth: slightly warmer at the optical centre (where the eye
      // rests on the hero), cooler at the edges — warm parchment light-mode.
      const bg = ctx.createRadialGradient(W / 2, H * 0.38, 0, W / 2, H * 0.38, Math.max(W, H) * 0.9);
      bg.addColorStop(0, "#F0ECE6"); // warm centre
      bg.addColorStop(1, "#F5F2ED"); // cool-light edges
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.translate(0, parallaxY); // scroll parallax (applied after bg fill)

      // ── Grid lines ────────────────────────────────────────────────────────
      ctx.strokeStyle = "rgba(26,20,16,0.07)"; // subtle dark lines on light
      ctx.lineWidth = 1;

      // Horizontal — wipe left→right via prog.h
      const hRight = W * prog.h;
      for (let r = -EXTRA_ABOVE; r <= ROWS + EXTRA_BELOW; r++) {
        const y = r * cellH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(hRight, y);
        ctx.stroke();
      }

      // Vertical — wipe top→bottom via prog.v
      const yTop   = -EXTRA_ABOVE * cellH;
      const totalH = (ROWS + EXTRA_ABOVE + EXTRA_BELOW) * cellH;
      for (let c = 0; c <= COLS; c++) {
        const x = c * cellW;
        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yTop + totalH * prog.v);
        ctx.stroke();
      }

      // ── Crosshairs ────────────────────────────────────────────────────────
      for (const ch of crosshairs) {
        const x   = ch.cf * W;
        const y   = ch.rf * H;
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
    };

    const onScroll = () => {
      scrollY = Math.max(0, window.scrollY);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (reduced) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const parallaxY = -scrollY * 0.15;

      const ranked = crosshairs
        .map((ch) => {
          const cx = ch.cf * W;
          const cy = ch.rf * H + parallaxY; // screen-space y of crosshair
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
    };

    // ── Bootstrap ─────────────────────────────────────────────────────────────
    resize();
    draw();

    window.addEventListener("resize",    resize);
    window.addEventListener("scroll",    onScroll,    { passive: true });
    window.addEventListener("mousemove", onMouseMove);

    if (!reduced) {
      gsap.to(prog, { h: 1, duration: 1.2, ease: "power3.out", delay: 0.2  });
      gsap.to(prog, { v: 1, duration: 1.2, ease: "power3.out", delay: 0.35 });
    }

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      gsap.killTweensOf(prog);
      for (const ch of crosshairs) gsap.killTweensOf(ch.proxy);
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
