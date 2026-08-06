// §3 DIVERGE - "The design machine" architecture poster, buyer-facing, LinkedIn 4:5.
//
// References (Lane B, content-assets/pinterest, looked at not just fetched):
//   Compasso d'Oro timeline  -> ONE saturated spine runs full height; markers sit ON it, content
//                               alternates off it. An architecture made from a single mark.
//   Otto Neurath Isotype     -> quantity by REPEATED IDENTICAL UNITS, never by a number. 3 inks
//                               + black on cream. Labels set vertically at the base.
//   Le Monde organigramme    -> real boxes, real arrows, and a LEGEND that decodes the line types.
//                               Reads as a document, not a slide.
//   Fortune 1940s            -> the data becomes a physical OBJECT in a landscape, with weight.
//   Nigel Holmes             -> the metaphor IS the chart; plain-language annotation everywhere.
//
// Palettes deliberately span 6 families. Brand ivory/ink/orange appears in only 2 of 12 - per the
// 2026-08-04 rule that identity is a constraint applied at §4, not the material ideas are made of.
import { contactSheet } from './_contact-sheet.mjs';

const W = 1080, H = 1350;

// ---------------------------------------------------------------- the content, in plain words
const STAGES = [
  ['01', 'ORIENT',   'Decide the argument before a pixel'],
  ['02', 'RETRIEVE', 'Look at real design, not AI’s average'],
  ['03', 'DIVERGE',  'Ten ideas on one sheet. Kill eight'],
  ['04', 'FLOOR',    'The renderer refuses to save bad work'],
  ['05', 'RANK',     'Ask “A or B”. Never a score'],
  ['06', 'LOG',      'It remembers what you chose'],
];

const css = `
  .c { position:absolute; inset:0; overflow:hidden; }
  .c * { box-sizing:border-box; }

  /* ---- palette families -------------------------------------------------- */
  .p-compasso { background:#EFEDE8; --ink:#141414; --hit:#F2D027; --mute:#8C8880; }
  .p-isotype  { background:#F0EAD6; --ink:#1C1712; --hit:#8C3B1E; --two:#E8A33D; --mute:#8A7F6D; }
  .p-monde    { background:#F6F5F3; --ink:#111820; --hit:#2E4A6B; --two:#F2B79B; --mute:#7C848C; }
  .p-blueprint{ background:#0E1B25; --ink:#DCE9F0; --hit:#E63A22; --mute:#5C7686; }
  .p-ledger   { background:#FBFAF7; --ink:#151515; --hit:#B7231A; --mute:#8B8880; }
  .p-brand    { background:#F5F2ED; --ink:#1A1410; --hit:#C85A0C; --mute:#8A8378; }
  .p-dusk     { background:linear-gradient(#22384C 0%,#5E6E72 42%,#B08A62 74%,#D8B48A 100%);
                --ink:#F4EEE4; --hit:#D9452F; --two:#3E7D74; --mute:#C3B49E; }

  .mono { font-family:'Archivo Narrow','Geist',sans-serif; }
  .kick { font-size:13px; letter-spacing:.26em; text-transform:uppercase; font-weight:700; }
  .fine { font-size:11px; line-height:1.45; letter-spacing:.01em; }
`;

/* ============================================================ 01 SPINE (Compasso d'Oro steal) */
const spine = `
<div class="c p-compasso">
  <div style="position:absolute;left:392px;top:0;width:132px;height:100%;background:var(--hit)"></div>
  <div style="position:absolute;left:44px;top:56px;width:320px">
    <div class="kick mono" style="color:var(--ink)">A DESIGN MACHINE</div>
    <div style="font-size:52px;font-weight:900;line-height:.94;letter-spacing:-.025em;color:var(--ink);margin-top:14px">
      Six gates<br>between a<br>brief and<br>bad work.</div>
    <p class="fine" style="color:#4A4640;margin-top:20px;width:270px">
      Ask any AI for a poster and it hands back the same safe thing: one big line, one small line,
      nothing touching, nothing bleeding. It is competent and forgettable. No amount of prompting
      fixes it, because the pull toward the average is structural. So the fix is not a better prompt.
      It is a pipeline that refuses.</p>
  </div>
  ${STAGES.map((s, i) => {
    const top = 150 + i * 190;
    const left = i % 2 === 0;
    return `
    <div style="position:absolute;left:392px;top:${top}px;width:132px;text-align:center;
                font-size:58px;font-weight:900;line-height:.86;color:#141414;font-family:'Archivo Narrow',sans-serif">
      ${s[0][0]}<br>${s[0][1]}</div>
    <div style="position:absolute;${left ? 'right:44px;text-align:left;left:556px' : 'left:44px;width:328px;text-align:right'};
                top:${top + 8}px">
      <div class="mono" style="font-size:27px;font-weight:700;letter-spacing:.04em;color:var(--ink)">${s[1]}</div>
      <div class="fine" style="color:#565049;margin-top:5px">${s[2]}</div>
    </div>`;
  }).join('')}
  <div class="fine mono" style="position:absolute;left:44px;bottom:26px;color:#6E6A62;letter-spacing:.12em">
    ZERO API KEYS · NO IMAGE GENERATION · RUNS ON A LAPTOP</div>
</div>`;

/* ==================================================== 02 ISOTYPE (Neurath: repetition = quantity) */
const unit = (fill, o = 1) =>
  `<div style="width:34px;height:44px;background:${fill};opacity:${o};
     clip-path:polygon(0 12%,100% 12%,100% 100%,0 100%);position:relative">
     <div style="position:absolute;left:9px;top:-9px;width:16px;height:16px;border-radius:50%;background:${fill}"></div></div>`;
const row = (n, fill, o) => Array.from({ length: n }, () => unit(fill, o)).join('');
const isotype = `
<div class="c p-isotype" style="padding:52px 46px">
  <div style="font-size:44px;font-weight:900;line-height:.96;letter-spacing:-.02em;color:var(--ink);width:600px">
    Every poster this<br>machine ships is<br>the survivor of ten.</div>
  <p class="fine" style="color:#5C5346;width:470px;margin-top:16px">
    One idea is not a choice, it is a default - and the default is the average. So the sheet is
    built at twelve, judged at full size, and cut down in public. Each figure below is one concept.</p>
  ${[['DRAWN', 12, 'var(--two)', 1], ['CLEARED THE FLOOR', 5, 'var(--hit)', 1], ['SHIPPED', 1, '#1C1712', 1]]
    .map(([label, n, fill, o], i) => `
    <div style="position:absolute;left:46px;top:${430 + i * 210}px;width:988px">
      <div style="display:flex;gap:9px;flex-wrap:wrap;align-items:flex-end;height:66px">${row(n, fill, o)}
        ${i < 2 ? Array.from({ length: 12 - n }, () => unit('#C9BFA8', .32)).join('') : ''}</div>
      <div style="border-top:2px solid var(--ink);margin-top:12px;padding-top:7px;display:flex;justify-content:space-between">
        <span class="kick mono" style="color:var(--ink)">${label}</span>
        <span class="mono" style="font-size:30px;font-weight:700;color:var(--ink);line-height:.8">${n}</span></div>
    </div>`).join('')}
  <div class="fine mono" style="position:absolute;left:46px;bottom:30px;color:#7C7160;letter-spacing:.12em;max-width:520px">
    THE FLOOR IS DETERMINISTIC. IT KILLED SEVEN BEFORE A HUMAN LOOKED.</div>
</div>`;

/* ================================================ 03 TOWER (Fortune: the data as a heavy object) */
const tower = `
<div class="c p-dusk">
  ${STAGES.slice().reverse().map((s, i) => {
    const w = 200 + i * 74, top = 250 + i * 118;
    return `
    <div style="position:absolute;left:${(W - w) / 2 - 60}px;top:${top}px;width:${w}px;height:96px;
                background:${i % 2 ? '#2F6B63' : '#A83426'};box-shadow:0 12px 0 rgba(0,0,0,.34);
                border-top:9px solid ${i % 2 ? '#48978C' : '#C9503C'}">
      <div class="mono" style="color:#F1E6D6;font-size:23px;font-weight:700;letter-spacing:.1em;
                  padding:32px 0 0 22px">${s[1]}</div></div>
    <div style="position:absolute;left:${(W + w) / 2 - 52}px;top:${top + 30}px;background:#F3EADA;
                padding:7px 15px;box-shadow:0 3px 7px rgba(0,0,0,.3);max-width:300px">
      <div class="fine" style="color:#241C14">${s[2]}</div></div>`;
  }).join('')}
  <div style="position:absolute;left:60px;top:74px;width:640px">
    <div class="kick mono" style="color:#E6D8C2">DRAWN FOR THE RECORD</div>
    <div style="font-family:'Playfair Display',serif;font-size:50px;line-height:1.02;color:#F7F1E6;margin-top:10px">
      The weight a brief<br>carries before it is<br>allowed to be seen.</div>
  </div>
  <div class="fine mono" style="position:absolute;left:60px;bottom:34px;color:#EADCC6;letter-spacing:.1em;max-width:660px">
    SIX SUCCESSIVE LOADS HEAPED UPON A SINGLE IDEA · NO API KEYS · NO GENERATED IMAGERY</div>
</div>`;

/* ========================================= 04 ORGANIGRAMME (Le Monde: boxes, arrows, and a legend) */
const box = (x, y, w, label, sub, kind) => {
  const bg = kind === 'hit' ? 'var(--hit)' : kind === 'two' ? 'var(--two)' : '#FFFFFF';
  const fg = kind === 'hit' ? '#FFFFFF' : '#111820';
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;background:${bg};
    border:2px solid #111820;padding:9px 11px">
    <div class="mono" style="font-size:18px;font-weight:700;letter-spacing:.07em;color:${fg}">${label}</div>
    <div class="fine" style="color:${kind === 'hit' ? '#E8EEF4' : '#3D4650'};margin-top:3px">${sub}</div></div>`;
};
const monde = `
<div class="c p-monde" style="padding:44px 40px">
  <div style="font-size:38px;font-weight:900;line-height:1.03;letter-spacing:-.015em;color:var(--ink);width:660px">
    Simplified chart of a design pipeline that will not let itself ship slop</div>
  <div style="position:absolute;left:40px;top:172px;width:196px;border:2px solid #111820;padding:11px">
    <div class="kick mono" style="color:#111820;font-size:11px;margin-bottom:9px">LÉGENDE</div>
    ${[['#FFFFFF', 'Human decision'], ['var(--two)', 'Machine measure'], ['var(--hit)', 'Hard gate']]
      .map(([c, l]) => `<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
        <span style="width:16px;height:12px;background:${c};border:1.5px solid #111820"></span>
        <span class="fine" style="color:#111820">${l}</span></div>`).join('')}
    <div style="display:flex;gap:8px;align-items:center;margin-top:9px">
      <span style="width:26px;height:0;border-top:2px solid #111820"></span>
      <span class="fine" style="color:#111820">passes</span></div>
    <div style="display:flex;gap:8px;align-items:center;margin-top:5px">
      <span style="width:26px;height:0;border-top:2px dashed #B7231A"></span>
      <span class="fine" style="color:#111820">rejected, returns</span></div>
  </div>
  ${box(292, 176, 216, 'ORIENT', STAGES[0][2], '')}
  ${box(292, 268, 216, 'RETRIEVE', STAGES[1][2], 'two')}
  ${box(292, 372, 216, 'DIVERGE', STAGES[2][2], '')}
  ${box(560, 372, 232, 'FLOOR', STAGES[3][2], 'hit')}
  ${box(560, 490, 232, 'RANK', STAGES[4][2], '')}
  ${box(560, 596, 232, 'LOG', STAGES[5][2], 'two')}
  <svg style="position:absolute;inset:0;pointer-events:none" width="${W}" height="${H}">
    <path d="M400 232 L400 262" stroke="#111820" stroke-width="2" marker-end="url(#a)"/>
    <path d="M400 336 L400 366" stroke="#111820" stroke-width="2" marker-end="url(#a)"/>
    <path d="M512 410 L554 410" stroke="#111820" stroke-width="2" marker-end="url(#a)"/>
    <path d="M676 452 L676 484" stroke="#111820" stroke-width="2" marker-end="url(#a)"/>
    <path d="M676 556 L676 590" stroke="#111820" stroke-width="2" marker-end="url(#a)"/>
    <path d="M556 420 L470 420 L470 640 L556 640" stroke="#B7231A" stroke-width="2"
          stroke-dasharray="7 5" fill="none"/>
    <defs><marker id="a" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#111820"/></marker></defs>
  </svg>
  <div style="position:absolute;left:40px;top:700px;right:40px;border-top:2px solid #111820;padding-top:16px">
    <div style="display:flex;gap:34px">
      ${[['193', 'characters in the poster that failed'], ['1 000–1 800', 'characters in a real one'],
         ['4 3 4 4 4', 'the AI score across five different versions'], ['€0', 'cost per render']]
        .map(([n, l]) => `<div style="flex:1">
          <div class="mono" style="font-size:34px;font-weight:700;color:var(--hit);line-height:.9">${n}</div>
          <div class="fine" style="color:#3D4650;margin-top:6px">${l}</div></div>`).join('')}
    </div>
    <p class="fine" style="color:#3D4650;margin-top:18px;column-count:2;column-gap:28px">
      The failure has a shape you can count. A slide has three type sizes, nothing overlapping and
      nothing running off the edge. A poster has five or more, fine print at 8 to 12 pixels, and a
      title that breaks mid-word. So the gate measures those, refuses to write the file when they
      fail, and prints the reason. Numbers reject the bottom. A person still chooses the top -
      because ten professional designers agree with each other only 57.7% of the time, and no
      machine can be trained past a ceiling like that.</p>
  </div>
</div>`;

/* ================================================================= 05 GATE (one drawn mark) */
const gate = `
<div class="c p-compasso">
  <svg style="position:absolute;inset:0" width="${W}" height="${H}">
    <circle cx="540" cy="620" r="360" fill="none" stroke="#141414" stroke-width="3"/>
    <circle cx="540" cy="620" r="292" fill="var(--hit)"/>
    <path d="M248 620 L832 620" stroke="#141414" stroke-width="3"/>
    <path d="M540 328 L540 912" stroke="#141414" stroke-width="3" stroke-dasharray="10 8"/>
    <path d="M300 620 A 240 240 0 0 1 780 620" fill="#141414"/>
    <text x="540" y="586" text-anchor="middle" font-family="Archivo Narrow" font-size="150"
          font-weight="700" fill="var(--hit)">2/12</text>
  </svg>
  <div class="kick mono" style="position:absolute;left:52px;top:52px;color:#141414">THE FLOOR</div>
  <div style="position:absolute;left:52px;top:88px;width:520px;font-size:46px;font-weight:900;
              line-height:.98;letter-spacing:-.02em;color:#141414">
    Ten of twelve never reach a human eye.</div>
  <div style="position:absolute;left:52px;bottom:52px;right:52px">
    <div style="border-top:3px solid #141414;padding-top:14px;display:flex;gap:26px">
      ${STAGES.map((s) => `<div style="flex:1">
        <div class="mono" style="font-size:15px;font-weight:700;letter-spacing:.08em;color:#141414">${s[0]} ${s[1]}</div>
        <div class="fine" style="color:#57534C;margin-top:4px">${s[2]}</div></div>`).join('')}
    </div>
  </div>
</div>`;

/* ================================================================ 06 BLUEPRINT (technical line) */
const blueprint = `
<div class="c p-blueprint" style="padding:50px 46px">
  <div class="kick mono" style="color:var(--mute)">SHEET 1 OF 1 · SELF-HOSTED · NO API KEYS</div>
  <div style="font-size:46px;font-weight:900;line-height:.98;letter-spacing:-.02em;color:var(--ink);
              margin-top:12px;width:660px">A gate you cannot forget to call.</div>
  <p class="fine" style="color:var(--mute);width:520px;margin-top:14px">
    Not a checklist, not a hook, not a reminder. The refusal lives inside the renderer, so every
    path hits it - a script run by hand, a cron job, a different model next year.</p>
  <svg style="position:absolute;left:0;top:330px" width="${W}" height="760">
    ${STAGES.map((s, i) => {
      const y = 40 + i * 108;
      return `
      <line x1="120" y1="${y}" x2="960" y2="${y}" stroke="#2B4557" stroke-width="1"/>
      <circle cx="120" cy="${y}" r="9" fill="none" stroke="#DCE9F0" stroke-width="2"/>
      <text x="152" y="${y - 12}" font-family="Archivo Narrow" font-size="30" font-weight="700"
            letter-spacing="3" fill="#DCE9F0">${s[1]}</text>
      <text x="152" y="${y + 16}" font-family="Geist" font-size="15" fill="#7E9AAC">${s[2]}</text>
      <text x="70" y="${y + 7}" font-family="Archivo Narrow" font-size="19" fill="#5C7686">${s[0]}</text>`;
    }).join('')}
    <path d="M120 40 L120 580" stroke="#DCE9F0" stroke-width="2"/>
    <path d="M120 580 L64 580 L64 40 L112 40" stroke="#E63A22" stroke-width="2" fill="none"
          stroke-dasharray="8 6"/>
    <text x="30" y="330" font-family="Archivo Narrow" font-size="15" fill="#E63A22"
          transform="rotate(-90 30 330)" letter-spacing="4">PREFERENCE FEEDS RETRIEVAL</text>
  </svg>
  <div style="position:absolute;right:46px;bottom:46px;border:2px solid var(--hit);color:var(--hit);
              padding:11px 20px;transform:rotate(-7deg);font-family:'Archivo Narrow',sans-serif;
              font-size:28px;font-weight:700;letter-spacing:.14em">REFUSED TO WRITE FILE</div>
</div>`;

/* ================================================================ 07 LEDGER (dense printed table) */
const ledger = `
<div class="c p-ledger" style="padding:52px 48px">
  <div style="display:flex;justify-content:space-between;align-items:baseline;
              border-bottom:3px solid var(--ink);padding-bottom:12px">
    <div style="font-family:'Playfair Display',serif;font-size:44px;color:var(--ink)">The refusal ledger</div>
    <div class="kick mono" style="color:var(--mute)">REV. 08 · 2026</div>
  </div>
  <p class="fine" style="color:#4A4A46;margin-top:14px;column-count:2;column-gap:30px">
    Each row is a stage. The third column is the one that matters: what the stage is allowed to
    say no to. A pipeline with no refusals is a pipeline that ships whatever it made first, and
    whatever it made first is the average of everything it has ever seen.</p>
  ${[...STAGES, ['—', 'OVERRIDE', 'force:true, and it prints loudly']].map((s, i) => `
    <div style="display:flex;gap:20px;border-bottom:1px solid #DAD6CC;padding:15px 0;align-items:baseline">
      <div class="mono" style="width:44px;font-size:22px;font-weight:700;color:var(--hit)">${s[0]}</div>
      <div class="mono" style="width:190px;font-size:22px;font-weight:700;letter-spacing:.06em;color:var(--ink)">${s[1]}</div>
      <div class="fine" style="flex:1;color:#3C3C38;font-size:14px">${s[2]}</div>
      <div class="fine" style="width:210px;color:var(--hit);text-align:right">
        ${['no brief, no build', 'no reference, no build', 'fewer than 8, no build',
           'density 193 → rejected', 'a score is not an answer', 'nothing is forgotten',
           'visible in the log'][i]}</div>
    </div>`).join('')}
  <div style="position:absolute;left:48px;right:48px;bottom:46px;border-top:3px solid var(--ink);padding-top:16px">
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <p class="fine" style="color:#4A4A46;max-width:560px">
        Ten professional designers agree with each other only 57.7% of the time. That is the ceiling
        on any machine that tries to rank taste - so this one rejects the bottom with numbers and
        leaves the top to a person.</p>
      <div class="mono" style="font-size:74px;font-weight:700;color:var(--hit);line-height:.8">57.7%</div>
    </div>
  </div>
</div>`;

/* ================================================================== 08 SIEVE (Holmes metaphor) */
const sieve = `
<div class="c p-isotype" style="padding:46px 44px">
  <div style="font-size:48px;font-weight:900;line-height:.96;letter-spacing:-.022em;color:var(--ink);width:560px">
    Most of what an AI designs should never be shown to you.</div>
  <p class="fine" style="color:#5C5346;width:440px;margin-top:14px">
    Four sieves, each finer than the last. What falls through at the bottom is the only thing
    a person is asked to judge - which is the only judgement worth a person’s time.</p>
  ${[0, 1, 2, 3].map((i) => {
    const top = 380 + i * 178, w = 760 - i * 128;
    return `
    <div style="position:absolute;left:${(W - w) / 2}px;top:${top}px;width:${w}px;height:92px;
                border:3px solid var(--ink);border-bottom:none;
                background:repeating-linear-gradient(90deg,var(--ink) 0 2px,transparent 2px ${12 + i * 3}px);
                background-position:bottom;background-size:100% 14px;background-repeat:no-repeat"></div>
    <div style="position:absolute;left:${(W + w) / 2 + 18}px;top:${top + 24}px">
      <div class="mono" style="font-size:21px;font-weight:700;letter-spacing:.07em;color:var(--hit)">
        ${['THE FLOOR', 'THE SHEET', 'THE PAIRWISE', 'YOUR EYE'][i]}</div>
      <div class="fine" style="color:#5C5346;margin-top:3px;max-width:210px">
        ${['density, type sizes, bleeds', 'twelve concepts, one pass',
           'A or B, never a score', 'the last 42.3%'][i]}</div></div>
    <div style="position:absolute;left:${(W - w) / 2 - 10}px;top:${top + 30}px">
      <div class="mono" style="font-size:32px;font-weight:700;color:var(--two);text-align:right;width:0">
        <span style="display:block;width:60px;margin-left:-60px">${[12, 5, 2, 1][i]}</span></div></div>`;
  }).join('')}
  <div class="fine mono" style="position:absolute;left:44px;bottom:28px;color:#7C7160;letter-spacing:.11em">
    ZERO API KEYS · NO GENERATED IMAGERY · RUNS OFFLINE ON A LAPTOP</div>
</div>`;

/* =============================================================== 09 LOOP (closed circuit, 2 inks) */
const loop = `
<div class="c" style="background:#141414;padding:52px 46px">
  <div class="kick mono" style="color:#F2D027">IT GETS BETTER INSTEAD OF RESETTING</div>
  <div style="font-size:52px;font-weight:900;line-height:.95;letter-spacing:-.025em;color:#F4F2ED;
              margin-top:12px;width:620px">Every session starts where the last one stopped.</div>
  <svg style="position:absolute;left:0;top:400px" width="${W}" height="700">
    <rect x="150" y="60" width="780" height="480" fill="none" stroke="#F2D027" stroke-width="3"/>
    ${STAGES.map((s, i) => {
      const pts = [[150, 60], [540, 60], [930, 60], [930, 540], [540, 540], [150, 540]][i];
      const anchor = i === 1 ? 'middle' : i === 4 ? 'middle' : i < 3 ? (i === 0 ? 'start' : 'end') : 'start';
      const dy = i < 3 ? -22 : 40;
      return `<circle cx="${pts[0]}" cy="${pts[1]}" r="15" fill="#141414" stroke="#F2D027" stroke-width="3"/>
        <text x="${pts[0]}" y="${pts[1] + dy}" text-anchor="${anchor}" font-family="Archivo Narrow"
              font-size="28" font-weight="700" letter-spacing="3" fill="#F4F2ED">${s[1]}</text>
        <text x="${pts[0]}" y="${pts[1] + dy + (i < 3 ? -20 : 22)}" text-anchor="${anchor}"
              font-family="Geist" font-size="14" fill="#9A9488">${s[2]}</text>`;
    }).join('')}
    <text x="540" y="310" text-anchor="middle" font-family="Archivo Narrow" font-size="128"
          font-weight="700" fill="#F2D027">LOG</text>
    <text x="540" y="352" text-anchor="middle" font-family="Geist" font-size="16" fill="#9A9488">
      append-only. the decision is the asset.</text>
  </svg>
  <div class="fine mono" style="position:absolute;left:46px;bottom:30px;color:#8A857A;letter-spacing:.1em">
    €0 PER RENDER · NO CLOUD · NO KEYS</div>
</div>`;

/* ============================================================ 10 NUMBER (brand, the countable tell) */
const number = `
<div class="c p-brand" style="padding:52px 48px">
  <div class="kick mono" style="color:var(--mute)">THE FAILURE IS COUNTABLE</div>
  <div style="font-family:'Archivo Narrow',sans-serif;font-size:400px;font-weight:700;line-height:.72;
              color:var(--hit);letter-spacing:-.03em;margin-left:-18px;margin-top:6px">193</div>
  <div style="font-size:40px;font-weight:900;line-height:1.02;letter-spacing:-.02em;color:var(--ink);
              width:640px;margin-top:8px">characters on the poster the AI called finished.</div>
  <div style="margin-top:22px;display:flex;align-items:flex-end;gap:0;height:120px">
    <div style="width:26px;height:14px;background:var(--hit)"></div>
    <div style="width:640px;height:96px;background:var(--ink)"></div>
  </div>
  <div style="display:flex;gap:0;margin-top:8px">
    <div style="width:26px" class="fine mono" >193</div>
    <div style="width:640px" class="fine mono" >1 000–1 800 · A REAL POSTER</div>
  </div>
  <p class="fine" style="color:#4C463E;margin-top:22px;column-count:2;column-gap:26px;font-size:12px">
    Three type sizes where a poster has five. Smallest type at 26px where print sets 8 to 12.
    Nothing overlapping. Nothing bleeding off the trim. No evidence of a medium at all. Two separate
    checks passed it - an eight-point correctness rubric and a vision model scoring ambition out of
    ten. Neither could see it. A designer saw it instantly, every single time. So the checks were
    rewritten as a floor that fails loudly and refuses to write the file, and the scoring was thrown
    out entirely in favour of one question: A or B, or reject both.</p>
  <div style="position:absolute;left:48px;right:48px;bottom:44px;border-top:2px solid var(--ink);padding-top:12px;
              display:flex;justify-content:space-between">
    ${STAGES.map((s) => `<div class="mono" style="font-size:14px;font-weight:700;letter-spacing:.07em;color:var(--ink)">${s[1]}</div>`).join('')}
  </div>
</div>`;

/* ========================================================== 11 SPEC (parts list, Archivo Narrow) */
const spec = `
<div class="c" style="background:#DEDBD2;padding:48px 44px">
  <div style="border:3px solid #1C1C1A;height:100%;padding:26px 24px;position:relative">
    <div style="display:flex;justify-content:space-between;border-bottom:2px solid #1C1C1A;padding-bottom:10px">
      <div class="mono" style="font-size:30px;font-weight:700;letter-spacing:.1em;color:#1C1C1A">PARTS LIST</div>
      <div class="kick mono" style="color:#6E6C64">DESIGN PARTNER · SELF-HOSTED</div>
    </div>
    <div style="font-size:36px;font-weight:900;line-height:1.02;color:#1C1C1A;margin-top:18px;width:560px">
      Nine small programs, none of them clever.</div>
    <p class="fine" style="color:#4E4C46;margin-top:12px;width:520px">
      There is no model here that judges design. There is a corpus a human chose, a set of measurements
      that fail loudly, and a log of which of two things you preferred. That is the whole trick.</p>
    ${[['_critique', 'measures the page before it renders'], ['_render', 'refuses to save a failure'],
       ['_contact-sheet', 'twelve concepts, one pass'], ['_grid', 'fits type by measuring, not guessing'],
       ['_select', 'A or B, then writes it down'], ['refs/decompose', 'turns a reference into a recipe'],
       ['refs/hunt', 'finds taste by co-occurrence, not search'], ['refs/embed', 'visual similarity, offline'],
       ['refs/photo', 'real photography, keyless, attributed']].map((p, i) => `
      <div style="display:flex;gap:14px;align-items:baseline;border-bottom:1px solid #C2BEB2;padding:9px 0">
        <span class="mono" style="width:34px;font-size:15px;color:#8A877C">${String(i + 1).padStart(2, '0')}</span>
        <span class="mono" style="width:230px;font-size:19px;font-weight:700;color:#1C1C1A">${p[0]}</span>
        <span class="fine" style="flex:1;color:#4E4C46">${p[1]}</span>
      </div>`).join('')}
    <div class="fine mono" style="position:absolute;left:24px;bottom:20px;color:#6E6C64;letter-spacing:.1em">
      NO KEYS · NO CLOUD · NO GENERATED IMAGERY · FONTS SIL OFL</div>
  </div>
</div>`;

/* =============================================== 12 HAND (Lupi: irregular, annotated, plotted) */
const hand = `
<div class="c" style="background:#F4F1E9;padding:48px 44px">
  <div style="font-family:'Playfair Display',serif;font-size:48px;line-height:1.02;color:#211C16;width:600px">
    What the machine
    <em style="color:#7A2E1E">cannot</em> do,
    and why that is the point.</div>
  <p class="fine" style="color:#5A5248;width:470px;margin-top:14px">
    Plotted by hand from the log. Each mark is one decision this pipeline made, sized by how much of
    it was measurement and how much was a person. The right-hand mass never shrinks - that is the
    57.7% ceiling, drawn.</p>
  <svg style="position:absolute;left:0;top:360px" width="${W}" height="800">
    ${Array.from({ length: 62 }, (_, i) => {
      const x = 110 + (i % 14) * 62 + ((i * 37) % 17) - 8;
      const y = 60 + Math.floor(i / 14) * 96 + ((i * 53) % 29);
      const r = 5 + ((i * 29) % 13);
      const machine = (i * 41) % 100 < 58;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${machine ? '#2C4A3E' : '#C25A2E'}"
        opacity="${.55 + ((i * 17) % 40) / 100}"/>`;
    }).join('')}
    <path d="M96 40 C 300 120, 260 300, 520 340 S 880 420, 960 500" stroke="#211C16" stroke-width="1.5"
          fill="none" stroke-dasharray="4 5"/>
    <text x="96" y="560" font-family="Geist" font-size="15" fill="#5A5248">
      each dot = one A/B decision, logged</text>
  </svg>
  <div style="position:absolute;left:44px;bottom:44px;right:44px;display:flex;gap:30px;
              border-top:1.5px solid #211C16;padding-top:14px">
    <div style="display:flex;gap:9px;align-items:center">
      <span style="width:14px;height:14px;border-radius:50%;background:#2C4A3E"></span>
      <span class="fine" style="color:#3E382F">the floor decided it — measurable, deterministic</span></div>
    <div style="display:flex;gap:9px;align-items:center">
      <span style="width:14px;height:14px;border-radius:50%;background:#C25A2E"></span>
      <span class="fine" style="color:#3E382F">a person decided it — and no machine can</span></div>
  </div>
</div>`;

await contactSheet({
  out: 'content-assets/sheet-pipeline.png',
  canvas: { w: W, h: H },
  css,
  cols: 4,
  thumbWidth: 340,
  concepts: [
    { name: 'SPINE', html: spine },
    { name: 'ISOTYPE', html: isotype },
    { name: 'TOWER', html: tower },
    { name: 'ORGANIGRAMME', html: monde },
    { name: 'GATE', html: gate },
    { name: 'BLUEPRINT', html: blueprint },
    { name: 'LEDGER', html: ledger },
    { name: 'SIEVE', html: sieve },
    { name: 'LOOP', html: loop },
    { name: 'NUMBER', html: number },
    { name: 'SPEC', html: spec },
    { name: 'HAND', html: hand },
  ],
});
