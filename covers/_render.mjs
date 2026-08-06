// THE RENDER. One place, so it cannot regress again.
//
// WHY THIS EXISTS. On 2026-08-03 the Article 50 post was built with deviceScaleFactor: 1 while
// every other builder in this folder used 2. The output was 1080x1350 against the EAA post's
// 2160x2700 - a quarter of the pixels, with glyph edges antialiased at half the sampling. Sotiris
// spotted it as "the render" before I did. A default living in one module is the fix; a convention
// living in twelve copy-pasted files is what broke.
//
//   import { renderPoster } from './_render.mjs';
//   await renderPoster({ html, out: 'content-assets/x.png' });                 // 2160x2700
//   await renderPoster({ html, out: '...', w: 1080, h: 1080, grain: 0.05 });
//
// SCALE. Everything ships at 2x and is downsampled by the platform, never upsampled by it.
// LinkedIn re-encodes anything it receives, so give it more pixels than it needs and let its
// resampler do the work - that is the difference between crisp type and slightly soft type.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { critique, printCritique } from './_critique.mjs';
import { fontCss } from './_fonts.mjs';

// Faces live in _fonts.mjs - ONE declaration shared by the renderer, the critic and the
// contact sheet. Re-exported here because callers already import fontCss from this module.
export { fontCss, FACES, FONT_DIR, BODY_TYPE } from './_fonts.mjs';

// Finish layer. The design skill calls for grain at 4-8% and it has been skipped on every build so
// far. SVG turbulence, so it costs nothing and scales with the canvas instead of tiling.
const grainCss = (amount) => !amount ? '' : `
  body::after{
    content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:${amount};
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>");
    background-size:300px 300px;mix-blend-mode:overlay;
  }`;

export async function renderPoster({
  html,          // body content, or a full document if it starts with <!doctype
  out,
  w = 1080,
  h = 1350,
  scale = 2,     // NEVER lower this without a reason written down here
  css = '',
  grain = 0,     // 0.04-0.08 is the useful band; 0 for flat vector work
  browser: sharedBrowser = null,
  // THE FLOOR IS ENFORCED HERE, not in a hook, and not by remembering to call it.
  //
  // A Claude Code hook only guards work an agent does inside a session. This guards EVERY path -
  // Sotiris running the script by hand, a cron job, a future session, a different model. The
  // 2026-08-03 lesson was that a convention living in twelve copy-pasted files is a suggestion;
  // the deeper version of that lesson is that a check you have to remember to call is also a
  // suggestion. Deterministic code at the point of production is the only real gate.
  //
  // `force: true` exists for legitimate exceptions (a deliberately minimal cover, a test fixture)
  // and it prints loudly, so an override is always visible in the log rather than silent.
  force = false,
  // Which register's floor to apply - FLOOR (print/desktop) or FLOOR_FEED (mobile feed).
  // Undefined uses the print default, which is the stricter of the two.
  floor = undefined,
  // WRITE A SECOND FILE AT THE SIZE A HUMAN ACTUALLY SEES IT.
  //
  // The deepest failure in this pipeline was never a missing metric - it was that nobody LOOKED at
  // the output. I wrote HTML, Playwright screenshotted it, and the PNG shipped unopened; Sotiris
  // read "NOT REACI" off the image in one second while nine DOM measurements said PASS.
  //
  // So the render now also emits the thumbnail the feed will show. Reviewing a 2160px file at full
  // size flatters it - every render must be looked at BOTH ways, because 11px fine print and a
  // decapitated headline only become obvious at the size the reader gets.
  preview = 360,
}) {
  const doc = html.trim().toLowerCase().startsWith('<!doctype')
    ? html
    : `<!doctype html><html lang="en"><head><meta charset="UTF-8"/><style>
         ${fontCss()}
         *{margin:0;padding:0;box-sizing:border-box}
         body{width:${w}px;height:${h}px;overflow:hidden;
           font-family:'Geist',system-ui,sans-serif;-webkit-font-smoothing:antialiased;
           text-rendering:geometricPrecision}
         ${css}
         ${grainCss(grain)}
       </style></head><body>${html}</body></html>`;

  const browser = sharedBrowser || (await chromium.launch());

  // Gate before a pixel is committed.
  const report = await critique({ html, css, w, h, browser, floor });
  if (!report.pass) {
    printCritique(report);
    if (!force) {
      if (!sharedBrowser) await browser.close();
      throw new Error(
        `RENDER BLOCKED - composition floor failed (${report.failed.map((f) => f[0]).join(', ')}).\n` +
        `  This is the "slide, not a poster" detector. Go back to §3 or §4 of the design protocol.\n` +
        `  Polishing will not fix these. Pass force:true only for a deliberate exception.`);
    }
    console.log('  !! force:true - shipping a composition that FAILED the floor. This is on the record.');
  }

  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  await page.setContent(doc, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(250);

  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  await page.screenshot({ path: path.resolve(out) });
  await page.close();

  // The as-seen thumbnail. Same DOM, re-rasterised at the display width - not a downscale of the
  // big PNG, so the type is hinted the way the platform's resampler would leave it.
  let previewPath = null;
  if (preview) {
    previewPath = path.resolve(out).replace(/\.png$/i, `-at${preview}.png`);
    const pv = await browser.newPage({
      viewport: { width: preview, height: Math.round((h / w) * preview) },
      deviceScaleFactor: 1,
    });
    await pv.setContent(doc.replace(`width:${w}px;height:${h}px`,
      `width:${w}px;height:${h}px;transform:scale(${preview / w});transform-origin:top left`),
      { waitUntil: 'networkidle' });
    await pv.evaluate(async () => { await document.fonts.ready; });
    await pv.waitForTimeout(150);
    await pv.screenshot({ path: previewPath });
    await pv.close();
  }

  if (!sharedBrowser) await browser.close();

  const kb = Math.round(fs.statSync(path.resolve(out)).size / 1024);
  console.log(`${out}  ${w * scale}x${h * scale} (${scale}x, ${kb} KB)${grain ? ` grain ${grain}` : ''}`);
  if (previewPath) console.log(`  NOW LOOK AT BOTH -> ${path.relative(process.cwd(), previewPath)}  (as seen in the feed)`);
  return path.resolve(out);
}
