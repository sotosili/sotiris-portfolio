# METHOD - how design work happens here, on any project

**Written 2026-09-07.** Project-agnostic on purpose. Sotiris's portfolio is one client of this
method, not the subject of it. Everything here applies to a café menu, an NGO site, a client
audit, or a poster.

For what is true about *him* specifically - the pitch, the claims, the palette - see
`POSITIONING.md` and `BRAND.md`. This file is the machine, not the message.

---

## The one-line version

**Four rooms, and a written contract on every door between them.** Everything that has gone
wrong went wrong at a door, not inside a room.

---

## The four rooms

### 1. The brief room - decide what is being made, and for whom

Nothing gets made here. This is the thinking pass: the real job behind the stated job, the
person in their actual situation, the job story, the flow.

**Order is fixed and only `AGENTS.md` carries it, because a skill description cannot express
sequence:** `strategy` → `soul` → `humane`. Strategy frames the problem, soul does the making
pass and taste, humane runs whenever the honest answer might be no.

**Accessibility enters HERE, not later.** The operability criteria go into the brief before the
first pixel. This is the single correction that matters most and the one everyone gets wrong: an
audit at the end catches errors, it never shapes a design. If a gate is the first time
accessibility comes up, the process already failed.

### 2. The morgue - references, measured, not remembered

Editorial studios keep a morgue: the archive you raid before you draw. This one is
`refs/` - ~130 curated images across 10 sets, a scored retriever, a recipe extractor, and a
reader that pulls real CSS out of a live site.

```bash
node refs/query.mjs "<the brief in a sentence>" --top 3
node refs/study.mjs <url> --label "<what you want from it>"
```

Every reference comes back with a **STRUCTURE** line (what it actually does) and a **STEAL**
line (the one extractable move). Build **two directions from two different recipes** - two
variants of one recipe is one idea in a different colour.

**Why this room exists:** generic output is a *retrieval* failure, not a rendering one. A model
with no specific reference returns the average of everything it has seen. That average is what
"AI slop" is. You do not fix it with a better prompt; you fix it by handing over a measured
reference. Skill: `refs`.

### 3. The workshop - where pixels get made

Local, free, on the machine: ComfyUI on the RTX 4060, Depth Anything for depth maps, Potrace for
tracing, `cf-plate.py` for flat plates, `figma-cli` for the Figma door. **Hermes lives here.**

The workshop's own rule: **it builds a component, never a page.** A model asked to build a
"hero" will invent copy, place names and coordinates to fill the space. If a value is not in the
brief, it does not exist - stop and ask.

### 4. The loading dock - where finished work enters the product

Nothing crosses into a repo unnamed, unmeasured, or undescribed. Skill: `asset-intake`.
Filename that explains itself, correct format class, alt text **written by the human and never
invented**, provenance manifest, AI-generation marking where it applies, weight as a real number.

**This room is new, and it exists because the door was missing.** Measured on this repo:
64 files in `public/`, 52 of them timestamped junk, 58 MB, including 5 prompt `.txt` files being
served publicly. Nobody decided that. It accumulated because there was no dock.

---

## The rule that travels furthest: separation before generation

**A composition is never one asset. It is layers, and each layer has exactly one correct format.**

| Ask, per element | Class | Format |
| --- | --- | --- |
| flat colour, gradient, noise, grain, a rule | **procedural** | CSS / SVG filter - a few hundred bytes |
| words | **text** | live text. Always. No exceptions |
| outlines and fills, no continuous tone | **vector** | `.svg` |
| continuous tone - skin, sky, fabric, atmosphere | **raster** | `.webp`/`.png`, alpha, cropped tight |

Push every element as far up that table as it goes. Raster is the only class that costs bytes,
blocks scaling, and can trigger an AI-disclosure duty.

**Why it is one rule and not four:** the property underneath is **addressability** - a machine
can only manipulate what has a name and a boundary. A flattened poster fails a screen reader and
a motion engine *for exactly the same reason*. Accessibility work and animation work are not two
disciplines that happen to agree; they are one property. This is the most portable thing in this
file. It applies to every client asset you will ever hand over.

**The failure it prevents, seen here:** files named `.svg` that were 2.5 MB and 99.998% base64
PNG. Minifying saved nothing, because there was no vector inside to minify.

---

## Computed, never asserted

Contrast is a number you calculate, not a feeling you have. "It looks fine on my screen" is not a
result. WCAG 2.2 AA on every component, computed - and the legal floor (EN 301 549 / 2.1 AA) is
the floor, not the target.

This is also the commercial argument: a client buying accessibility is buying a *measured*
claim. An asserted one is worth nothing and is a liability if it is wrong.

---

## Who does what

| Who | Owns | Never does |
| --- | --- | --- |
| **Sotiris** | The WHAT. Direction, the brief, the crop, the hierarchy, the final taste call, choosing between two directions | - |
| **Hermes** | The HOW in the workshop. Generation, rendering, layer cutting, Figma | Does not write into the repo. Does not decide. Does not invent a value |
| **Claude Code** | The repo, the structure, the intake gate, the measurement | Does not choose between variants. Does not write alt text |

**The contract between Hermes and the repo is the important one**, because it is where the work
physically changes hands: Hermes generates outside, hands over, `asset-intake` receives.
Before that gate existed, three crossings failed in three different ways - empty alt text
shipped live, a manifest with the wrong year on a personal photograph, and a raster wearing an
SVG costume.

---

## Portable to client work vs. specific to him

**Portable - use on any project:** the four rooms; separation before generation; accessibility as
an input; computed contrast; reference-first retrieval; the intake gate; provenance manifests;
"build a component, never a page"; two directions from two different recipes.

**His only - do not carry into a client project:** the palette question, the positioning and
claims, the hero concept, his photographs, his rates.

A client engagement gets the *method*. It does not get his taste defaults, and it should not -
that is what makes their work theirs.

---

## The honest gap, and only Sotiris can close it

The morgue retrieves. It does not yet **learn**. Measured 2026-09-07: `studies.json` holds 2
recipes and `taste-log.jsonl` holds 1 entry, against a corpus of ~130 images.

```bash
node refs/decide.mjs "<what won>" "<what lost>" "<why, one sentence>"
```

Every skipped call is a judgement that has to be made again from scratch next time. The system
cannot get smarter than the day it was built until the curation is written down - and the
curation is taste, which is the one input no tool here can supply.

**That is the whole design of this thing: the machine handles what is checkable, so the human
only spends judgement where judgement is the actual scarce good.**
