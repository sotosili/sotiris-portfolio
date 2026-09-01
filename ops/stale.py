"""stale.py - find retired names still being presented as live.

The problem this solves, in one line: a change is not finished when the new thing works, it is
finished when the old thing is gone. Announcing a change (ops/CHANGELOG.md) is only half of it.

    python ops/stale.py            scan everything, report, exit 1 on any hit
    python ops/stale.py --list     show what is currently on the retired list

The distinction that decides whether a hit is a bug:

  A file that tells you WHAT TO DO must never name a retired thing.   -> scanned
  A file that RECORDS what happened may name them freely.             -> allowlisted

So HERMES.md and a skill body get scanned; the changelog, the audits and the memory files that
document the deaths do not. When you retire something, add it to RETIRED below in the same pass.
That list is the single home for "this is dead" - do not copy it anywhere else.
"""

import argparse
import json
import os
import re
import sys

# His console is Greek (cp1253) and half these files contain checkmarks and box drawing.
# Without this the checker crashes on its own output, which is a special kind of useless.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except (AttributeError, OSError):
    pass

HOME = os.path.expanduser("~")

# Roots that carry instructions an agent will act on.
ROOTS = [
    os.path.join(HOME, "AGENTS.md"),
    os.path.join(HOME, "CLAUDE.md"),
    os.path.join(HOME, "sotiris-Index"),
    os.path.join(HOME, ".claude", "skills"),
    os.path.join(HOME, ".claude", "SKILLS.md"),
    os.path.join(HOME, "Videos", "AGENTS.md"),
    os.path.join(HOME, "Documents", "SotirisBrain"),
    # Hermes reads from TWO skill stores, and neither was scanned until 2026-08-27.
    # Its own model-router lived here recommending qwen3.5:9b, which does not fit 8 GB at 64K.
    os.path.join(HOME, ".hermes", "skills"),
    os.path.join(HOME, "AppData", "Local", "hermes", "skills"),
]

# Files that are RECORDS, not instructions. They are supposed to name dead things.
ALLOW = [
    r"ops[/\\]CHANGELOG\.md$",
    r"ops[/\\]stale\.py$",
    # Any ops document with a date in its filename is a dated snapshot - a record of what was
    # true that day. It is supposed to name things that have since died.
    r"ops[/\\].*-\d{4}-\d{2}-\d{2}\.md$",
    # A skill whose whole job is teaching you to PROBE providers uses dead model ids as its
    # worked examples. That is a record of a real 404, not an instruction to use one.
    r"llm-provider-verification",
    # An archive/ directory is a record by definition - it is where superseded state goes.
    r"[/\\]archive[/\\]",
    # RESEARCH-*.md are one-off research artefacts: a prompt or a set of actions frozen on the
    # day it was asked. They name what was live then, which is the point of keeping them.
    r"RESEARCH-[A-Z-]+\.md$",
    # Backups are frozen records of a previous state, by definition.
    r"\.bak(-|\.|$)",
    r"\.backup(-|\.|$)",
    r"[/\\]\.git[/\\]",
    r"[/\\]node_modules[/\\]",
    r"[/\\]\.obsidian[/\\]",
]

# what              why it is dead                              retired on
RETIRED = [
    ("stealth/ox-alpha",                "retired; it was ZAI GLM-5.3 Flash",       "2026-08-26"),
    ("deepseek-v4-flash-0731",          "404 on NVIDIA NIM",                       "2026-08-26"),
    ("moonshotai/kimi-k3",              "404 on NVIDIA NIM",                       "2026-08-26"),
    ("kimi-k3",                         "404 on NVIDIA NIM",                       "2026-08-26"),
    ("nemotron-super-49b",              "410 Gone, EOL 2026-08-21",                "2026-08-26"),
    ("llama-3.3-nemotron-super",        "410 Gone, EOL 2026-08-21",                "2026-08-26"),
    # Provider-scoped on purpose. `z-ai/glm-5.2` is 410 Gone on NVIDIA NIM, but
    # `z-ai/glm-5.2:free` on OpenRouter is alive and merely rate-limited (429, verified
    # 2026-08-27). "Dead" is a claim about an endpoint, not about a name.
    ("nvidia/z-ai/glm-5.2",             "410 Gone on NVIDIA NIM, EOL 2026-08-21",  "2026-08-21"),
    ("longcat",                         "Nous-only id; Nous provider removed",     "2026-08-26"),
    ("solar-pro4",                      "Nous-only id; Nous provider removed",     "2026-08-26"),
    ("gemini-2.5-flash",                "404; use gemini-3.6-flash",               "2026-08-27"),
    ("gemini-2.5-flash-lite",           "404; use gemini-3.5-flash-lite",          "2026-08-27"),
    ("minimax-m3:free",                 "Shanghai-hosted as main; breaks data rule", "2026-08-27"),
    ("ComfyUI Cloud",                   "replaced by Cloudflare Workers AI FLUX",  "2026-08-27"),
    # Scoped on purpose: bare "Pencil" collides with the pencil *tool* in drawing
    # code (p5js, svg editors). Retire the phrases that present the APP as live.
    ("Pencil MCP",                     "dropped as design surface 2026-09-01",    "2026-09-01"),
    ("design surface is now Pencil",   "dropped as design surface 2026-09-01",    "2026-09-01"),
    ("Pencil (primary design tool)",   "dropped as design surface 2026-09-01",    "2026-09-01"),
    ("Seedance 2.2",                    "never existed; 2.0 or 2.5",               "2026-08-27"),
]

SKIP_EXT = {".png", ".jpg", ".jpeg", ".gif", ".mp4", ".webm", ".woff", ".woff2",
            ".ttf", ".otf", ".ico", ".pdf", ".zip", ".mov", ".webp", ".svg"}

# A line that names a dead thing AND says it is dead is a record, not an instruction.
# Without this the checker cries wolf on every file that correctly warns you off - and a
# checker that cries wolf gets ignored, which is worse than not having one.
DEATH_MARKERS = re.compile(
    r"(dead|retired|removed|gone|eol|end of life|superseded|replaced|deprecat|"
    r"404|410|do not|don't|never|no longer|stale|wrong|corrected|obsolete|"
    r"redacted|~~|was )", re.I)


def is_record(line):
    return bool(DEATH_MARKERS.search(line))


def allowed(path):
    return any(re.search(p, path) for p in ALLOW)


def walk():
    for root in ROOTS:
        if os.path.isfile(root):
            yield root
        elif os.path.isdir(root):
            for dirpath, dirnames, filenames in os.walk(root):
                dirnames[:] = [d for d in dirnames
                               if d not in (".git", "node_modules", ".obsidian", "dist", ".astro")]
                for fn in filenames:
                    if os.path.splitext(fn)[1].lower() in SKIP_EXT:
                        continue
                    yield os.path.join(dirpath, fn)


def main():
    ap = argparse.ArgumentParser(description="Find retired names still presented as live.")
    ap.add_argument("--list", action="store_true", help="show the retired list and exit")
    ap.add_argument("--hook", action="store_true",
                    help="emit Claude Code hook JSON; SILENT when clean, so it never becomes wallpaper")
    args = ap.parse_args()

    if args.list:
        print(f"{len(RETIRED)} retired names:\n")
        for name, why, when in RETIRED:
            print(f"  {name:<34} {why}  (retired {when})")
        return 0

    hits = []
    scanned = 0
    for path in walk():
        if allowed(path):
            continue
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
        except (OSError, PermissionError):
            continue
        scanned += 1
        for n, line in enumerate(lines, 1):
            if is_record(line):
                continue
            low = line.lower()
            for name, why, when in RETIRED:
                if name.lower() in low:
                    hits.append((path, n, name, why, line.strip()[:96]))
                    break

    by_file = {}
    for path, n, name, why, text in hits:
        by_file.setdefault(path, []).append((n, name, why, text))

    if args.hook:
        # Silence when clean is the whole point. A check that speaks every session gets
        # tuned out, and then it is not a check any more.
        if not hits:
            return 0
        lines = []
        for path in sorted(by_file):
            rel = path.replace(HOME, "~")
            for n, name, why, _ in by_file[path]:
                lines.append(f"{rel}:{n} -> {name} ({why})")
        summary = (f"Stale reference{'s' if len(hits) > 1 else ''}: {len(hits)} in "
                   f"{len(by_file)} file{'s' if len(by_file) > 1 else ''}. "
                   f"Run: python ~/sotiris-Index/ops/stale.py")
        print(json.dumps({
            "systemMessage": summary,
            "hookSpecificOutput": {
                "hookEventName": "SessionStart",
                "additionalContext": (
                    "A retired model, endpoint or tool is still being presented as live in files "
                    "that instruct an agent. Offer to fix these before acting on any of them:\n"
                    + "\n".join(lines)),
            },
        }))
        return 0

    print(f"scanned {scanned} files across {len(ROOTS)} roots\n")

    if not hits:
        print("clean - no retired name is being presented as live.")
        return 0

    print(f"{len(hits)} hit(s) in {len(by_file)} file(s):\n")
    for path in sorted(by_file):
        rel = path.replace(HOME, "~")
        print(rel)
        for n, name, why, text in by_file[path]:
            print(f"  {n:>5}: {name}  ({why})")
            print(f"         {text}")
        print()

    print("Each of these tells an agent to use something that no longer exists.")
    print("Fix the file, or add its path to ALLOW if it is a record rather than an instruction.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
