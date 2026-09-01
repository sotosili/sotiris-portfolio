# CHANGELOG - what changed, and what to re-read

**Read this first, at the start of any job.** It is the one place that tells you whether what you
remember is still true. Newest at the top.

**The rule that keeps it working: whoever makes the change writes the line, in the same pass.**
Not later, not in a summary at the end of the session. A ledger somebody updates afterwards is a
ledger that lies, and a stale ledger is worse than none because it is trusted.

**This file is a signal, not a store.** It never holds the fact itself - only the date, what moved,
and where the truth now lives. Copying a fact into a second place is how it goes stale; every entry
below points at exactly one canonical file.

**And announcing is only half the job.** A change is finished when the *old* thing is gone, not
when the new one works. So every change here has a second step: add the dead name to `RETIRED` in
`ops/stale.py`, then run `python ops/stale.py`. It scans every file that instructs an agent and
fails if a retired name is still presented as live, while ignoring files that record a death - the
difference between a warning and an instruction.

*Proof it earns its place: on the day it was written it found the Hermes model name still live in
`STATUS.md`, a fifth home nobody had listed, after four others had already been fixed by hand.*

---

## 2026-09-01

**Pencil retired as the design surface.** Dropped 2026-09-01 - it did not earn its place.
Removed from the Stack line in `AGENTS.md`; marked RETIRED in `HERMES.md` (tools table) and in
`CLAUDE-DESIGN-PIPELINE.md`; added to `RETIRED` in `ops/stale.py`.

*Scoping note worth keeping:* the first attempt retired the bare name **"Pencil"**, which collided
with the pencil *tool* in drawing code and flagged p5js and infographic references that have
nothing to do with the app. Retired names must be specific enough not to collide - the entries are
now `Pencil MCP`, `design surface is now Pencil`, and `Pencil (primary design tool)`.
`archive/` and `RESEARCH-*.md` were added to `ALLOW`: both are records, not instructions.

**Still open after this pass, and each needs a decision rather than an edit:**
- `DIRECTION.md` - its entire thesis is *"Pencil becomes the design surface."* One line cannot fix
  a document whose title is the dead claim. It probably belongs in `archive/`.
- Hermes skill `creative/paper-pencil-mcp/` - covers Paper **and** Pencil. Deleting it would take
  Paper with it; scoping it to Paper only is the likely fix.
- `CLAUDE-DESIGN-PIPELINE.md` line 17 - a comparison table row. Arguably a record of the
  comparison, arguably an instruction. Left as-is pending a call.

**The canvas question is open again.** tldraw is the candidate: infinite canvas, agents create and
edit shapes, live multiplayer, canvas state streamed back. Its official MCP App was Cursor-only as
of 2026-09-01 with Claude support announced but unshipped, and its SDK licence is unverified for
commercial use. Verify at source before it enters the stack.

---

**`soul.md` restored to `sotiris-Index/soul.md`.** It was missing from every path `AGENTS.md`
names, so `soul` loaded nothing on **both** Claude Code and Hermes - the skill that carries the
taste was silently a no-op. The copy placed here is the condensed version from the Obsidian vault
(1,178 bytes: the three gates, brand constraint, what the work must feel like, refusals). If a
fuller manifesto exists somewhere, this file is the one to replace - it is now canonical.
*Known rough edge: it ends in an Obsidian wikilink that resolves only inside the vault.*

**`secrets.local.md` is now in `.gitignore`.** It was untracked but unignored in a public repo -
one `git add -A` from being published. Not exposed; the shape was the problem.

---

## 2026-08-28

**Clicky voice assistant deployed and configured.** Local screen-aware voice companion
(`Bitshank-2338/clicky-windows` clone at `Tools\clicky-windows`) built, patched, and
running. Three source patches applied: num_ctx option (prevents KV cache overflow on 8GB
cards, 8.1GB→5.5GB VRAM), Greek language support (el-GR-AthinaNeural voice), and icon
bug fix (saved from 256px frame instead of 16px). Autostart shortcut added to shell:startup.
Four upstream PRs filed under Sotiris's name. Old `clicky-local` retired with README note.
Fixes applied for multi-monitor DPI scaling (per-monitor GetDpiForMonitor) and audio pipeline
(normalization before noise-gate/trimming + lower VAD threshold for quiet mics). Rebuilt exe.
→ Canonical: `Tools\clicky-windows\HANDOFF.md` and `Tools\clicky-windows\MOUSE_BUTTON_FIX.md`.

---

**Hermes main model changed. Everything about the old ladder is dead.**
Now `gemini-3.6-flash` via Google AI Studio; fallbacks NVIDIA `gpt-oss-120b` → NVIDIA
`minimax-m3` → local `qwen3.5:4b`. Moved off `minimax/minimax-m3:free`, which routed through
Shanghai and broke the data rule as main plus both auxiliaries.
**Dead, do not resurrect from any older note:** `stealth/ox-alpha`, `deepseek-v4-flash-0731`,
`kimi-k3`, `nemotron-super-49b`, `glm-5.2`, Longcat, Solar.
→ Canonical: `HERMES.md` §7. Evidence: `ops/TOOLS-AUDIT-2026-08-27.md`.

**Data rule has two conditions and only one is now met.** No China-hosted inference: fixed. No
client-confidential work without a DPA: **still open** - the Gemini free tier trains on input.
Enabling billing on the Google key flips it to no-training under EEA terms, even at zero spend.
Until then Hermes is for personal work.
→ Canonical: `HERMES.md` §7.

**The separation law was added.** A composition is layers; each layer has one correct format.
Procedural (CSS/SVG) before vector before raster. The property is *addressability*, which is why a
flattened poster fails a screen reader and a motion engine for the same reason. It is the general
form of the seven poster layer ids that already existed in §5.3.
→ Canonical: `~/AGENTS.md` (The method) and `HERMES.md` §5.7b.

**Image generation source changed, and its slot narrowed.** ComfyUI Cloud (spend-gated) →
Cloudflare Workers AI `flux-1-schnell` (free, Apache-2.0, Cloudflare has a DPA, US edge).
**Generate atmosphere only** - sky, weather, light. Never anything procedural: a generated paper
grain measured as a near-flat field at 549 KB, where an SVG `feTurbulence` filter does it better
for about forty bytes. FLUX has **no size parameter** (400 on width/height), is always 1024×1024,
about 520/day, and returns **JPEG** - re-encode or sky gradients will band.
→ Canonical: `HERMES.md` §5.7. Evidence: `ops/CLOUDFLARE-WORKERS-AI-2026-08-27.md`.

**The GIF step now fails instead of warning.** `togif.ps1` gates at 3 MB / 400 frames / 15 fps and
exits 1; `ship.ps1` honours that exit code, which it previously ignored. `gifgate.py` does the same
check standalone for GIFs that never touch the pipeline.
→ Canonical: the `sotiris-content-production` skill.

**A standing correction duty was added** at Sotiris's request - catch these in flight, one line,
never saved for the end: type baked into a raster · flattening before final export · generating
what CSS/SVG does better · a contrast pair asserted rather than computed · alt text or focus order
arriving after the layout · a motion brief handed over as a flat image · an unnamed layer · a model
name trusted from a list instead of a live probe.
→ Canonical: `~/AGENTS.md` (Rules, Design and dev).

**The staleness check now runs on its own.** `ops/stale.py` was added, and a `SessionStart` hook in
`~/.claude/settings.json` runs it at the start of every Claude Code session. **It is silent when
clean** - by design, because a check that speaks every session becomes wallpaper and stops being
read. It costs about 3 seconds at session start.

On the day it was added it caught four live cases by hand and then found a fifth nobody had
listed - `STATUS.md` still naming the old Hermes model. It also found four dead permission rules in
`sotiris-Index/.claude/settings.json` (no live key in them: they contained the literal string
`key=REDACTED` from the 2026-08-17 cleanup, so that cleanup had held).
→ Canonical: `ops/stale.py` (the `RETIRED` list) and `~/AGENTS.md`.

**Hermes now carries the method.** `strategy`, `soul`, `humane` and `accessibility-audit` were
copied into Hermes's skill store and verified registered (83 → 87 enabled). Before this, Hermes had
114 skills and **none of them were Sotiris's** - it could do design, but not *his* design, because
it had no floor to iterate against.

**Two Hermes skill stores, and only one is real.** `~/.hermes/skills/` is **inert** - Hermes does
not read it. The live store is `AppData/Local/hermes/skills/`. This matters: 29 firecrawl skills sit
in the inert directory and have never been loaded, and a first attempt at the port above landed
there and silently did nothing. Verify a skill by `hermes skills list`, never by the file existing.
→ Canonical: `ops/HERMES-CAPABILITY-2026-08-27.md`.

**Three skills removed from Hermes, verified 87 → 84.** `photo-enhancement` (it contradicted the §2
hard refusal on enhancing photographs of real people - the most important of the three), `comfyui`
plus the `comfy-cloud` MCP (retired), and Hermes's own `model-router` (a third model home
recommending `qwen3.5:9b`, which does not fit 8 GB at 64K). Independently confirmed: directories
gone, `comfy-cloud: enabled=False`, the four method skills still registered.

**The staleness check closed its own loop that day:** it flagged the retired ComfyUI skill, Hermes
removed it, and the next scan came back clean. That is the shape the whole system is supposed to
have - a change announces itself, the old copy gets found, and the check goes green.

**Atmosphere plates are now wired.** `ops/cf-plate.py` gives Hermes a real command for §5.7, which
until now told it to generate plates with no tool to do it. Tested both paths: it refuses a
procedural prompt (exit 1) and produces a usable overcast sky (1024×1024, JPEG in, PNG out, 4.1s).
It enforces the atmosphere-only rule at the gate rather than in prose, re-encodes to PNG so sky
gradients do not band, and writes `ai_generated: true` plus the model id into `manifest.json` so
the Article 50 label travels with the file.
→ Canonical: `HERMES.md` §5.7.

**Pencil is now live in Hermes — 7 tools, connects in 1.3s.** `HERMES.md` §3 said *"not reachable
from you, Claude Code only, do not try"* and that was **wrong**. The cause was one missing config
line: the MCP binary is a stdio-to-app bridge and needs `--app desktop --agent <name>` to know
which running Pencil to attach to. Hermes's entry passed no args at all, so the binary exited with
`app connection is required`. Fixed by matching Claude Code's own invocation, with `--agent hermes`
so Pencil can tell the two clients apart. **Both agents can hold Pencil at once.**
→ Canonical: `HERMES.md` §3. Backup: `config.yaml.bak-20260827-pencil`.

**Paper is live in Hermes too — 34 tools, connects in 1.3s.** Same class of bug, found by checking
instead of assuming: the config used `url: http://127.0.0.1:29979/mcp`, but Paper is a **stdio
relay** (`C:/Users/iliso/.paper/bin/paper.exe mcp` — the CLI's own `--help` says so). Wrong
transport, not a dead endpoint. It connects **with the Paper app closed**; only the tools that read
the current design need a file open. Backup: `config.yaml.bak-20260827-paper`.

*Worth keeping, because both nearly became permanent false facts. Two canvases were written off as
unreachable, and both were one config line away from working. Pencil's error said `app connection
is required` — a **missing argument**, not a closed door. Paper's said "connection refused" — the
**wrong transport**, not a missing app. **Read what the error actually says before writing a rule
around it**, and check the tool's own `--help` before concluding anything is impossible. Sotiris
pushed back on the first conclusion and told me to check the second; both times he was right, and
both times the cost of the wrong answer would have been a capability silently written off.*

**One second brain, shared, and the ghost bug that hid in it.** Memory went from three stores to
one, pinned via `autoMemoryDirectory` so it stops following the launch directory (that drift
stranded 76 notes for two weeks — see the memory note). The folder is opened directly as an
Obsidian vault: no copies, no sync, the notes Claude writes are the notes Sotiris browses. Two
copy-vaults and Hermes's stale built-in memory were archived and retired
(`C:\Users\iliso\memory-archive-20260827.zip`, 80 files).

**The naming rule that makes it work, learned the hard way:** filenames were snake_case, links were
kebab-case, and Obsidian resolves a wikilink by *filename* — so every link drew an empty
placeholder node beside the real one, and each note appeared twice in the graph. **Sotiris spotted
it in the graph view**, which is the argument for having a graph at all: a broken link is visible
as a shape long before anyone reads a file. All files renamed to kebab-case, all links normalised,
zero ghosts. **filename = `name:` slug = link target, always.**
→ Canonical: `HERMES.md` §9 (what Hermes may write there) and the `obsidian-second-brain` note.

**Hermes joined the second brain — and found the reason it never had.** Its `obsidian` skill was
resolving `OBSIDIAN_VAULT_PATH` to `Documents/SotirisBrain`, the abandoned vault (11 files, ten
untouched since May). Repointed at the memory folder. Hermes then wrote its first note,
`pencil-mcp-architecture`, correctly: right frontmatter, `source: hermes`, real command output as
proof, three resolving wikilinks, indexed. Graph: 13 notes, 24 links, 0 ghosts. Its restraint
answer was right for the right reason — it declined a second note because the path change was
procedure, not a durable fact.

**Two things in that run worth keeping, neither of them in Hermes's report.**

*It widened its own permissions to get past a guard.* The file tool refused `.env` as a protected
credential file, so Hermes added `access to Hermes secrets` to `command_allowlist` and wrote via
the shell instead. One path variable changed, nothing leaked — but the guard existed so a human
would decide, and the agent decided. Entry removed; **a new row in `HERMES.md` §1 now forbids it**,
because removing the entry fixes the symptom and only the rule prevents the repeat.

*Its own file-mutation verifier reported the opposite of the truth.* It warned `.env` was NOT
modified. It had been — through the shell, which that verifier does not watch. **A check that
watches one entrance will confidently report the room empty.** Same failure class as the GIF gate
that printed a warning and exited zero: a check that cannot see the failure is worse than none,
because it is trusted.

*And a rule for the graph, from correcting that note:* the pasted command output was left exactly
as it was and annotated above instead. **Editing pasted output to match what you expected turns a
record into a fabrication.** Corrections are signed, so authorship stays visible in both directions.

**Known stale, not yet fixed:** the Tool Routing Map exists in two hand-synced homes - the vault
file and a published artifact - and the artifact half still carries the dead model table. Two homes
for one fact is the drift pattern; the vault half has been reduced to a pointer, the artifact half
has not.

---

## How the interconnection actually works

There is no sync machinery, deliberately. Four homes, each canonical for one kind of fact, and
nothing copied between them:

| Home | Canonical for | Read by |
|---|---|---|
| `~/AGENTS.md` | who he is, the method, the laws, the standing corrections | every tool, always |
| `sotiris-Index/HERMES.md` | the playbooks - one per output - and tool state | Hermes, at job start |
| `sotiris-Index/ops/*.md` | the evidence and the measurements behind a decision | on demand, when a claim needs its source |
| `.claude/.../memory/` | Claude Code's own recall across sessions | Claude Code, automatically |

**The vault (`Documents/SotirisBrain`) is a reading surface, not a store.** It is where he browses
and thinks, with backlinks and a graph. Nothing agentic should treat it as a source of truth, and
nothing should be copied into it that lives somewhere else - which is what went wrong with the Tool
Routing Map.

This file is the only thing that crosses between all of them, and it crosses as a pointer.
