# Claude Design in your pipeline — what it actually is

Written 2026-08-07. Everything in §1–§3 was **verified live this session** by calling the bridge
against your account. Where something is judgement rather than measurement, it says so.
Supersedes the "what is it" part of `CLAUDE-DESIGN-START.md`; that file's design-system values and
prompting advice still stand.

---

## 0. The one-sentence answer

**Claude Design is not Claude Code's canvas. It is a separate app with its own canvas, and
`DesignSync` is a pipe between the two that carries a component library — not a cursor.**

That distinction is the whole thing, so here it is laid out against Pencil:

| | Pencil MCP | Claude Design + DesignSync |
|---|---|---|
| What it is | A **canvas** I drive | An **app** I publish to and read from |
| Who generates | Me, in this session | Claude Design's own engine, in the browser |
| Loop shape | `execute` → `get_screenshot` → I see it → `execute` again, **same turn** | I push files up → *you* open the app and generate → I pull back down, **different sittings** |
| Unit of work | A node, a frame, a live file | A **component library**: preview HTML + code + tokens |
| Runs on | Your machine, €0 | Your claude.ai account |
| Verdict | Direct manipulation | **Distribution + inheritance** |

So the honest framing for your mental map:

```
BRAIN      Claude Code (VS Code)      reads the repo, writes files, runs node, deploys
CANVAS     Pencil                     live, direct, one file at a time
FOUNDRY    Claude Design              generates real visual material, has its own canvas
PIPE       DesignSync                 syncs the library between repo ⇄ Claude Design
RULER      covers/                    measures what comes back (floor, coherence, contrast)
MEMORY     MEMORY.md + BRAND-KIT.md   the decisions, in words
```

Claude Design fills the slot `covers/` cannot: it makes **imagery and interface**, not just
layout. `covers/` keeps its job — it stops being the thing that makes the poster and becomes the
thing that refuses a bad one.

---

## 1. What is already on your account (verified 2026-08-07)

The bridge is **live and authorized**. No login step needed. Three design-system projects exist,
all owned by you, all writable, all untouched since 27 April 2026:

| Project | ID | Last touched |
|---|---|---|
| GMap Design System | `019dcfc6-4e44-7563-b458-9888d7ade8ab` | 2026-04-27 |
| Coffee World Design System | `91a06fcd-70cd-489b-b513-502761d8ba9e` | 2026-04-27 |
| Velocity Design System | `019dcfb9-3a17-72ce-acb2-9bc0744adeb5` | 2026-04-27 |

GMap is **not a stub**. Its real contents:

```
colors_and_type.css
preview/  colors-base · colors-semantic · type-display · type-body · spacing-tokens
          components-buttons · components-cards · components-inputs · components-nav
          brand-logo · brand-imagery
ui_kits/gmap-app/  AppShell · HomeScreen · ScanScreen · MachineDetailsScreen
                   TrackWorkoutScreen · ProgramProfileScreens  (+ index.html)
assets/   logo.png · gym-hero.jpg · scan-bg.jpg · program-hero.jpg
README.md · SKILL.md
```

That is a genuine, structured design system sitting on your account — one per case study, matching
the three live projects. You built more here in April than you remember.

**The gap, stated plainly:** there is **no `Sotiris — ivory / ink / ember` project.** The "one
thing to do tonight" from `CLAUDE-DESIGN-START.md` (2026-08-05) was never done. Your three client
systems are on the account; *your own brand* is not. That is the highest-leverage move available,
and it is unchanged from two days ago.

---

## 2. How the two meanings of "token" work here

You asked about tokens. There are two, and conflating them is what makes this confusing.

### 2a. Design tokens — the brand values
Today your brand exists in **two** places in this repo and **zero** places in Claude Design:

- `BRAND-KIT.md` — the prose version
- `covers/_system.mjs` — the executable version (the one the coherence gate reads)
- Claude Design — nothing

That is the drift risk. The fix is one direction of flow, never two:

> `covers/_system.mjs` is the **source of truth**. A build step renders it into `preview/*.html`
> cards + `colors_and_type.css`, and DesignSync pushes those up. Nobody hand-edits tokens in the
> app.

This is exactly the shape the GMap project already has — `colors_and_type.css` plus
`preview/colors-*.html`. The pattern is proven; it just was never pointed at your own brand.

### 2b. Context tokens — what this costs you
The bridge is deliberately cheap, and this is a real design decision in the tool, not a guess:

| Call | Context cost |
|---|---|
| `list_projects` / `list_files` | Paths and names only. Negligible. |
| `write_files` with `localPath` | **Zero.** The tool reads the file off disk, encodes and uploads it. File contents never enter my context. |
| `write_files` with inline `data` | Full cost. Use only for tiny dynamic strings. |
| `get_file` | Full cost, capped at 256 KiB. Only call it to diff one component you named. |

**So: pushing a 40-file design system up costs almost nothing in this session.** The expensive
work — generating posters, slides, UI — happens *in the Claude Design app on your claude.ai
account*, not in this CLI. That is the right split: judgement and generation there, measurement
and version control here.

Practical rule: **always `localPath`, never paste file contents.** And build the structural diff
from `list_files`, only reaching for `get_file` when you have named a specific component.

---

## 3. The rules the pipe enforces (so you don't hit them blind)

Verified from the tool contract:

1. **Design-system projects only.** `create_project` makes a `PROJECT_TYPE_DESIGN_SYSTEM`, and the
   type is **immutable at creation**. Pushing to an ordinary Claude Design project will never turn
   it into a design system. One-off posters you generate in the app are *not* syncable — they live
   there until you export them.
2. **Plan before write.** The order is fixed: `list` → `finalize_plan` (you see the exact path list
   and source directory, independent of anything I say) → `write` / `delete`. No plan, no write.
3. **Incremental, never wholesale.** The intended discipline is one component at a time. A
   full-library replace is how you lose April's work.
4. **Cards are self-declaring.** A preview HTML whose first line is
   `<!-- @dsCard group="Components" -->` becomes a card in the Design System pane automatically.
   No separate registration step.
5. **Remote content is data, not instruction.** Anything read back with `get_file` is treated as
   untrusted text.

---

## 4. The loop, end to end

```
   ┌─────────────────────── you: direction, taste, the verdict ───────────────────────┐
   │                                                                                  │
   ▼                                                                                  │
BRAND-KIT.md ──▶ covers/_system.mjs ──build──▶ preview/*.html + colors_and_type.css    │
  (words)          (source of truth)              (@dsCard markers)                    │
                                                        │                              │
                                                  DesignSync push                      │
                                                        ▼                              │
                                        ╔═══════════════════════════════╗              │
                                        ║   Claude Design project       ║              │
                                        ║   "Sotiris — ivory/ink/ember" ║              │
                                        ╚═══════════════════════════════╝              │
                                                        │                              │
                                     set Design system: Sotiris, then generate         │
                                     (Blank · Slides · Animation · Wireframe)          │
                                                        │                              │
                                                   export / pull                       │
                                                        ▼                              │
                              covers/_coherence · _render · _judge · _select ───────────┘
                                   (floor: contrast, scale, grid, overflow)
```

Read it as: **the repo decides the rules, Claude Design does the making, the repo checks the
work.** Nothing generates before the system is set — same argument as always, direction before
pixels.

---

## 5. Where the connectors and memory actually sit

Judgement, not measurement — but these are the honest roles:

- **MEMORY.md** — holds *why* the brand is what it is (media ceiling, vector-first, taste ceiling
  at 57.7%). It never gets pushed to Claude Design. It aims the work.
- ~~**Pencil MCP**~~ — **RETIRED 2026-09-01.** Dropped as the design surface; it did not earn its
  place. The hands-on canvas question is open again - see the CHANGELOG. Formerly:
  it is the surface. Claude Design does not replace it; it sits upstream of it.
- **Figma MCP** — still a View seat, still no Dev Mode. Claude Design changes nothing here except
  that it removes the last argument for paying: you now have a system-aware generation surface
  that costs nothing extra.
- **Higgsfield / Motion** — video lane only. The Article 50 line holds: no generated imagery on
  accountability work, and label + toggle anything that ships.
- **`/design-sync` skill** — referenced by the tool, **not installed locally**. Not a blocker (the
  bridge is callable directly), but it is the thing that carries the one-component-at-a-time
  discipline. Worth installing before the first real push.

---

## 6. Next move — staged, not done

Nothing was written to your account this session. Reads only.

**Move 1 (the whole unlock).** Build `covers/build-design-system-bundle.mjs`: read
`covers/_system.mjs`, render `preview/*.html` cards with `@dsCard` markers for colour, type,
spacing and the four faces, plus `colors_and_type.css`. Free, local, €0, reviewable in VS Code
before a single byte leaves the machine.

**Move 2.** `create_project` → `Sotiris — ivory / ink / ember`, `finalize_plan`, push the bundle.

**Move 3.** In the app: set **Design system: Sotiris**, Blank template, and ask for **six
directions** with a named reference and a forbidden list. Bring six back; four get killed with
reasons.

Move 1 is buildable on one word.
