// C - ECOSYSTEM. Hub and spoke, built from covers/_system.mjs and nothing else.
//
// STRUCTURE stolen from the reference Sotiris posted: a centre subject with satellites, everything
// wired to everything - which is his "ecosystem, not a thing" argument drawn. SURFACE rejected:
// that reference is generated, its type is gibberish ("WALDORAI", "ANADAGIAP"), its icons are mush
// and its palette is the glowing-node-on-navy tell DESIGN-PARTNER.md names by hand. Take topology,
// refuse appearance - which is exactly the recipes-not-clippings split the whole project rests on.
//
// The topology is also TRUE here, which matters after B's proportion lie: the work passes through
// all six gates to reach the middle, and the middle is the single thing that ships. A radial would
// be a lie for a pure sequence; it is honest for a loop that ends in one survivor.
//
// The centre mark is drawn in SVG rather than as a div with border-radius:50%, because the system
// declares ONE corner radius (0). A circle is geometry, not a container - so it belongs in the
// drawing layer. That is the rule holding, not an exception to it.
import { renderPoster } from './_render.mjs';
import { FLOOR_FEED } from './_critique.mjs';
import { coherence, printCoherence } from './_coherence.mjs';
import { SCALE, INK, FACES, STROKE, ROLE } from './_system.mjs';

const W = 1080, H = 1350;
// Title steps DOWN to 68 rather than 102: at 102 its third line ran into the 01 badge, and the
// honest hierarchy here puts the centre mark first anyway - the "1" is the argument, the headline
// only names it. Both values are on the scale, so this is the system choosing, not a nudge.
const [S30, S45, S68, , , S228] = SCALE;

const CX = 540, CY = 800, R = 136;
// 240x208, not 224x160. The first pass sized the cards by eye and every one of them overflowed -
// "before a pixel" and "save bad work" spilled out the bottom onto the paper. The floor did not
// catch it because overflow was visible rather than hidden, so nothing was CLIPPED, it just
// escaped. Sized from the copy instead: 16 padding + 45 name + 8 + three 38px lines + 16 = 199.
const CARD_W = 240, CARD_H = 208;

// Copy trimmed to fit a measured 208px column at 30px - about 14 characters a line, three lines
// maximum. Writing to the box is not a compromise, it is the same discipline as fitText().
const NODES = [
  { n: '01', name: 'ORIENT',   line: 'Decide the argument first',    role: 'person',  x: 540, y: 504 },
  { n: '02', name: 'RETRIEVE', line: 'Real design, not AI’s average', role: 'machine', x: 810, y: 652 },
  { n: '03', name: 'DIVERGE',  line: 'Twelve concepts, one pass',    role: 'person',  x: 810, y: 948 },
  { n: '04', name: 'FLOOR',    line: 'Refuses to save bad work',     role: 'gate',    x: 540, y: 1096 },
  { n: '05', name: 'RANK',     line: 'A or B. Never a score',        role: 'person',  x: 270, y: 948 },
  { n: '06', name: 'LOG',      line: 'It remembers your choice',     role: 'machine', x: 270, y: 652 },
];

const css = `
  body { background:${INK.paper}; color:${INK.ink}; }
  .kick    { font-family:${FACES.machine}; font-size:${S30}px; font-weight:700;
             letter-spacing:.2em; text-transform:uppercase; }
  .title   { font-family:${FACES.argument}; font-size:${S68}px; font-weight:600; line-height:1.0; }
  .card    { position:absolute; width:${CARD_W}px; height:${CARD_H}px; border:${STROKE}px solid ${INK.ink};
             padding:16px; }
  .card .nm{ font-family:${FACES.machine}; font-size:${S45}px; font-weight:700; letter-spacing:.06em;
             line-height:1.0; }
  .card .ln{ font-family:${FACES.human}; font-size:${S30}px; font-weight:400; line-height:1.26;
             margin-top:8px; }
  /* the badge hangs off its own card - the only overlap on the canvas, and it is deliberate */
  .badge   { position:absolute; width:48px; height:48px; font-family:${FACES.machine};
             font-size:${S30}px; font-weight:700; color:${INK.paper}; text-align:center;
             line-height:48px; }
  /* 160 wide, not the full 272: a centring box that spans the whole circle reaches far enough
     right to count as a collision with the 03 badge, which is a measurement artefact rather
     than a design fact. The box should be the glyph, not the field it sits in. */
  .verdict { position:absolute; font-family:${FACES.verdict}; font-size:${S228}px; font-weight:800;
             color:${INK.ember}; line-height:1.0; text-align:center; width:160px; }
  .band    { position:absolute; background:${INK.ink}; color:${INK.paper}; }
`;

// --- the drawing layer: spokes and the centre mark ------------------------------------------
const spokes = NODES.map((d) => {
  const dx = d.x - CX, dy = d.y - CY, len = Math.hypot(dx, dy);
  const sx = CX + (dx / len) * R, sy = CY + (dy / len) * R;
  return `<line x1="${sx}" y1="${sy}" x2="${d.x}" y2="${d.y}"
           stroke="${INK.slate}" stroke-width="${STROKE}"/>`;
}).join('');

const html = `
<svg style="position:absolute;inset:0" width="${W}" height="${H}">
  ${spokes}
  <!-- the refusal path: FLOOR sends work back to DIVERGE. Clay, because refusal is ember darkened,
       not a new colour introduced for the occasion. Routed along the shortest real path - the
       first version swung out to x=920 and dead-ended in open paper, reading as a stray rule. -->
  <defs><marker id="rj" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
    <path d="M0,0 L0,6 L10,3 z" fill="${INK.clay}"/></marker></defs>
  <path d="M${CX + CARD_W / 2} 1096 H 810 V ${948 + CARD_H / 2}"
        stroke="${INK.clay}" stroke-width="${STROKE}" stroke-dasharray="12 8" fill="none"
        marker-end="url(#rj)"/>
  <circle cx="${CX}" cy="${CY}" r="${R}" fill="${INK.ink}"/>
</svg>

<div class="kick" style="position:absolute;left:48px;top:48px">
  SIX GATES · ONE SURVIVOR · ZERO API KEYS</div>
<div class="title" style="position:absolute;left:44px;top:88px;width:992px">
  Everything you<br>never see is why<br>this one works.</div>

<!-- The label sits BELOW the numeral, not above it. Above, at CY-112, the circle is only 154px
     wide and a 200px label broke out of it on both sides - a mark that leaks is not a mark.
     Below, the chord is 212px, so the word had to shorten to fit it too: the circle sets the
     character count, not the copywriting. Geometry decides, not the layout. -->
<div class="verdict" style="left:${CX - 80}px;top:${CY - 160}px">1</div>
<div class="kick" style="position:absolute;left:${CX - R}px;top:${CY + 70}px;width:${R * 2}px;
     text-align:center;letter-spacing:.12em;color:${INK.paper}">SHIPPED</div>

${NODES.map((d) => {
  const r = ROLE[d.role];
  const left = d.x - CARD_W / 2, top = d.y - CARD_H / 2;
  return `
  <div class="card" style="left:${left}px;top:${top}px;background:${r.bg};color:${r.fg}">
    <div class="nm">${d.name}</div><div class="ln">${d.line}</div></div>
  <div class="badge" style="left:${left - 16}px;top:${top - 40}px;background:${r.num}">${d.n}</div>`;
}).join('')}

<div class="band" style="left:-48px;top:1200px;width:1176px;height:198px"></div>
<div class="kick" style="position:absolute;left:48px;top:1232px;width:984px;
     letter-spacing:.06em;line-height:1.4;color:${INK.paper}">
  TWELVE DRAWN · FIVE REFUSED · TWO BUILT · ONE SHIPS<br>
  NO GENERATED IMAGERY · EU AI ACT ART. 50 · RUNS OFFLINE</div>`;

const report = await coherence({ html, css, w: W, h: H });
printCoherence(report);

try {
  await renderPoster({
    html, css, out: 'content-assets/pipeline-C-ecosystem.png',
    w: W, h: H, grain: 0.05, floor: FLOOR_FEED,
  });
  console.log('OK   C-ecosystem');
} catch (e) {
  console.log('FAIL C-ecosystem -', e.message);
}
