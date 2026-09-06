# BRAND - the part that does not change while the design does

**Written 2026-09-05.** For the new portfolio, and for anything else outward-facing.

This file and `POSITIONING.md` are the whole brief. **Everything you can see is yours to invent.**
Everything that is claimed, and the way it sounds, is fixed here.

The split is deliberate. The old portfolio's visual system has been parked, not deleted, so that a
new one can be designed without being pulled back toward the thing it is replacing. Design first,
then re-attach the old context on purpose - §8.

---

## 1. Where to look, and where not to

**Live - read these:**

| File | Holds |
|---|---|
| `POSITIONING.md` | The pitch: thesis, headline, the two buyer vocabularies, the proof artifact |
| `BRAND.md` | This file: what is true, how it sounds, what is free |
| `GOAL.md` | The current aim - who the work is for right now |

**Parked - do not read these as design direction:**

| File | Why parked |
|---|---|
| `THESIS.md` §3, §4, §9 | The layered time-travel hero, the visual system, the type decision. Real work, and it is the shape of the *old* site. Its §1, §2, §5, §8 (who it is for, the real job, anti-mood, project honesty) stay live |
| `soul.md` "Brand constraint" | Pinned ivory/ink/orange and Geist + Playfair. Superseded by §7 below until the new palette lands |
| `design-system/`, `covers/_system.mjs` | **Still live, but not for this.** They drive the poster and cover pipeline - teacher cards, carousels, plates. Do not delete them and do not treat them as the portfolio's direction |
| `ops/PORTFOLIO-AUDIT-2026-08-26.md`, `ops/PORTFOLIO-HANDOFF-2026-09-05.md` | Audits of the site being replaced. Useful history, not a brief |
| `ops/HERO-BRIEF-2026-08-29.md` | The old hero brief. Retired 2026-09-07 with the concept it described. A new, simpler brief replaces it |

**Undecided, and it is Sotiris's call - do not treat either way as settled:**

`src/styles/global.css` currently declares a complete, finished palette ("THE FIELD" -
`--paper` #F4EFE6, `--ink` #1C1815, `--sea` #14425C, `--stone` #C8B297, `--ember` #F26C0D),
written 2026-09-06, one day after this file. Read literally that is "the new palette landed"
and §7 below no longer applies.

**But its stated justification was the two hero photographs, and that hero was retired
2026-09-07.** So the palette outlived its argument. It is not wrong - the pairs were computed -
it is simply no longer derived from anything the site still contains. Uncommitted, and the live
site does not use it: the shipped components carry their own hardcoded hexes (`#F5F2ED`,
`#1A1410`) from the older system, which is a third palette again.

**Three palettes exist right now and none supersedes the others by evidence.** Until Sotiris
picks, treat §7 as live - the palette is free - and do not build on `global.css` assuming it
is decided.

Full parked visual context, kept whole: `ops/DESIGN-SYSTEM-PARKED-2026-09-05.md`.

---

## 2. The position

> **Product Designer / Design Engineer**
>
> I design the human side of AI agents - trust, correction, and adoption.
> EU AI Act Article 50 + WCAG 2.2 AA.

Everything behind that line - why it exists, the market argument, the two doors - is
`POSITIONING.md`. Read it before writing a word of copy. Not from memory.

---

## 3. What is true - the only claims that may be made

- **13+ years in design** (visual, brand, product). **About 2 in UX and accessibility.**
  Never "13 years UX." This is the oldest standing rule and it still gets broken.
- **Coffee World** is the one real, paid, live client project.
- **G-MAP and Velocity** are speculative case studies. Real design work, not real clients.
  They must be labelled as concepts on the card *and* in the body, and no completed user testing
  may be claimed for them.
- **The Article 50 Kit** is open source - a demonstration, not a client engagement.
- Thessaloniki, Greece. Inside the EU regulatory environment - an advantage, never hidden.

**Transparency about two years of UX experience is the positioning, not a weakness to hide.**
Evidence, not assertion. If a claim cannot be shown, it does not go on the page.

---

## 4. How it sounds

- Spaced hyphen ( - ). Never an em dash.
- Named specifics over abstractions. No hedging.
- Never "passionate", never "excited to". Never open a sentence with "I".
- Open with an observation or a specific detail, not an introduction.
- Close with a point of view, not a question.

**One vocabulary per document** (`POSITIONING.md` §5). A page that speaks to both the compliance
buyer and the product buyer reads as neither.

**Recommendation for the site: write it in product vocabulary.** Trust, correction, adoption,
mental models, graceful failure. The compliance buyer arrives through a different door - outreach,
an agency, a Greek SMB conversation - and is better served by a dedicated page or a PDF than by a
homepage trying to do both. This is a recommendation, not a decision. Sotiris's call.

---

## 5. The gates - unchanged, and they are design inputs

1. **WCAG 2.2 AA, computed, never assumed.** 2.1 AA / EN 301 549 is the legal floor, not the target.
2. **EU AI Act Article 50** - transparency, human oversight, marking synthetic content.
3. **Responsible design** - no dark patterns. "No" is a design feature.

These go in the brief **before the first pixel**, not into a review at the end. A checklist run
after generation catches errors; it never shapes a design. Keyboard route, focus order, alt text
and the reduced-motion state are drawn as part of the design, not retrofitted.

---

## 6. Refusals

- Defense or military work
- German or Russian language requirements
- Dark patterns of any kind
- **Synthetic imagery standing in for real people or his own work.** A positioning own-goal, and
  an Article 50 disclosure he should not have to make on his own portfolio.
- Type baked into a raster; flattened exports; unnamed layers

---

## 7. What is free

**All of it.** Palette, typefaces, type scale, grid, layout, density, motion, imagery treatment,
the structure of the page, and the hero concept itself. No colour is inherited. No typeface is
inherited. The old ivory / ink / orange system does not constrain this work.

If the new direction ends up somewhere near the old one, that is a choice made twice - which is
fine. What is not fine is arriving there because a file said so.

---

## 8. The one visual rule that survives

Distinctiveness, not a colour.

**In five seconds the page must be unmistakably his.** Today's could belong to any capable design
engineer, and that is the actual defect - not the palette.

The anti-mood stays: **the default AI look is forbidden.** Warm-minimal editorial, the centred
hero anyone could have, the four-tile values grid, the five-step process strip. If every reference
that gets picked is warm-minimal editorial, the gate is pointed at the AI default and will certify
the default.

**Generic output is a context failure, not a model defect.** So the divergence has to come from
somewhere real - a reference deliberately chosen, a biography, a constraint - and it must be
picked before generation, not corrected after it.

---

## 9. Making the assets - where each thing actually gets made

**There are two Figma doors and they have different rights. Do not confuse them.**

| Door | Rights | Use |
|---|---|---|
| **`figma-cli`** - `C:\Users\iliso\figma-cli\src\index.js` | **Writes.** Drives Figma Desktop over CDP *as Sotiris*, so the free seat does not block it | The real door. Everything below |
| **Figma MCP** | **Read only** - View seat, Starter, both teams. Also drifts and drops on long sessions | Reading a file: `get_design_context`, `get_variable_defs`, `get_screenshot`. When it goes flaky, switch to the CLI |

**Read `~/hero-pipeline/FIGMA.md` before running a single command.** It is the manual, it was
written from `--help` on the real binary, and it records a trap that costs twenty minutes every
time it is hit.

| Want to | Route |
|---|---|
| **References with real numbers** | `screenshot-url --full --scale 2`, then `analyze-url` - which extracts **exact CSS**, not an estimate from a screenshot. This is how the reference problem gets solved honestly. `recreate-url` rebuilds a page in Figma at 1440 |
| **Tokens into Figma** | Author `DESIGN.md` (the `design-md` skill writes exactly this format), then `import`. One direction, markdown canonical. `variables visualize` puts swatches on canvas |
| **Components** | `variants`, `combos`, `sizes`, `bind-batch` - bindings stay bound, so a later theme swap keeps working |
| **Figma → React** | `export-jsx`. Free, no seat. Code Connect needs Dev Mode and a paid seat; this is the free stand-in, one-directional and not kept in sync |
| Imagery, plates, atmosphere, hero treatment | **The studio pipeline** - `HERMES.md` §5.7 and `pipeline_handle.md`. Read that first: it builds a **component, never a page**, and you trace the **depth map, never the photograph** |
| Motion | **HyperFrames** - HTML to deterministic MP4. Which is why the addressable format is HTML + CSS + SVG together, and why a flattened export kills the motion rig and the screen reader for the same reason |
| Posters, covers, carousels | `covers/` and `studio/`, floor-gated. Untouched by the redesign |

**Two hard limits, both measured on this account, neither fixable by trying harder:**

- **Variable modes: exactly 1 on Starter.** `collection.addMode()` returns *"Limited to 1 modes
  only"*. Variables themselves work fine - `design-tokens` already holds 7 bound COLOR variables.
  It is the *switching* that is capped. **So do not design a light/dark theme toggle around
  variable modes.** Either one collection per theme and swap the binding, or design one theme
  properly and treat dark as a later project. The second is the honest answer for most work.
- **Modes cannot be created by an agent at all** - there is no mode command. Manual UI job, and
  only once the rest is stable.

**Connection, and it bites every time:** two ports. **9222** is CDP into Figma Desktop, **3456** is
the daemon. **CDP first, daemon second. Never run `connect`** - it prints "Connected to Figma"
while closing Figma and killing the daemon that was already running. Port 9222 only opens once a
**document** is loaded, not when Figma launches. Never hardcode the versioned `app-*` install path;
it changed mid-session once already. Full sequence and the three-line symptom guide: `FIGMA.md`.

---

## 10. After the new system exists

Once the palette, type and scale are decided, re-attach the parked context on purpose:

1. Rewrite `soul.md`'s "Brand constraint" to the new values - it is the file every design skill
   loads, so it is the one that must be current.
2. Fold anything still worth keeping from `ops/DESIGN-SYSTEM-PARKED-2026-09-05.md` into the new
   system, deliberately, item by item. Some of it is measurement worth keeping. Most of it is a
   record of a system being replaced.
3. Decide whether Figma or `covers/_system.mjs` is the source of truth, and write the answer down.
   The repo currently says "regenerate, never hand-edit." A hand-edited Figma file breaks that
   quietly.
4. Write the CHANGELOG line in the same pass, and retire the dead values in `ops/stale.py`.
