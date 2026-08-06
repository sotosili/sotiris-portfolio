// THE COHERENCE GATE. Runs AFTER the floor, and asks the one question the floor cannot:
// does everything on this canvas belong to the same system?
//
// The floor counts inventory - how many sizes, how many colours, how many overlaps. Every one of
// its checks can pass on a poster whose parts were each designed separately. This gate checks
// RELATIONSHIPS instead: is every size on one scale, every gap a multiple of one unit, every
// stroke one weight, every colour a declared ink, every face doing a declared job.
//
// Same discipline as _critique.mjs: it REJECTS THE BOTTOM. It cannot tell you the work is good -
// a perfectly systematic poster can still be dull. It can only tell you the work is one thing
// rather than five things in a frame. Never tune a composition to raise a coherence number.
import { chromium } from 'playwright';
import { fontCss, BODY_TYPE } from './_fonts.mjs';
import { SCALE, UNIT, INK, STROKE, RADIUS, FACES } from './_system.mjs';

const hex = (rgb) => {
  const m = rgb.match(/\d+/g);
  if (!m) return rgb;
  return '#' + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase();
};

const PROBE = ({ scale, unit, inks, stroke, radius, families }) => {
  const els = Array.from(document.querySelectorAll('body *')).filter((el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 1 && r.height > 1 && s.visibility !== 'hidden' && s.display !== 'none';
  });

  const offScale = [], offGrid = [], offInk = [], offStroke = [], offRadius = [], offFace = [];
  const seenFaces = new Set();
  let measuredSizes = 0, measuredGaps = 0, measuredColours = 0;

  for (const el of els) {
    const s = getComputedStyle(el);
    const own = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('');

    if (own.length) {
      const size = Math.round(parseFloat(s.fontSize));
      measuredSizes++;
      if (!scale.includes(size)) offScale.push(`${size}px "${own.slice(0, 18)}"`);
      const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      seenFaces.add(fam);
      if (!families.includes(fam)) offFace.push(fam);
      measuredColours++;
      if (!inks.includes(s.color)) offInk.push(`text ${s.color}`);
    }

    // Spacing: every declared padding/margin/gap must be a multiple of the one unit.
    for (const prop of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
                        'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
                        'rowGap', 'columnGap']) {
      const v = parseFloat(s[prop]);
      if (!Number.isFinite(v) || v === 0) continue;
      measuredGaps++;
      if (Math.round(v) % unit !== 0) offGrid.push(`${prop} ${Math.round(v)}px`);
    }

    const bg = s.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      measuredColours++;
      if (!inks.includes(bg)) offInk.push(`bg ${bg}`);
    }

    for (const prop of ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth']) {
      const v = Math.round(parseFloat(s[prop]));
      if (v > 0 && v !== stroke) offStroke.push(`${prop} ${v}px`);
    }
    for (const prop of ['borderTopLeftRadius', 'borderTopRightRadius',
                        'borderBottomLeftRadius', 'borderBottomRightRadius']) {
      const v = Math.round(parseFloat(s[prop]));
      if (v !== radius) offRadius.push(`${prop} ${v}px`);
    }
  }

  const uniq = (a) => [...new Set(a)];
  return {
    offScale: uniq(offScale), offGrid: uniq(offGrid), offInk: uniq(offInk),
    offStroke: uniq(offStroke), offRadius: uniq(offRadius), offFace: uniq(offFace),
    faces: [...seenFaces],
    measuredSizes, measuredGaps, measuredColours, elements: els.length,
  };
};

export async function coherence({ html, css = '', w = 1080, h = 1350, browser: shared = null }) {
  const doc = `<!doctype html><html><head><meta charset="UTF-8"/><style>
      ${fontCss()}
      *{margin:0;padding:0;box-sizing:border-box}
      body{width:${w}px;height:${h}px;overflow:hidden;${BODY_TYPE}}${css}
    </style></head><body>${html}</body></html>`;

  const browser = shared || (await chromium.launch());
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(doc, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => { await document.fonts.ready; });
  const inks = Object.values(INK).map((v) => {
    const n = v.replace('#', '');
    return `rgb(${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)})`;
  });
  const families = Object.values(FACES).map((f) => f.split(',')[0].replace(/'/g, '').trim());
  const m = await page.evaluate(PROBE, { scale: SCALE, unit: UNIT, inks, stroke: STROKE, radius: RADIUS, families });
  await page.close();
  if (!shared) await browser.close();

  const checks = [
    ['type sizes on the scale', m.offScale, `${m.measuredSizes} measured`,
      'Five arbitrary sizes read as five decisions. Five off one ratio read as one decision.'],
    ['spacing on the grid', m.offGrid, `${m.measuredGaps} measured`,
      `Every gap must be a multiple of ${UNIT}. An off-grid value is a hand-placed element.`],
    ['colour is a declared ink', m.offInk, `${m.measuredColours} measured`,
      'A sixth colour has to answer to the palette\'s sentence, or the palette is a swatch pile.'],
    ['one stroke weight', m.offStroke, `${STROKE}px`,
      'Two line weights with no rule behind them is the clearest hand-assembled tell there is.'],
    ['one corner radius', m.offRadius, `${RADIUS}px`, 'Mixed radii belong to two different systems.'],
    ['every face is a declared voice', m.offFace, m.faces.join(', ') || 'none',
      'A face with no job is decoration. A face with a job is a voice.'],
  ];

  const fails = checks.filter(([, bad]) => bad.length);
  return { pass: !fails.length, checks, metrics: m, hex };
}

export function printCoherence(report) {
  console.log('\nCOHERENCE GATE  (does it belong to one system?)');
  console.log('================================================================');
  for (const [name, bad, coverage, why] of report.checks) {
    const ok = !bad.length;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(32)} ${String(coverage).padEnd(16)}`);
    if (!ok) {
      // COVERAGE, always - a checker that cannot say how much it measured will report success
      // for measuring nothing.
      console.log(`        ^ ${why}`);
      console.log(`        offenders: ${bad.slice(0, 6).join(' · ')}${bad.length > 6 ? ` (+${bad.length - 6})` : ''}`);
    }
  }
  const m = report.metrics;
  console.log('----------------------------------------------------------------');
  console.log(`  coverage: ${m.elements} elements · ${m.measuredSizes} type sizes · ` +
              `${m.measuredGaps} spacing values · ${m.measuredColours} colour values`);
  console.log(`  faces: ${m.faces.join(', ')}`);
  console.log(report.pass ? '  ONE SYSTEM.\n' : '  NOT ONE SYSTEM YET.\n');
}
