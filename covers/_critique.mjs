// THE MECHANICAL CRITIC — measure a composition before it is rendered.
//
// WHY THIS EXISTS. 2026-08-03: five rounds of the Article 50 post scored 4, 3, 4, 4, 4 from the
// vision model while its prose swung from "the metaphor fails" to "no AI tells, stops the scroll".
// The score stopped discriminating, and I kept iterating against noise. Meanwhile the actual
// defect was visible the moment we finally LOOKED at fifteen real posters side by side:
//
//   what we made was a SLIDE, not a poster.
//   Three words, one caption, safe margins, one weight, nothing overlapping, no density.
//
// That failure is COUNTABLE. Real posters carry a lot of information, at several sizes, with
// things sitting on top of other things and running off the edge. So this file measures those
// properties in the live DOM and fails loudly, deterministically, before a pixel is committed.
// A vision model gives an opinion; this gives a number that means the same thing every time.
//
// It is a FLOOR, not a verdict - exactly like the 8-point rubric. Passing does not make a piece
// good. Failing means it is almost certainly slop, and no amount of polish will save it.
//
//   import { critique } from './_critique.mjs';
//   const report = await critique({ html, css, w: 1080, h: 1350 });
//   if (!report.pass) { /* back to §3 or §4, never to polish */ }

import { chromium } from 'playwright';
// 2026-08-05: the probe document had NO fonts. Every width-dependent check - text collisions, text
// surviving the trim, clipped-by-container - was measured in fallback Times New Roman against a
// render drawn in Geist. Same faces as the renderer now, from the same module.
import { fontCss, BODY_TYPE } from './_fonts.mjs';

// Thresholds derived by counting the Are.na "typographic poster" set (refs/inbox/
// swiss-typographic-poster), not invented. Each one names the reference behaviour it encodes.
// REGISTER-AWARE FLOORS. One global floor was wrong and it took a live critique to expose it:
// the thresholds below were counted off PRINT posters, then applied to a LinkedIn feed image seen
// at ~360px wide. At that scale 15px fine print renders at 5px and cannot be read by anyone - so
// the density rule was actively pushing the design toward something illegible on its own surface.
//
// This is exactly the failure the research predicted: a metric quietly becoming the objective.
// A floor that ignores the surface is not a floor, it is a bias. DESIGN-DNA §3 already said
// "different registers, different floors" - this makes the code agree with the doctrine.
//
//   FLOOR        print / desktop poster. Density is texture; fine print rewards close reading.
//   FLOOR_FEED   mobile feed image. Smallest type must survive a 3x downscale, so ~34px is the
//                real floor (≈11px displayed). Density still required, but carried by fewer,
//                larger units rather than a wall of statute.
export const FLOOR = {
  // #03 EUROPE 2021 carries a full tour schedule - roughly 1800 characters. #08 runs two columns
  // of bibliography. Density IS the texture in real poster work.
  // CALIBRATION NOTE: this started at 180 and the failed poster passed at 193 while still being
  // slop. A floor the failure clears is not a floor. Raised to 600 - still well under the
  // densest references, but it forces real information onto the canvas instead of a caption.
  minChars: 600,
  // Display / subhead / body / micro. The failed version had 3 sizes, all one family and weight.
  minTypeSizes: 4,
  // Real fine print exists on these posters. On a 1080-wide canvas that is ~16px or smaller.
  // Without this, "4 distinct sizes" is satisfied by 4 large sizes and no texture.
  maxSmallestType: 18,
  // #03 sets a 90px title against 11px listings. A shallow ratio means everything shouts equally.
  minSizeRatio: 8,
  // #10 MACY GRAY: display + credits + tiny legal. #12: script + slab + sans + numerals.
  minTypeWeights: 2,
  // #01 type over dots, #04 handwriting over type, #09 halftone over type over form.
  // Nothing in the failed version touched anything else.
  minOverlaps: 1,
  // Set 06: "the title bleeds off both edges instead of sitting complete inside a safe margin".
  minBleeds: 1,
  // THE COMPANION TO minBleeds, AND THE REASON THIS FILE WAS WRONG.
  //
  // 2026-08-04: the A50 poster shipped with "NOT REACHED." set at 200px white-space:nowrap. The
  // line measured 1392px on a 1080px canvas - it ran 382px past the trim and the reader saw
  // "NOT REACI". The floor scored that bleeds:1 and PASSED it. A check that rewards the defect it
  // was meant to catch is worse than no check, because it certifies the failure.
  //
  // The distinction the old rule could not make: a bleed CROPS a word, it does not DESTROY it.
  // Set 06's title runs off the edge and is still read as the word it is. So every element that
  // holds text must keep at least this share of its own area inside the canvas. A few clipped
  // letters pass; losing a third of the word does not.
  minTextVisible: 0.88,
  // Set 03/04 agree: two colours plus black is a full palette. More than five is confetti.
  maxColours: 5,
  // A single element covering most of the canvas is a background, not a composition.
  maxDominance: 0.72,
};

// Mobile feed. Same craft laws, sized for a surface that throws away two thirds of the pixels.
export const FLOOR_FEED = {
  ...FLOOR,
  minChars: 320,        // real content, but carried by fewer and larger units than a print poster
  maxSmallestType: 34,  // ≈11px once LinkedIn scales 1080 down to ~360 - the true legibility floor
  minSizeRatio: 5,      // a 3x downscale compresses apparent hierarchy, so demand less range
  minTextVisible: 0.92, // stricter than print: a thumb-sized image gives no second look
  // THE FLOOR WAS ONE-SIDED, AND AN EXTERNAL REVIEWER FOUND IT BEFORE WE DID.
  // maxSmallestType exists to FORCE fine print onto the canvas. Nothing stopped it going the other
  // way, so the Design Tree post set body at 28px and a credit at 25px - roughly 9px and 8px once
  // a 1080 image is shown at 360. The reviewer's words: "turns to mush: the bottom grey paragraph
  // and the GitHub URL." Correct. A rule with only a ceiling is half a rule.
  minSmallestType: 30,  // ≈10px displayed - below this nobody reads it, so it is decoration
};

// Playwright allows exactly one argument to page.evaluate - extra args must be wrapped.
const PROBE = ({ w, h }) => {
  const els = Array.from(document.querySelectorAll('body *'))
    .filter((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none';
    });

  const sizes = new Set(), weights = new Set(), families = new Set(), colours = new Set();
  let chars = 0;
  const boxes = [];
  // Text elements are tracked separately: legibility rules apply to type, not to rules and bars.
  const texts = [];

  for (const el of els) {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    // Only count typography on elements that actually hold their own text.
    const own = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('');
    if (own.length) {
      chars += own.length;
      sizes.add(Math.round(parseFloat(s.fontSize)));
      weights.add(s.fontWeight);
      families.add(s.fontFamily.split(',')[0].replace(/["']/g, '').trim());
      colours.add(s.color);

      // How much of this line actually survives inside the canvas.
      const vx = Math.max(0, Math.min(r.x + r.width, w) - Math.max(r.x, 0));
      const vy = Math.max(0, Math.min(r.y + r.height, h) - Math.max(r.y, 0));
      const area = Math.max(1, r.width * r.height);
      // Clipped by its OWN container (fixed width + overflow hidden) rather than by the trim.
      const clipped = el.scrollWidth > el.clientWidth + 2 && s.overflow !== 'visible';
      texts.push({
        text: own.slice(0, 40),
        size: Math.round(parseFloat(s.fontSize)),
        visible: Math.round(((vx * vy) / area) * 100) / 100,
        clipped,
        x: r.x, y: r.y, w: r.width, h: r.height, area,
      });
    }
    const bg = s.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') colours.add(bg);
    boxes.push({ x: r.x, y: r.y, w: r.width, h: r.height, area: r.width * r.height });
  }

  // Overlap = two boxes genuinely intersecting, ignoring pure containment (a child inside its
  // parent is not a design decision, it is the box model).
  let overlaps = 0;
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
      const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
      if (ix <= 0 || iy <= 0) continue;
      const inter = ix * iy;
      const contained = inter > 0.985 * Math.min(a.area, b.area);
      if (!contained && inter > 0.02 * Math.min(a.area, b.area)) overlaps++;
    }
  }

  // Bleed = an element crossing a canvas trim. This is what "cropped type reads confident" means
  // in measurable terms.
  const bleeds = boxes.filter((b) =>
    b.x < -2 || b.y < -2 || b.x + b.w > w + 2 || b.y + b.h > h + 2).length;

  // Dominance ignores full-canvas elements: a wrapper at inset:0 is the GROUND, not a shape
  // someone composed. Without this exclusion every layout scores 1.00 and the check is dead.
  const canvas = w * h;
  const composed = boxes.filter((b) => Math.min(b.area, canvas) < 0.98 * canvas);
  const dominance = composed.length
    ? Math.max(...composed.map((b) => Math.min(b.area, canvas))) / canvas : 0;

  // TEXT ON TEXT. The overlap rule above REWARDS things sitting on each other, because safe zones
  // read as a template - but it never distinguished type over a SHAPE (a design decision) from
  // type over TYPE (two blocks colliding into mush). Both Design Tree candidates cleared the floor
  // on 2026-08-04 with the headline sitting through the body copy, unreadable. Same failure shape
  // as the bleed that ate the word: a metric that was almost the thing we meant.
  const collisions = [];
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j];
      const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
      const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
      if (ix <= 0 || iy <= 0) continue;
      const inter = ix * iy;
      // Containment is the box model, not a collision: a <b> inside a paragraph is nested, not
      // colliding. Only genuine partial intersection counts.
      if (inter > 0.985 * Math.min(a.area, b.area)) continue;
      if (inter > 0.02 * Math.min(a.area, b.area)) {
        collisions.push(`"${a.text.slice(0, 22)}" x "${b.text.slice(0, 22)}"`);
      }
    }
  }

  const sorted = [...sizes].sort((a, b) => b - a);
  // The worst-offending line, reported by name so the failure is actionable rather than a number.
  const worstText = texts.length
    ? texts.reduce((a, b) => (b.visible < a.visible ? b : a)) : null;
  return {
    chars,
    worstText,
    clippedText: texts.filter((t) => t.clipped),
    collisions,
    minTextVisible: worstText ? worstText.visible : 1,
    sizeRatio: sorted.length ? Math.round((sorted[0] / sorted[sorted.length - 1]) * 10) / 10 : 0,
    typeSizes: sorted,
    typeWeights: [...weights],
    families: [...families],
    colours: [...colours],
    overlaps,
    bleeds,
    dominance: Math.round(dominance * 100) / 100,
    elements: boxes.length,
  };
};

export async function critique({ html, css = '', w = 1080, h = 1350, floor = FLOOR, browser: shared = null }) {
  const doc = html.trim().toLowerCase().startsWith('<!doctype') ? html
    : `<!doctype html><html><head><meta charset="UTF-8"/><style>
         ${fontCss()}
         *{margin:0;padding:0;box-sizing:border-box}
         body{width:${w}px;height:${h}px;overflow:hidden;${BODY_TYPE}}${css}
       </style></head><body>${html}</body></html>`;

  const browser = shared || (await chromium.launch());
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(doc, { waitUntil: 'domcontentloaded' });
  // Embedding the faces is not enough - measure before they load and every width is still wrong.
  await page.evaluate(async () => { await document.fonts.ready; });
  const m = await page.evaluate(PROBE, { w, h });
  await page.close();
  if (!shared) await browser.close();

  const checks = [
    ['information density', m.chars, floor.minChars, m.chars >= floor.minChars,
      'Real posters carry a lot of copy set small. Three words and a caption is a slide.'],
    ['distinct type sizes', m.typeSizes.length, floor.minTypeSizes, m.typeSizes.length >= floor.minTypeSizes,
      'Display, subhead, body, micro. One size stepped three times is not hierarchy.'],
    ['distinct type weights', m.typeWeights.length, floor.minTypeWeights, m.typeWeights.length >= floor.minTypeWeights,
      'A single weight throughout is the clearest generated-design tell there is.'],
    ['overlapping elements', m.overlaps, floor.minOverlaps, m.overlaps >= floor.minOverlaps,
      'Everything in its own safe zone reads as a template. Let things sit on each other.'],
    ['bleeding elements', m.bleeds, floor.minBleeds, m.bleeds >= floor.minBleeds,
      'Cropped type reads confident; complete type inside safe margins reads like a slide.'],
    // Runs immediately after the bleed check on purpose - it is the guard rail on that reward.
    ['text survives the trim',
      m.worstText ? `${m.minTextVisible} "${m.worstText.text}"` : 'n/a',
      `>= ${floor.minTextVisible}`,
      m.minTextVisible >= floor.minTextVisible,
      'A bleed CROPS a word; this DESTROYS it. The reader cannot finish the line. Shrink the type, '
      + 'shorten the line, or set it on two lines - do not let it run off into nothing.'],
    ['text clipped by its container', m.clippedText.length, 0, m.clippedText.length === 0,
      'A fixed-width box with overflow hidden is eating this text. Nobody chose that; it is a bug.'],
    ['text colliding with text', m.collisions.length ? m.collisions[0] : 0, 0, m.collisions.length === 0,
      'Type over a SHAPE is a decision. Type over TYPE is mush. Overlap earns its keep against '
      + 'images, rules and fields - never against another block of copy.'],
    ['smallest type size', m.typeSizes[m.typeSizes.length - 1] ?? 999, `<= ${floor.maxSmallestType}`,
      (m.typeSizes[m.typeSizes.length - 1] ?? 999) <= floor.maxSmallestType,
      'No fine print means no texture. Real posters set listings, credits and legal copy small.'],
    ['smallest type legible', m.typeSizes[m.typeSizes.length - 1] ?? 0,
      floor.minSmallestType ? `>= ${floor.minSmallestType}` : 'n/a',
      !floor.minSmallestType || (m.typeSizes[m.typeSizes.length - 1] ?? 0) >= floor.minSmallestType,
      'Fine print must be readable on the surface it ships to. Below this it is texture pretending '
      + 'to be information - which is worse than leaving it out.'],
    ['size ratio (max:min)', m.sizeRatio, `>= ${floor.minSizeRatio}`, m.sizeRatio >= floor.minSizeRatio,
      'A shallow ratio means everything shouts equally, which reads as a slide.'],
    ['colour count', m.colours.length, `<= ${floor.maxColours}`, m.colours.length <= floor.maxColours,
      'Two colours plus black is a full palette when the forms are strong.'],
    ['largest element share', m.dominance, `<= ${floor.maxDominance}`, m.dominance <= floor.maxDominance,
      'One shape covering the canvas is a background, not a composition.'],
  ];

  const failed = checks.filter((c) => !c[3]);
  return { pass: failed.length === 0, metrics: m, checks, failed };
}

export function printCritique(report) {
  console.log('\nMECHANICAL CRITIQUE  (floor, not verdict)');
  console.log('='.repeat(64));
  for (const [name, got, want, ok, why] of report.checks) {
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(24)} ${String(got).padEnd(14)} want ${want}`);
    if (!ok) console.log(`        ^ ${why}`);
  }
  const m = report.metrics;
  console.log('-'.repeat(64));
  console.log(`  sizes ${m.typeSizes.join('/')} · weights ${m.typeWeights.join('/')} · ${m.families.join(', ')}`);
  console.log(`  ${m.elements} elements · ${m.chars} chars · ${m.overlaps} overlaps · ${m.bleeds} bleeds`);
  if (m.worstText && m.minTextVisible < 1) {
    console.log(`  most-cropped line: "${m.worstText.text}" @${m.worstText.size}px — ${Math.round(m.minTextVisible * 100)}% inside the canvas`);
  }
  console.log(report.pass
    ? '\n  FLOOR CLEARED. This is not automatically good - now judge it.'
    : `\n  ${report.failed.length} FAILED. Back to §3 or §4. Polishing will not fix these.`);
  return report.pass;
}
