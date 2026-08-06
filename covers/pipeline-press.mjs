// D - PRESS. Photo-led. The answer to the media ceiling.
//
// THE DIAGNOSIS, in Sotiris's words: "not bad, but not good either - if someone with eight years
// of design experience evaluated it, not great." He was right, and so was the external eye:
// "perfect geometric primitives signal dashboard or software UI, not poster." Everything the
// pipeline made was divs, rects, lines and type. Every reference he chose carries drawn or
// photographed material. Layout without imagery is a flowchart.
//
// The fix was already in this repo and went unused for a whole session: refs/photo.mjs, built
// 2026-08-04, whose own header says "the ban is on GENERATED imagery, not on photography."
//
// THE PHOTOGRAPH: ink rollers on a working press. Chosen over the letterpress ampersand (which is
// the more beautiful image) for one unglamorous reason - the ampersand is CC BY-SA, and share-alike
// on the carrier arguably reaches the whole poster. This one is CC BY: attribute and go. Licence
// terms decide which picture ships, the same way the canvas decided the character count.
//
// It is also the right picture rather than merely a legal one: the orange is his accent occurring
// in the physical world instead of being specified in a token file, and ink on a roller is
// literally the medium the floor's thresholds were calibrated against.
//
// §6 ACTED ON: the orange 01-06 tabs are gone (named as an Envato/freepik infographic trope, and
// that was correct), numerals now set inline with the titles. NOT acted on: "the orange 1 on black
// turns to mud" - measured at 4.09:1, which clears AA large comfortably. Second eye, not the boss.
import fs from 'node:fs';
import { renderPoster } from './_render.mjs';
import { FLOOR_FEED } from './_critique.mjs';
import { coherence, printCoherence } from './_coherence.mjs';
import { SCALE, INK, FACES, STROKE } from './_system.mjs';

const W = 1080, H = 1350;
const [S30, S45, S68, , , S228] = SCALE;

const PHOTO = 'content-assets/photos-press2/05-ink-rollers.jpg';
const CREDIT = '“Ink rollers” by GollyGforce · CC BY 2.0 · openverse.org';
const photoData = 'data:image/jpeg;base64,' + fs.readFileSync(PHOTO).toString('base64');

const STAGES = [
  ['01', 'ORIENT',   'Decide the argument before a pixel'],
  ['02', 'RETRIEVE', 'Look at real design, not AI’s average'],
  ['03', 'DIVERGE',  'Twelve concepts in one render pass'],
  ['04', 'FLOOR',    'Refuses to save work that fails'],
  ['05', 'RANK',     'Ask “A or B”. Never a score'],
  ['06', 'LOG',      'It remembers what you chose'],
];

const css = `
  body { background:${INK.paper}; color:${INK.ink}; }

  /* Duotone, two layers and no filter tricks: a grayscale plate multiplied over an ember ground
     runs black at the shadows and ember at the highlights. The source frame is already orange,
     so the brand colour here is a fact about the object, not a value from a token file. */
  .plate  { position:absolute; overflow:hidden; background:${INK.ember}; }
  /* brightness 1.5, not 1.04. The first pass ran a heavy scrim under a headline that later moved
     down onto the paper - the scrim stayed, the headline did not, and the plate went to mud. An
     image you cannot identify is texture, not evidence, and evidence is the entire reason it is
     here. The scrim is gone; the seam is a hard cut, which is what a printed plate does anyway. */
  .plate img { width:100%; height:100%; object-fit:cover; display:block;
               filter:grayscale(1) contrast(1.02) brightness(1.5); mix-blend-mode:multiply; }

  .kick   { font-family:${FACES.machine}; font-size:${S30}px; font-weight:700;
            letter-spacing:.2em; text-transform:uppercase; }
  .title  { font-family:${FACES.argument}; font-size:${S68}px; font-weight:600; line-height:1.04; }
  /* The chip carries its own ground, so it can cross the photo/paper seam without the glyph
     splitting into a visible half and an invisible half. That is the difference between an
     overlap and a registration error. */
  .chip   { position:absolute; background:${INK.ember}; padding:16px; }
  .mark   { font-family:${FACES.verdict}; font-size:${S228}px; font-weight:800;
            color:${INK.paper}; line-height:1.0; text-align:center; width:168px; }

  .row    { position:absolute; left:48px; width:984px; height:72px; display:flex;
            align-items:center; gap:24px; border-bottom:${STROKE}px solid ${INK.ink}; }
  .row .n { font-family:${FACES.machine}; font-size:${S45}px; font-weight:700;
            color:${INK.ember}; width:96px; line-height:1.0; }
  .row .m { font-family:${FACES.machine}; font-size:${S45}px; font-weight:700;
            letter-spacing:.06em; width:264px; line-height:1.0; }
  .row .l { font-family:${FACES.human}; font-size:${S30}px; font-weight:400; flex:1;
            line-height:1.2; }

  .band   { position:absolute; background:${INK.ink}; }
`;

const html = `
<div class="plate" style="left:-48px;top:-48px;width:1176px;height:478px">
  <img src="${photoData}" alt="">
</div>
<!-- crosses the seam: 134px of it on the inked rollers, the rest on the page -->
<div class="chip" style="left:824px;top:296px"><div class="mark">1</div></div>

<!-- trimmed from "... · ZERO API KEYS": at 30px with .2em tracking the full line ran 840px and
     tucked its last word under the chip. The claim is already set in the band, so the line loses
     nothing by stopping short of the column it cannot have. -->
<div class="kick" style="position:absolute;left:48px;top:470px">SIX GATES · ONE SURVIVOR</div>
<div class="title" style="position:absolute;left:44px;top:512px;width:760px">
  Everything you never see is why this one works.</div>

${STAGES.map((s, i) => `
  <div class="row" style="top:${744 + i * 72}px">
    <div class="n">${s[0]}</div><div class="m">${s[1]}</div><div class="l">${s[2]}</div>
  </div>`).join('')}

<div class="band" style="left:-48px;top:1184px;width:1176px;height:214px"></div>
<div class="kick" style="position:absolute;left:48px;top:1216px;width:984px;
     letter-spacing:.06em;line-height:1.36;color:${INK.paper}">
  TWELVE DRAWN · FIVE REFUSED · TWO BUILT · ONE SHIPS<br>
  NO GENERATED IMAGERY · EU AI ACT ART. 50 · RUNS OFFLINE</div>
<div style="position:absolute;left:48px;top:1312px;width:984px;font-family:${FACES.human};
     font-size:${S30}px;line-height:1.2;color:${INK.paper}">${CREDIT}</div>`;

const report = await coherence({ html, css, w: W, h: H });
printCoherence(report);

try {
  await renderPoster({
    html, css, out: 'content-assets/pipeline-D-press.png',
    w: W, h: H, grain: 0.08, floor: FLOOR_FEED,
  });
  console.log('OK   D-press');
} catch (e) {
  console.log('FAIL D-press -', e.message);
}
