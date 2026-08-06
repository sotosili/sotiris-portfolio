// THE COLUMN GRID — so type is placed, not guessed.
//
// WHY THIS EXISTS. 2026-08-04. Sotiris put a wall of Swiss typographic references on the table and
// the difference was structural, not decorative: every one of them is built on a visible column
// grid, and several of them literally SHOW it (the Zürich 1963 Stadttheater poster, the "Grid
// System" sheet, the adidas modular studies). Our builders placed every element with a hand-typed
// `left:70px; top:346px`. Nothing measured anything, so nothing could object when "NOT REACHED."
// came out 1392px wide on a 1080px canvas and the reader saw "NOT REACI".
//
// A grid is not a style. It is the thing that makes overflow IMPOSSIBLE instead of merely
// detectable. _critique.mjs catches the failure after the fact; this prevents it.
//
//   import { makeGrid, fitText } from './_grid.mjs';
//   const g = makeGrid({ w: 1080, h: 1350, cols: 6 });
//   g.col(0, 4)            -> { left, width } spanning columns 1-4
//   await fitText({ ... }) -> the largest font-size that actually fits that width
//   g.overlay()            -> render the grid itself, to check the composition sits on it

import { chromium } from 'playwright';
import { fontCss } from './_render.mjs';

// Müller-Brockmann's Grid Systems works in 4/6/8/12 fields. Six is the useful default for a
// poster: it divides into halves, thirds and pairs without fractional columns.
export function makeGrid({ w = 1080, h = 1350, cols = 6, margin = 76, gutter = 24, baseline = 36 }) {
  const inner = w - margin * 2;
  const colW = (inner - gutter * (cols - 1)) / cols;

  // Columns are ZERO-INDEXED and spans are inclusive of the gutters they cross - a headline
  // spanning 4 columns gets 4 column widths PLUS the 3 gutters between them, which is what makes
  // wide type sit flush with the narrow text beneath it.
  const col = (start, span = 1) => ({
    left: Math.round(margin + start * (colW + gutter)),
    width: Math.round(span * colW + (span - 1) * gutter),
  });

  // Vertical rhythm. Everything lands on a baseline multiple, so unrelated blocks still align.
  const row = (n) => Math.round(margin + n * baseline);

  const css = `
    .g-field{position:absolute;top:0;left:0;width:${w}px;height:${h}px}
    .g-col{position:absolute}
  `;

  // The grid made visible. Not decoration - this is how you check the composition actually SITS on
  // the structure rather than near it. Render once, look, then turn it off.
  const overlay = (colour = 'rgba(255,60,60,.38)') => {
    const lines = [];
    for (let i = 0; i < cols; i++) {
      const c = col(i);
      lines.push(`<div style="position:absolute;left:${c.left}px;top:0;width:${c.width}px;height:${h}px;background:${colour}"></div>`);
    }
    for (let y = margin; y < h - margin; y += baseline) {
      lines.push(`<div style="position:absolute;left:0;top:${y}px;width:${w}px;height:1px;background:${colour}"></div>`);
    }
    return `<div style="position:absolute;inset:0;pointer-events:none;z-index:9998">${lines.join('')}</div>`;
  };

  return { w, h, cols, margin, gutter, baseline, colW: Math.round(colW), col, row, css, overlay };
}

// MEASURE BEFORE YOU COMMIT.
//
// Returns the largest integer font-size at which `text` fits inside `maxWidth` for a real, loaded
// face - measured in the same browser that will render it, not estimated. This is the authoring-
// time counterpart to the "text survives the trim" floor: the floor tells you afterwards that you
// destroyed the word; this stops you choosing the size that would.
//
// Binary search over the size range, because a linear walk from 200px down costs 150 layouts.
export async function fitText({
  text,
  family = 'Geist',
  weight = 900,
  tracking = '-.05em',
  maxWidth,
  max = 400,
  min = 8,
  browser: shared = null,
}) {
  const browser = shared || (await chromium.launch());
  const page = await browser.newPage({ viewport: { width: 2000, height: 600 } });
  await page.setContent(
    `<!doctype html><meta charset="utf-8"><style>${fontCss()}
     body{margin:0}
     #m{position:absolute;white-space:nowrap;font-family:'${family}';font-weight:${weight};letter-spacing:${tracking}}
     </style><span id="m"></span>`,
    { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => { await document.fonts.ready; });

  const width = (size) => page.evaluate(([t, s]) => {
    const el = document.getElementById('m');
    el.textContent = t;
    el.style.fontSize = s + 'px';
    return el.getBoundingClientRect().width;
  }, [text, size]);

  let lo = min, hi = max, best = min;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (await width(mid) <= maxWidth) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
  }
  const finalWidth = await width(best);

  await page.close();
  if (!shared) await browser.close();
  return { size: best, width: Math.round(finalWidth), maxWidth, text };
}
