// §3 DIVERGE — the contact sheet. One render pass, 8-12 concepts, one image to judge.
//
// The point: each thumbnail is the REAL design at full canvas size, CSS-scaled down. So a
// survivor promotes to full size with zero rework - you change the scale, not the artwork.
// Twelve separate full renders would cost twelve passes and twelve chances to fall in love
// with the first one. This costs one pass and makes killing cheap.
//
// Usage from a build script:
//   import { contactSheet } from './_contact-sheet.mjs';
//   await contactSheet({
//     out: 'content-assets/sheet-banner.png',
//     canvas: { w: 1584, h: 396 },
//     css: SHARED_CSS,                       // fonts + tokens, shared by every concept
//     concepts: [ { name: 'FOCUS', html: '<div>…</div>' }, … ]
//   });
//
// Run directly (`node covers/_contact-sheet.mjs`) to render a self-test sheet and confirm
// the machinery works before wiring it into a real brief.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// 2026-08-04: was four CDN <link> tags. The Design Tree diverge sheet rendered every concept in a
// fallback SERIF - Geist 900 and Archivo Narrow simply were not in those stylesheets, and nothing
// in the log said so. _render.mjs had already been fixed to embed local faces for exactly this
// reason ("a CDN link is a silent failure mode"); this file was never updated, so §3 was judging
// the wrong typography while §4 rendered the right one. Same source of truth now.
import { fontCss } from './_render.mjs';

export async function contactSheet({ out, canvas, css = '', concepts, thumbWidth = 380, cols = 3 }) {
  const scale = thumbWidth / canvas.w;
  const thumbHeight = Math.round(canvas.h * scale);

  const cells = concepts.map((c, i) => `
    <figure class="cell">
      <div class="stage"><div class="canvas">${c.html}</div></div>
      <figcaption><b>${String(i + 1).padStart(2, '0')}</b> ${c.name}</figcaption>
    </figure>`).join('');

  const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><style>
    ${fontCss()}
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#E7E3DC; font-family:'Geist',sans-serif; padding:48px; }
    .grid { display:grid; grid-template-columns:repeat(${cols}, ${thumbWidth}px); gap:44px 36px; justify-content:center; }
    .cell { display:flex; flex-direction:column; gap:11px; }
    /* the thumbnail is the real canvas, scaled - not a redrawn miniature */
    .stage { width:${thumbWidth}px; height:${thumbHeight}px; overflow:hidden; box-shadow:0 1px 0 rgba(26,20,16,.18); }
    .canvas { width:${canvas.w}px; height:${canvas.h}px; transform:scale(${scale}); transform-origin:0 0; position:relative; overflow:hidden; }
    figcaption { font-size:12px; letter-spacing:0.2em; text-transform:uppercase; color:#6B6560; font-weight:600; }
    figcaption b { color:#C85A0C; margin-right:6px; }
    ${css}
  </style></head><body><div class="grid">${cells}</div></body></html>`;

  const rows = Math.ceil(concepts.length / cols);
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: cols * thumbWidth + (cols - 1) * 36 + 96, height: rows * (thumbHeight + 34) + (rows - 1) * 44 + 96 },
    deviceScaleFactor: 2,
  });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(300);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  await page.screenshot({ path: path.resolve(out), fullPage: true });
  await browser.close();
  console.log(`contact sheet: ${concepts.length} concepts ->`, path.resolve(out));
}

// self-test (pathToFileURL, not string concat - Windows paths are file:///C:/… with three slashes)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const words = ['FOCUS', 'REDACT', 'WASH', 'BLEED', 'STACK', 'CROP', 'GRID', 'VOID'];
  await contactSheet({
    out: 'content-assets/_contact-sheet-selftest.png',
    canvas: { w: 1584, h: 396 },
    css: `.t { position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
           background:#F5F2ED; font-family:'Playfair Display',serif; font-size:96px; color:#1A1410; }`,
    concepts: words.map((w) => ({ name: w, html: `<div class="t">${w}</div>` })),
  });
}
