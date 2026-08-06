// The ONE place the brand faces are declared and embedded.
//
// 2026-08-05: extracted from _render.mjs because _critique.mjs was building its probe document with
// no @font-face and no body font-family at all - so the floor measured every layout in fallback
// Times New Roman while the renderer drew it in Geist. Text widths differ, which means the
// text-collision, text-survives-the-trim and clipped-by-container checks were all answering a
// question about a document that was never rendered. _contact-sheet.mjs had already been fixed for
// the same class of bug (CDN <link> instead of embedded faces) on 2026-08-04; this file exists so
// there is no fourth copy to forget.
//
// A CDN <link> is a silent failure mode: if the network is slow the screenshot fires against a
// fallback serif and nothing in the log says so. Always embed, always from disk.
//
// Archivo Narrow is a real drawn condensed grotesque - NEVER fake a condensed face with negative
// letter-spacing again, it is visible to a trained eye. Bricolage Grotesque brings a genuinely
// compressed axis with ink traps. Both SIL OFL, commercial use permitted.
import fs from 'node:fs';
import path from 'node:path';

export const FONT_DIR = 'artifacts/fonts';

export const FACES = [
  ['Geist', 'geist-sans-latin-400-normal.woff2', 400, 'normal'],
  ['Geist', 'geist-sans-latin-600-normal.woff2', 600, 'normal'],
  ['Geist', 'geist-sans-latin-700-normal.woff2', 700, 'normal'],
  ['Geist', 'geist-sans-latin-900-normal.woff2', 900, 'normal'],
  ['Playfair Display', 'playfair-display-latin-600-normal.woff2', 600, 'normal'],
  ['Playfair Display', 'playfair-display-latin-600-italic.woff2', 600, 'italic'],
  ['Archivo Narrow', 'archivo-narrow-latin-400-normal.woff2', 400, 'normal'],
  ['Archivo Narrow', 'archivo-narrow-latin-600-normal.woff2', 600, 'normal'],
  ['Archivo Narrow', 'archivo-narrow-latin-700-normal.woff2', 700, 'normal'],
  ['Bricolage Grotesque', 'bricolage-grotesque-latin-400-normal.woff2', 400, 'normal'],
  ['Bricolage Grotesque', 'bricolage-grotesque-latin-800-normal.woff2', 800, 'normal'],
];

export const fontCss = () =>
  FACES.filter(([, f]) => fs.existsSync(path.join(FONT_DIR, f)))
    .map(([fam, file, wt, style]) => {
      const b64 = fs.readFileSync(path.join(FONT_DIR, file)).toString('base64');
      return `@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${b64}) format('woff2');font-weight:${wt};font-style:${style};font-display:block}`;
    })
    .join('');

// The default body typography every surface must share, or the floor measures a document the
// renderer never draws.
export const BODY_TYPE =
  `font-family:'Geist',system-ui,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision`;
