// §4 BUILD - two directions at full size, LinkedIn feed 1080x1350, FLOOR_FEED enforced.
//
// A  ORGANIGRAMME  (Le Monde diplomatique)  "real boxes, real arrows, and a LEGEND that decodes
//                                            the line types. Reads as a document, not a slide."
// B  TOWER         (Fortune, Boris Artzybasheff, 1941)  "the data becomes a physical OBJECT in a
//                                            landscape, with weight." Inverted on purpose: the
//                                            pile of refused work is the BASE and the single
//                                            survivor sits on top, so the funnel IS the tower.
//
// Typography is set for the FEED, not for print: nothing below 30px, because LinkedIn shows a
// 1080px image at ~360px and anything smaller is decoration. That is FLOOR_FEED.minSmallestType.
//
// PALETTE DISCIPLINE: five declared inks each, hard limit. Set 03/04 both landed on "two colours
// plus black is a full palette when the forms are strong" - and the first pass of this file used
// seven and twelve. Where a sixth colour was tempting (the red 'refused' line in A) the fix was
// semantic, not cosmetic: refusal belongs to the gate, so it is drawn in the gate's own navy.
import { renderPoster } from './_render.mjs';
import { FLOOR_FEED } from './_critique.mjs';

const W = 1080, H = 1350;

// The funnel is this session's real count: 12 drawn, 5 killed on the sheet, 2 built, 1 ships.
const STAGES = [
  ['ORIENT',   'Decide the argument before a pixel',    '1',  'brief'],
  ['RETRIEVE', 'Look at real design, not AI’s average', '10', 'references'],
  ['DIVERGE',  'Twelve concepts, one render pass',      '12', 'concepts'],
  ['FLOOR',    'The renderer refuses to save bad work', '5',  'refused'],
  ['RANK',     'Ask “A or B”. Never a score',           '2',  'built'],
  ['LOG',      'It remembers what you chose',           '1',  'ships'],
];

/* ==========================================================================================
   A - ORGANIGRAMME.  Ink: paper F6F5F3 · ink 111820 · white FFFFFF · navy 2E4A6B · salmon F2B79B
   ========================================================================================== */
const cssA = `
  body { background:#F6F5F3; color:#111820; }
  .kick { font-family:'Archivo Narrow',sans-serif; font-size:30px; letter-spacing:.2em;
          text-transform:uppercase; font-weight:700; color:#111820; }
  .node { position:absolute; border:3px solid #111820; padding:15px 18px 17px; background:#FFFFFF; }
  .node .n { font-family:'Archivo Narrow',sans-serif; font-size:40px; font-weight:700;
             letter-spacing:.07em; line-height:1; }
  .node .s { font-size:30px; line-height:1.26; color:#111820; margin-top:8px; }
  .hit { background:#2E4A6B; }  .hit .n { color:#FFFFFF; }  .hit .s { color:#F2B79B; }
  .two { background:#F2B79B; }
`;

// The number is not decoration: with six boxes in two columns, nothing else tells a reader where
// the chart starts. An architecture diagram whose reading order is ambiguous has failed at its job.
const nodeA = (x, y, i, kind = '') => `
  <div class="node ${kind}" style="left:${x}px;top:${y}px;width:428px">
    <div class="n">${String(i + 1).padStart(2, '0')} &nbsp;${STAGES[i][0]}</div>
    <div class="s">${STAGES[i][1]}</div></div>`;

const htmlA = `
<div class="kick" style="position:absolute;left:56px;top:50px">SIMPLIFIED CHART · ONE DESIGN PIPELINE</div>
<div style="position:absolute;left:52px;top:96px;width:960px;font-size:78px;font-weight:900;
            line-height:.97;letter-spacing:-.03em">
  Six gates between<br>a brief and<br>bad work.</div>

<!-- Le Monde's actual rule: the chart carries a key that decodes its own lines. -->
<div style="position:absolute;left:596px;top:372px;width:428px;border:3px solid #111820;padding:17px 19px">
  <div class="kick" style="margin-bottom:13px">KEY</div>
  ${[['#FFFFFF', 'a person decides'], ['#F2B79B', 'a machine measures'], ['#2E4A6B', 'a hard gate']]
    .map(([c, l]) => `<div style="display:flex;gap:13px;align-items:center;margin-bottom:10px">
      <span style="width:34px;height:24px;background:${c};border:3px solid #111820;flex:none"></span>
      <span style="font-size:30px">${l}</span></div>`).join('')}
  <div style="display:flex;gap:13px;align-items:center;margin-top:15px">
    <span style="width:34px;height:0;border-top:3px solid #111820;flex:none"></span>
    <span style="font-size:30px">passes</span></div>
  <div style="display:flex;gap:13px;align-items:center;margin-top:10px">
    <span style="width:34px;height:0;border-top:3px dashed #2E4A6B;flex:none"></span>
    <span style="font-size:30px">refused, sent back</span></div>
</div>

${nodeA(56, 372, 0)}
${nodeA(56, 546, 1, 'two')}
${nodeA(56, 720, 2)}
${nodeA(596, 720, 3, 'hit')}
${nodeA(56, 894, 4)}
${nodeA(596, 894, 5, 'two')}

<svg style="position:absolute;inset:0;pointer-events:none" width="${W}" height="${H}">
  <defs><marker id="ar" markerWidth="11" markerHeight="11" refX="10" refY="3.5" orient="auto">
    <path d="M0,0 L0,7 L11,3.5 z" fill="#111820"/></marker></defs>
  <path d="M270 510 L270 538" stroke="#111820" stroke-width="3" marker-end="url(#ar)"/>
  <path d="M270 684 L270 712" stroke="#111820" stroke-width="3" marker-end="url(#ar)"/>
  <path d="M488 780 L588 780" stroke="#111820" stroke-width="3" marker-end="url(#ar)"/>
  <path d="M810 858 L810 886" stroke="#111820" stroke-width="3" marker-end="url(#ar)"/>
  <path d="M488 954 L588 954" stroke="#111820" stroke-width="3" marker-end="url(#ar)"/>
  <path d="M596 746 L542 746 L542 638 L486 638" stroke="#2E4A6B" stroke-width="3"
        stroke-dasharray="10 7" fill="none" marker-end="url(#ar)"/>
</svg>

<!-- full-bleed footer: runs past both trims, and the numeral hangs above it -->
<div style="position:absolute;left:-40px;top:1112px;width:1160px;height:238px;background:#2E4A6B"></div>
<div style="position:absolute;left:52px;top:1028px;font-family:'Archivo Narrow',sans-serif;
            font-size:200px;font-weight:700;color:#F2B79B;line-height:.8;letter-spacing:-.02em">193</div>
<div style="position:absolute;left:412px;top:1136px;width:300px;font-size:30px;line-height:1.26;color:#FFFFFF">
  characters on the poster the AI called finished.</div>
<div style="position:absolute;left:742px;top:1136px;width:282px;font-size:30px;line-height:1.26;color:#FFFFFF">
  A real one carries 1,000 to 1,800. The failure is countable.</div>`;

/* ==========================================================================================
   B - TOWER.  Ink: cream F4EBDA · ink 2B231A · slate 31485A · teal 2F6B63 · red A83426
   ========================================================================================== */
const cssB = `
  body { background:linear-gradient(#1B2E40 0%,#3D5563 34%,#8B7C6B 62%,#C6A279 82%,#DFC49E 100%);
         color:#F4EBDA; }
  .kick { font-family:'Archivo Narrow',sans-serif; font-size:30px; letter-spacing:.2em;
          text-transform:uppercase; font-weight:700; color:#F4EBDA; }
  .slab { position:absolute; height:100px; box-shadow:0 14px 0 rgba(0,0,0,.34);
          border-top:10px solid rgba(244,235,218,.42); }
  /* inline-block so the label's box is the WORD, not the whole slab - a full-width block box
     reads as a collision with the ribbon sitting on the slab's right edge, which it is not. */
  .slab .n { display:inline-block; font-family:'Archivo Narrow',sans-serif; font-size:38px;
             font-weight:700; letter-spacing:.09em; color:#F4EBDA; margin:32px 0 0 24px; }
  .ribbon { position:absolute; width:224px; background:#F4EBDA; padding:10px 17px;
            box-shadow:0 5px 11px rgba(0,0,0,.36); display:flex; align-items:baseline; gap:11px; }
  .ribbon b { font-family:'Archivo Narrow',sans-serif; font-size:46px; font-weight:700;
              color:#A83426; line-height:.9; }
  .ribbon span { font-size:30px; color:#2B231A; }
`;

// Fortune's tower sized every slab by the dollar figure it carried. A tidy pyramid would be
// prettier and would be a lie: it would give "1 brief" the widest slab and "12 concepts" a middle
// one. Width is the count, so the stack bulges at DIVERGE and closes to a single survivor - which
// is the actual shape of the machine, and the whole argument of the poster.
const WIDTHS = STAGES.map(([, , n]) => 170 + Number(n) * 38);
const htmlB = `
<div class="kick" style="position:absolute;left:56px;top:50px">DRAWN FOR THE RECORD · 2026</div>
<div style="position:absolute;left:52px;top:92px;width:900px;font-family:'Playfair Display',serif;
            font-size:78px;line-height:1.0;text-shadow:0 3px 15px rgba(0,0,0,.4)">
  The loads one idea<br>carries before you see it.</div>
<div style="position:absolute;left:56px;top:274px;width:360px;font-size:30px;line-height:1.32;
            text-shadow:0 2px 9px rgba(0,0,0,.45)">
  Ask any AI for a poster and it hands back the same safe thing. The pull toward the average is
  structural, so no prompt fixes it. Six gates do. Each slab is as wide as the work it holds: the
  stack swells where the machine makes twelve, and closes where a person keeps one.</div>

<div style="position:absolute;left:700px;top:262px;background:#2B231A;padding:15px 19px">
  ${[['#31485A', 'a person decides'], ['#2F6B63', 'a machine measures'], ['#A83426', 'a hard gate']]
    .map(([c, l]) => `<div style="display:flex;gap:12px;align-items:center;margin-bottom:9px">
      <span style="width:34px;height:22px;background:${c};flex:none"></span>
      <span style="font-size:30px">${l}</span></div>`).join('')}
</div>

<!-- the survivor, sitting on the pile it was chosen from -->
<div style="position:absolute;left:488px;top:338px;font-family:'Archivo Narrow',sans-serif;
            font-size:190px;font-weight:700;line-height:.8;text-shadow:0 4px 16px rgba(0,0,0,.45)">1</div>

${STAGES.map((s, i) => {
  const w = WIDTHS[i], top = 1042 - i * 108, left = 540 - w / 2;
  const rx = Math.min(left + w - 10, 826);
  const fill = i === 3 ? '#A83426' : i % 2 ? '#2F6B63' : '#31485A';
  return `
  <div class="slab" style="left:${left}px;top:${top}px;width:${w}px;background:${fill}">
    <div class="n">${s[0]}</div></div>
  <div class="ribbon" style="left:${rx}px;top:${top + 22}px"><b>${s[2]}</b><span>${s[3]}</span></div>`;
}).join('')}

<!-- full-bleed plate caption, past both trims -->
<div style="position:absolute;left:-40px;top:1180px;width:1160px;height:210px;background:#2B231A"></div>
<div class="kick" style="position:absolute;left:56px;top:1204px;width:968px;font-size:30px;
     letter-spacing:.06em;line-height:1.4">
  TWELVE DRAWN · FIVE REFUSED · TWO BUILT · ONE SHIPS<br>
  ZERO API KEYS · NO GENERATED IMAGERY · RUNS OFFLINE</div>`;

for (const [name, html, css, grain] of [
  ['A-organigramme', htmlA, cssA, 0.04],
  ['B-tower', htmlB, cssB, 0.06],
]) {
  try {
    await renderPoster({
      html, css, out: `content-assets/pipeline-${name}.png`,
      w: W, h: H, grain, floor: FLOOR_FEED,
    });
    console.log('OK  ', name);
  } catch (e) {
    console.log('FAIL', name, '-', e.message);
  }
}
