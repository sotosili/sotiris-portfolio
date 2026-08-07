// SELECTION — best-of-N, floor first, then a PAIRWISE comparison. Never a scalar score.
//
// WHY NOT A SCORE. On 2026-08-03 the external eye scored five materially different versions of one
// brief 4, 3, 4, 4, 4 while its prose swung from "the spatial metaphor fails completely" to "no AI
// tells, it stops the scroll, better". Five rounds were spent iterating against that number.
// It turns out this is a published result, not bad luck: VLM judges rank reliably and score
// unreliably, producing wide, uninformative intervals for absolute values ("VLM Judges Can Rank but
// Cannot Score"). A gate on that number is a gate on noise.
//
// So the architecture is:
//   1. MECHANICAL FLOOR   deterministic, kills the bottom  (covers/_critique.mjs)
//   2. RENDER survivors   only compositions that cleared the floor cost a render
//   3. PAIRWISE COMPARE   a side-by-side sheet + a forced A-or-B-or-reject-both question
//   4. LOG THE DECISION   append-only, so preferences accumulate into training signal
//
// Numbers reject the bottom. Taste chooses the top. Never let a metric become the objective -
// computational-aesthetics measures correlate only moderately with expert judgement, so a system
// that MAXIMISES them converges on formulaic work, which is just a more sophisticated slide.
//
// BEST-OF-N NOTE: candidates must come from DIFFERENT RETRIEVAL SEEDS, not from temperature.
// Sampling variation produces surface variety; seed variation produces genuinely different ideas.
//
//   import { select } from './_select.mjs';
//   const r = await select({ candidates: [{name:'STACK', html, css}, ...], w:1080, h:1350 });

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { critique, printCritique } from './_critique.mjs';
import { renderPoster } from './_render.mjs';

const LOG = 'refs/taste-log.jsonl';

export async function select({ candidates, w = 1080, h = 1350, grain = 0.05, outDir = 'content-assets', brief = '', floor = undefined }) {
  const browser = await chromium.launch();
  const passed = [], rejected = [];

  console.log(`\nBEST-OF-${candidates.length}  —  floor first, then pairwise\n${'='.repeat(64)}`);
  for (const c of candidates) {
    const report = await critique({ html: c.html, css: c.css || '', w, h, browser, floor });
    if (report.pass) {
      passed.push({ ...c, report });
      console.log(`  KEEP    ${c.name.padEnd(16)} floor cleared`);
    } else {
      rejected.push({ ...c, report });
      console.log(`  REJECT  ${c.name.padEnd(16)} ${report.failed.map((f) => f[0]).join(', ')}`);
    }
  }

  if (!passed.length) {
    console.log('\nEVERY candidate failed the floor. This is a §3 problem, not a §4 problem —');
    console.log('the ideas are too thin, not badly executed. Go back and diverge again.');
    for (const r of rejected) { console.log(`\n### ${r.name}`); printCritique(r.report); }
    await browser.close();
    return { winner: null, passed: [], rejected, needsDiverge: true };
  }

  // Render only what cleared the floor. A render costs seconds; a wrong render costs a round.
  for (const c of passed) {
    c.file = path.join(outDir, `cand-${c.name.toLowerCase()}.png`);
    await renderPoster({ html: c.html, css: c.css || '', out: c.file, w, h, grain, browser, floor });
  }

  // The comparison sheet. One image, sent once, so the judge sees both at the SAME size and
  // cannot drift between calls — half the scalar-score noise came from judging in isolation.
  const sheet = path.join(outDir, '_compare.png');
  const cells = passed.map((c, i) =>
    `<figure><img src="${pathToFileURL(path.resolve(c.file)).href}"><figcaption>${'AB CDEF'[i] || i}</figcaption></figure>`).join('');
  const page = await browser.newPage({
    viewport: { width: Math.min(passed.length, 3) * 620 + 80, height: 900 }, deviceScaleFactor: 2 });

  // setContent puts the page on an about:blank OPAQUE ORIGIN, which silently refuses every file://
  // <img> - the sheet renders as broken-image icons and nothing in the log says so. On 2026-08-04
  // the external eye was handed one of these and correctly reported "this isn't a design, it's a
  // screenshot of a technical error". Navigate to a real file:// document instead, then VERIFY
  // every image decoded before spending a review on it.
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:40px;background:#191512;font:600 15px ui-sans-serif;color:#f4efe6}
    .g{display:flex;gap:40px;align-items:flex-start}figure{margin:0;flex:1}
    img{width:100%;display:block;box-shadow:0 2px 30px rgba(0,0,0,.5)}
    figcaption{margin-top:14px;font-size:34px;letter-spacing:.2em;color:#ff8534}
  </style><div class="g">${cells}</div>`;
  const tmp = path.join(outDir, '_compare.html');
  fs.mkdirSync(path.resolve(outDir), { recursive: true });
  fs.writeFileSync(path.resolve(tmp), html, 'utf8');
  await page.goto(pathToFileURL(path.resolve(tmp)).href, { waitUntil: 'networkidle' });

  const broken = await page.evaluate(() => document.images.length
    - Array.from(document.images).filter((i) => i.complete && i.naturalWidth > 0).length);
  if (broken) {
    await browser.close();
    throw new Error(`compare sheet: ${broken} image(s) failed to load - do NOT send this to a reviewer.`);
  }

  await page.screenshot({ path: path.resolve(sheet), fullPage: true });
  await page.close();
  await browser.close();
  fs.unlinkSync(path.resolve(tmp));

  console.log(`\n${passed.length} candidate(s) cleared the floor -> ${sheet}`);
  console.log(`\nNOW ASK THE EXTERNAL EYE — pairwise, and do NOT ask for a score:\n`);
  console.log(`  Two candidates for the same brief${brief ? `: ${brief}` : ''}. Answer bluntly:
  1. Would you believe an AI made these? Name the specific tells.
  2. Which is better, A or B — or do you reject both? Commit to one answer.
  3. Single weakest decision in the one you chose?
  4. Where does it look like a template with the colours swapped?
  5. Three concrete craft decisions a great designer would have made instead.`);
  console.log(`\nThen record the outcome:  logChoice({ brief, winner, loser, why, source })`);

  return { winner: null, passed, rejected, sheet, needsDiverge: false };
}

// Append-only preference log. Decisions accumulate; prose does not. After ~100 recorded pairs this
// is trainable data for a discriminator-style ranker (a few hundred curated examples is enough,
// per the GAN-RM result) — which is how the system stops depending on a third-party judge at all.
export function logChoice({ brief, winner, loser, why, source = 'gemini' }) {
  fs.mkdirSync(path.dirname(path.resolve(LOG)), { recursive: true });
  fs.appendFileSync(LOG, JSON.stringify({
    at: new Date().toISOString(), brief, winner, loser, why, source,
  }) + '\n');
  const n = fs.readFileSync(LOG, 'utf8').trim().split('\n').length;
  console.log(`taste-log: ${n} recorded preference(s)`);
}
