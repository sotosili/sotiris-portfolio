/**
 * TimeTravel.tsx — the Pierian time-travel hero.
 *
 * One place, two moments. Now: blue hour above the Pieria coast. Then: the same
 * stone wall in 1998, with the small one flashing a V at the camera.
 *
 * The five hard requirements come straight from ops/HERO-BRIEF-2026-08-29.md and
 * are built in here rather than reviewed afterwards:
 *   1. Real photography, treatment only — no synthesis, no inpainting.
 *   2. prefers-reduced-motion renders both plates composed, side by side, static.
 *   3. Hover does not exist on touch, so a tap toggle does the same job.
 *   4. A real focusable control, never mouse-only.
 *   5. The V-sign story is a button with aria-expanded, not a hover tooltip.
 *
 * Note: the era swap is React state, not an animated tween, so it works even
 * where requestAnimationFrame is throttled.
 */

import { useState } from "react";

type Era = "now" | "then";

const PLATES: Record<Era, { webp: string; jpg: string; alt: string; stamp: string }> = {
  now: {
    webp: "/images/hero-adult-plate.webp",
    jpg: "/images/hero-adult-plate.jpg",
    alt: "Sotiris sitting on a stone wall at blue hour, the lights of the Pieria coastline and the Thermaic Gulf spread out behind him.",
    stamp: "Pieria · blue hour · 2026",
  },
  then: {
    webp: "/images/hero-childhood-plate.webp",
    jpg: "/images/hero-childhood-plate.jpg",
    alt: "A family on the same stone wall above Palaios Panteleimonas in 1998; four children and an adult, with the youngest boy at front left holding up a V sign toward the camera.",
    stamp: "Palaios Panteleimonas · 1998",
  },
};

export default function TimeTravel({
  shouldReduceMotion = false,
}: {
  shouldReduceMotion?: boolean;
}) {
  const [era, setEra] = useState<Era>("now");
  const [story, setStory] = useState(false);
  const then = era === "then";

  /* Requirement 2 — the static composed version. Both moments are simply shown,
     the story is still reachable, and nothing moves. */
  if (shouldReduceMotion) {
    return (
      <div className="animate-photo w-full h-full flex flex-col justify-center gap-3 p-6">
        <div className="grid grid-cols-2 gap-3">
          {(["now", "then"] as Era[]).map((k) => (
            <figure key={k} className="m-0">
              <picture>
                <source srcSet={PLATES[k].webp} type="image/webp" />
                <img
                  src={PLATES[k].jpg}
                  alt={PLATES[k].alt}
                  className="hero-photo-img block w-full h-auto"
                />
              </picture>
              <figcaption className="mt-2 font-machine text-[9px] font-bold uppercase tracking-[0.28em] text-[#6B6560]">
                {PLATES[k].stamp}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="max-w-[420px] font-geist text-[13px] leading-relaxed text-[#6B6560]">
          Same wall, twenty-eight years apart. The small one at front left is me,
          holding up a V at a camera I had no reason to trust yet.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-photo relative w-full h-full flex items-center justify-center p-6">
      <div
        className="relative w-fit max-w-full mx-auto"
        /* Requirement 3 — hover is an enhancement on pointer devices only.
           Everything it does, the toggle below also does. */
        onMouseEnter={() => setEra("then")}
        onMouseLeave={() => {
          setEra("now");
          setStory(false);
        }}
      >
        {/* Crop marks, as on a press sheet */}
        <span className="crop-mark absolute -top-3 -left-3" aria-hidden="true" />
        <span
          className="crop-mark absolute -bottom-3 -right-3"
          style={{ transform: "rotate(180deg)" }}
          aria-hidden="true"
        />

        <div className="relative overflow-hidden bg-[#EDE9E3]">
          <picture>
            <source srcSet={PLATES[era].webp} type="image/webp" />
            <img
              src={PLATES[era].jpg}
              alt={PLATES[era].alt}
              className="hero-photo-img block w-auto max-w-full max-h-[64vh] h-auto"
              style={{ transition: "opacity 220ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </picture>

          {/* Requirement 5 — the V is a button, not a hover target. */}
          {then && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setStory((s) => !s);
                }}
                aria-expanded={story}
                aria-controls="v-sign-story"
                className="absolute w-6 h-6 border-2 border-[#F5F2ED] bg-[#1A1410] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26C0D]"
                style={{ left: "32.5%", top: "39.5%" }}
              >
                <span className="sr-only">
                  The V sign, 1998 — read the story behind it
                </span>
              </button>

              {story && (
                <div
                  id="v-sign-story"
                  className="absolute left-4 right-4 bottom-4 bg-[#F5F2ED] border border-[#1A1410] p-4"
                >
                  <p className="font-machine text-[9px] font-bold uppercase tracking-[0.28em] text-[#6B6560] mb-2">
                    The V sign · 1998
                  </p>
                  <p className="m-0 font-geist text-[13px] leading-[1.55] text-[#1A1410]">
                    Churchill borrowed it for victory; a Greek kid on a mountain wall
                    borrowed it back for the sheer fun of aiming something at a camera.
                    The playful defiance stayed. It is still what decides which briefs
                    I turn down.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Requirement 4 — the control. Real buttons, keyboard reachable, and it
            does exactly what the hover does. */}
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex" role="group" aria-label="Choose which moment to show">
            {(["now", "then"] as Era[]).map((k) => {
              const active = era === k;
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setEra(k);
                    if (k === "now") setStory(false);
                  }}
                  className={`font-machine text-[9px] font-bold uppercase tracking-[0.28em] px-3.5 py-2 border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1410] ${
                    active
                      ? "bg-[#1A1410] text-[#F5F2ED] border-[#1A1410]"
                      : "bg-transparent text-[#6B6560] border-[#1A1410]/25 hover:text-[#1A1410]"
                  }`}
                >
                  {k === "now" ? "2026" : "1998"}
                </button>
              );
            })}
          </div>
          <span className="font-machine text-[9px] font-bold uppercase tracking-[0.28em] text-[#6B6560]">
            {PLATES[era].stamp}
          </span>
        </div>
      </div>
    </div>
  );
}
