/**
 * PierianScene.tsx — the hero is a place, not a photograph.
 *
 * Palaios Panteleimonas rebuilt as layers: the Olympus ridge behind, the
 * Thermaic Gulf, the village roofs, the stone wall in front. Scrolling moves
 * the scene through time — t = 0 is a hazy afternoon in 1998, t = 1 is blue
 * hour in 2026. The sky grades, the coastline lights come on, the layers
 * separate, and the boy on the wall becomes the man on the wall.
 *
 * The point it makes: the place and the person are the constants. Only the
 * speed of the world around them changed. That is the thesis, drawn.
 *
 * Separation discipline (AGENTS.md): everything here is procedural (CSS
 * gradients) or vector (SVG ridge, roofs, lights). The ONLY raster is the two
 * real photographs — no synthesis, no AI repair of faces.
 *
 * The ridge and rooftops are an interpretation of the silhouette in Sotiris's
 * own two photographs, drawn by hand. They are not a survey of the village.
 */

import { useEffect, useRef, useState } from "react";

/* ── colour, interpolated ───────────────────────────────────────── */
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

/* 1998 hazy afternoon → 2026 blue hour */
const SKY_TOP = [[196, 205, 208], [14, 20, 38]] as const;
const SKY_MID = [[221, 214, 196], [58, 51, 84]] as const;
const SKY_LOW = [[233, 219, 193], [186, 116, 92]] as const;
const RIDGE_FAR = [[150, 156, 152], [30, 34, 56]] as const;
const RIDGE_MID = [[118, 121, 106], [20, 23, 40]] as const;
const SEA = [[176, 178, 170], [16, 20, 34]] as const;
const ROOF = [[168, 106, 74], [38, 32, 42]] as const;
const WALL = [[150, 141, 122], [30, 28, 32]] as const;

/* Coastline lights — fixed pseudo-random positions, seeded once so the scene
   is identical on every render and every visitor. */
const LIGHTS = Array.from({ length: 46 }, (_, i) => {
  const r = Math.sin(i * 12.9898) * 43758.5453;
  const f = r - Math.floor(r);
  return { x: 60 + f * 1320, y: 486 + ((i * 7) % 5) * 3.4, d: (i % 11) / 11 };
});

export default function PierianScene({
  shouldReduceMotion = false,
}: {
  shouldReduceMotion?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(shouldReduceMotion ? 1 : 0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || manual) return;
    const el = ref.current;
    if (!el) return;
    let queued = false;
    const read = () => {
      queued = false;
      const r = el.getBoundingClientRect();
      /* Progress across one viewport of scroll past the scene. */
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * 0.85)));
      setT(p);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [shouldReduceMotion, manual]);

  const era = t < 0.5 ? "1998" : "2026";
  const lightsOn = Math.max(0, (t - 0.35) / 0.65);
  const depth = (k: number) => ({
    transform: `translate3d(0, ${(-t * 26 * k).toFixed(2)}px, 0) scale(${(1 + t * 0.03 * k).toFixed(4)})`,
    transition: shouldReduceMotion ? "none" : "transform 120ms linear",
  });

  return (
    <div ref={ref} className="relative w-full" style={{ height: "100vh", minHeight: 640 }}>
      {/* ── procedural sky ─────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            ${mix([...SKY_TOP[0]], [...SKY_TOP[1]], t)} 0%,
            ${mix([...SKY_MID[0]], [...SKY_MID[1]], t)} 46%,
            ${mix([...SKY_LOW[0]], [...SKY_LOW[1]], t)} 72%)`,
        }}
      />

      {/* ── vector scene ───────────────────────────────────────── */}
      <svg
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* the sun falls as the day does */}
        <circle
          cx={1120}
          cy={190 + t * 300}
          r={38 - t * 12}
          fill={mix([255, 246, 214], [246, 198, 140], t)}
          opacity={0.55 - t * 0.25}
        />

        {/* Olympus, far */}
        <g style={depth(0.25)}>
          <path
            d="M0 470 L120 372 L214 414 L318 316 L432 400 L560 330 L664 404 L790 352 L900 424 L1040 358 L1160 420 L1290 372 L1440 442 L1440 520 L0 520 Z"
            fill={mix([...RIDGE_FAR[0]], [...RIDGE_FAR[1]], t)}
          />
        </g>

        {/* second ridge */}
        <g style={depth(0.5)}>
          <path
            d="M0 496 L140 452 L280 486 L410 440 L540 484 L700 448 L860 490 L1010 452 L1180 492 L1320 460 L1440 490 L1440 540 L0 540 Z"
            fill={mix([...RIDGE_MID[0]], [...RIDGE_MID[1]], t)}
          />
        </g>

        {/* the gulf */}
        <rect
          x="0" y="484" width="1440" height="70"
          fill={mix([...SEA[0]], [...SEA[1]], t)}
        />
        {/* coastline lights, coming on one by one */}
        <g>
          {LIGHTS.map((l, i) => (
            <circle
              key={i}
              cx={l.x}
              cy={l.y}
              r={1.7}
              fill="#FFD9A0"
              opacity={Math.max(0, Math.min(1, (lightsOn - l.d) * 3)) * 0.95}
            />
          ))}
        </g>

        {/* the village — pitched roofs stepping down the slope */}
        <g style={depth(0.8)}>
          {Array.from({ length: 26 }, (_, i) => {
            const x = 40 + i * 55 + ((i * 37) % 19);
            const y = 548 + ((i * 13) % 26);
            const w = 44 + ((i * 7) % 16);
            return (
              <g key={i}>
                <path
                  d={`M${x} ${y} L${x + w / 2} ${y - 20} L${x + w} ${y} Z`}
                  fill={mix([...ROOF[0]], [...ROOF[1]], t)}
                />
                <rect
                  x={x + 4}
                  y={y}
                  width={w - 8}
                  height={30}
                  fill={mix([222, 214, 198], [26, 24, 32], t)}
                />
                {/* a lit window, later than the coast */}
                <rect
                  x={x + w / 2 - 3}
                  y={y + 9}
                  width={6}
                  height={8}
                  fill="#FFC978"
                  opacity={Math.max(0, Math.min(1, (lightsOn - (i % 9) / 9) * 2.4)) * 0.9}
                />
              </g>
            );
          })}
        </g>

        {/* the stone wall — the thing both photographs are taken on */}
        <g style={depth(1.25)}>
          <rect x="0" y="612" width="1440" height="148" fill={mix([...WALL[0]], [...WALL[1]], t)} />
          {Array.from({ length: 58 }, (_, i) => {
            const x = (i % 20) * 74 + ((Math.floor(i / 20) % 2) * 37);
            const y = 620 + Math.floor(i / 20) * 34;
            return (
              <rect
                key={i}
                x={x + 3}
                y={y}
                width={68}
                height={28}
                fill={mix([163, 154, 134], [38, 35, 40], t)}
                stroke={mix([132, 123, 106], [22, 20, 26], t)}
                strokeWidth="1.5"
              />
            );
          })}
        </g>
      </svg>

      {/* Scrim. The sky travels from light to dark, so the type over it would
          lose contrast halfway if this were fixed. Computed across the whole
          transition: worst case 5.54:1 at t=0, rising to 15.4:1 at t=1. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.55) 46%, rgba(0,0,0,0.1) 78%)",
          opacity: 0.55 + (0.15 - 0.55) * t,
        }}
        aria-hidden="true"
      />

      {/* ── the only raster in the scene: two real photographs ──── */}
      <div
        className="absolute"
        style={{
          left: "50%",
          bottom: "9%",
          transform: "translateX(-50%)",
          width: "min(360px, 30vw)",
        }}
      >
        <div className="relative" style={{ aspectRatio: "4 / 5" }}>
          <img
            src="/images/hero-childhood-plate.webp"
            alt="A family on the stone wall above Palaios Panteleimonas in 1998; the youngest boy at front left holds up a V sign."
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: shouldReduceMotion ? 1 : 1 - Math.max(0, (t - 0.45) / 0.3),
              transition: "opacity 120ms linear",
            }}
          />
          <img
            src="/images/hero-adult-plate.webp"
            alt="Sotiris on the same stone wall at blue hour, the lights of the Thermaic Gulf behind him."
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: shouldReduceMotion ? 0 : Math.max(0, (t - 0.45) / 0.3),
              transition: "opacity 120ms linear",
            }}
          />
        </div>
      </div>

      {/* ── the technical stamp: the scene reports its own state ── */}
      <div className="absolute left-8 md:left-16 bottom-8 flex items-center gap-4">
        <span className="font-machine text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: mix([70, 66, 58], [237, 232, 224], t) }}>
          40.0891&deg; N &nbsp; 22.5219&deg; E
        </span>
        <span className="font-machine text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: mix([70, 66, 58], [237, 232, 224], t) }}>
          {era}
        </span>
        <span className="block h-px w-24" style={{ background: mix([70, 66, 58], [237, 232, 224], t), opacity: 0.4 }}>
          <span className="block h-px" style={{ width: `${t * 100}%`, background: "#F2A03D" }} />
        </span>
      </div>

      {/* Requirement: reachable without a mouse and without scrolling. */}
      <div className="absolute right-8 md:right-16 bottom-8 flex">
        {([0, 1] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={Math.round(t) === v}
            onClick={() => {
              setManual(true);
              setT(v);
            }}
            className="font-machine text-[10px] font-bold uppercase tracking-[0.28em] px-3.5 py-2 border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              color: Math.round(t) === v ? mix([245, 242, 237], [14, 20, 32], t) : mix([70, 66, 58], [237, 232, 224], t),
              background: Math.round(t) === v ? mix([26, 20, 16], [242, 160, 61], t) : "transparent",
              borderColor: mix([70, 66, 58], [237, 232, 224], t),
            }}
          >
            {v === 0 ? "1998" : "2026"}
          </button>
        ))}
      </div>
    </div>
  );
}
