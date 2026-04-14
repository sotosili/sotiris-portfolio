/**
 * Cursor.tsx — Custom GSAP-powered cursor
 *
 * A 6px orange dot that follows the pointer with quickTo easing.
 * Scales 3× when hovering over interactive elements (a, button, [role="button"], label).
 * Hidden on touch devices via (pointer: coarse) media query.
 * Replaces the system cursor on pointer-capable devices.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch-only devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (!dotRef.current) return;

    const dot = dotRef.current;

    // Hide system cursor
    document.documentElement.style.cursor = "none";

    // Center the dot on the pointer position
    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 });

    const moveX = gsap.quickTo(dot, "x", { duration: 0.2, ease: "power3.out" });
    const moveY = gsap.quickTo(dot, "y", { duration: 0.2, ease: "power3.out" });

    // Appear on first move so dot doesn't start at (0, 0)
    let visible = false;

    function onMove(e: MouseEvent) {
      if (!visible) {
        gsap.to(dot, { opacity: 1, duration: 0.2, ease: "power2.out" });
        visible = true;
      }
      moveX(e.clientX);
      moveY(e.clientY);
    }

    // Interactive element selectors
    const INTERACTIVE = "a, button, [role='button'], label, input, textarea, select, [tabindex]";

    function onOver(e: MouseEvent) {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        gsap.to(dot, { scale: 3, duration: 0.25, ease: "power2.out" });
      }
    }

    function onOut(e: MouseEvent) {
      if ((e.target as Element)?.closest(INTERACTIVE)) {
        gsap.to(dot, { scale: 1, duration: 0.25, ease: "power2.out" });
      }
    }

    function onLeave() {
      gsap.to(dot, { opacity: 0, duration: 0.2, ease: "power2.in" });
      visible = false;
    }

    function onEnter() {
      if (visible) {
        gsap.to(dot, { opacity: 1, duration: 0.2, ease: "power2.out" });
      }
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: "#F26C0D",
        pointerEvents: "none",
        zIndex: 999998,
        willChange: "transform",
      }}
    />
  );
}
