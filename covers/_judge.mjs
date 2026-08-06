// THE LOCAL EYE — pairwise design judgement with no API key.
//
// WHY THIS EXISTS. Design Tree's whole claim is "no API keys, no paid services" - and §6 was the
// one place that was not true. Every pairwise verdict went to Gemini. One remote dependency in an
// otherwise local pipeline is the dependency that decides what ships, which makes it the worst one
// to leave in.
//
// WHY A 7B MODEL CAN PLAUSIBLY DO THIS. It could not replace Gemini at scoring - but we never ask
// for a score. The architecture asks exactly one question: "A or B, or reject both?" Ranking is a
// far easier task than absolute aesthetic judgement, which is precisely why scoring was dropped
// (the same brief scored 4,3,4,4,4 across five materially different versions). A small local model
// forced into a binary comparison is a much better bet than the same model asked to rate /10.
//
// ── THE EXPERIMENT RAN. 2026-08-04. RESULT: IT CANNOT JUDGE. ────────────────────────────────────
//
// Qwen2.5-VL 7B, local, on the real Design Tree A/B pair. Three tests:
//
//   1. FULL CRITIQUE PROMPT (5 questions + committed verdict)
//      Unstable across identical runs: REJECT, REJECT, REJECT, REJECT, B. Worse, it contradicted
//      ITSELF inside a single answer - "2. VERDICT: A" mid-prose, "VERDICT: REJECT BOTH" at the
//      end. Its critique was textbook filler: "more balanced white space", "clearer hierarchy",
//      "a more varied colour palette" - phrases that fit any design and change nothing.
//
//   2. BARE RANK-ONLY PROMPT ("A or B, one line")
//      5/5 identical: A. Looked like a win.
//
//   3. THE SWAP TEST - the one that mattered.
//      Rebuilt the same sheet with the candidates exchanged, so the better design was now on the
//      RIGHT. It answered A five times again. It is not ranking the work; it is choosing the
//      LEFT-HAND IMAGE. The "5/5 stability" in test 2 was the stability of a position preference.
//      Without this test the result would have read "stable, agrees with Gemini, ship it" - and
//      every pair logged from it would have been noise dressed as taste.
//
//   4. PERCEPTION CONTROL - and this is the salvage.
//      Asked about each image ALONE it is accurate: it read "382" and "PIXELS OF HEADLINE
//      OFF-CANVAS" off one, "GOAL IN. POSTER OUT." off the other. It SEES perfectly well.
//
// CONCLUSION: this model is a good DESCRIBER and a bad JUDGE. Perception works; comparison
// collapses to position; critique collapses to generic advice. So it does NOT replace the remote
// eye at §6, and Design Tree's "no API keys" claim must stay honest: the PIPELINE is zero-API,
// the final external critique is not.
//
// WHAT IT IS ACTUALLY GOOD FOR: `describe()` below. The deepest failure in this whole project was
// that nobody LOOKED at the render - nine DOM checks passed a headline reading "NOT REACI". A
// local model that reliably reads what is on the canvas is a free, offline perception check for
// exactly that class of bug. That is a fact-check, not a taste judgement, and it must never be
// presented as one.
//
// STILL OPEN: PosterReward's pairwise variant is purpose-trained for this and would not have the
// position bias, but wants vLLM and ~16GB VRAM. Randomising A/B position per call does not rescue
// a pure position bias - it just converts it into a coin flip.
//
//   node covers/_judge.mjs ask content-assets/_compare.png "<brief>"
//   node covers/_judge.mjs agree            # replay refs/taste-log.jsonl, measure agreement
//
// Requires Ollama running locally (it starts on demand) and a vision model pulled:
//   ollama pull qwen2.5vl:7b        6.0GB  - better judgement, fits an 8GB card with little room
//   ollama pull qwen2.5vl:3b        3.2GB  - the safe fallback if 7B thrashes

import fs from 'node:fs';
import path from 'node:path';

const HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
export const DEFAULT_MODEL = process.env.DESIGN_TREE_VLM || 'qwen2.5vl:7b';

// The question, kept identical to the remote prompt in _select.mjs. If the two judges are asked
// different questions, an agreement number means nothing.
export const PAIRWISE_PROMPT = (brief) => `You are a hard-nosed art director reviewing two candidates for the same brief. A is on the LEFT, B is on the RIGHT. Do NOT give a score out of 10 - give a judgement.

BRIEF: ${brief}

Answer bluntly, in order, and keep each answer to one or two sentences:
1. If someone told you an AI made these, would you believe it? Name the specific tells.
2. Which is better, A or B - or do you reject both? Commit to ONE answer, no hedging.
3. What is the single weakest decision in the one you chose?
4. Where does it look like a template with the colours swapped?
5. Three concrete craft decisions a great designer would have made instead.

End your reply with exactly one line in this format, nothing after it:
VERDICT: A
or
VERDICT: B
or
VERDICT: REJECT BOTH`;

export async function isUp() {
  try {
    const r = await fetch(`${HOST}/api/tags`, { signal: AbortSignal.timeout(3000) });
    return r.ok;
  } catch { return false; }
}

export async function models() {
  try {
    const r = await fetch(`${HOST}/api/tags`);
    const j = await r.json();
    return (j.models || []).map((m) => m.name);
  } catch { return []; }
}

export async function ask({ imagePath, prompt, model = DEFAULT_MODEL, timeoutMs = 600_000 }) {
  if (!(await isUp())) {
    throw new Error(
      `Ollama is not reachable at ${HOST}.\n`
      + `  Start it (it usually runs on login) or: ollama serve\n`
      + `  Then: ollama pull ${model}`);
  }
  const b64 = fs.readFileSync(path.resolve(imagePath)).toString('base64');
  const res = await fetch(`${HOST}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      images: [b64],
      stream: false,
      options: {
        // Near-greedy. A judge that answers differently on re-run cannot be measured against
        // another judge - and the agreement experiment below depends on that being stable.
        temperature: 0.1,
        num_predict: 700,
        // OLLAMA DEFAULTS TO A 4096-TOKEN CONTEXT AND SILENTLY 400s WHEN AN IMAGE EXCEEDS IT.
        // First run: "request (4281 tokens) exceeds the available context size (4096)". Qwen2.5-VL
        // itself handles 125K; the ceiling is Ollama's default, not the model's. A side-by-side
        // comparison sheet is a big image, so this must be raised or the local judge cannot see a
        // pair at all. Every extra token of context also costs VRAM, and this has to share an 8GB
        // card with a 6GB model - so raise it deliberately, not to the maximum.
        num_ctx: 16384,
      },
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`ollama ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  return {
    text: j.response || '',
    model,
    // ns -> s. Worth printing: if this is slower than a network round-trip, "local" has no
    // practical advantage beyond privacy and cost, and that should be visible rather than assumed.
    seconds: Math.round(((j.total_duration || 0) / 1e9) * 10) / 10,
  };
}

// Pull the committed answer out of the prose. Deliberately strict: an unparseable verdict returns
// null rather than a guess, because a fabricated agreement number is worse than a missing one.
export function parseVerdict(text) {
  // TAKE THE LAST MATCH, NOT THE FIRST. The prompt asks for a committed VERDICT line at the END,
  // but the model also answers question 2 inline as "2. VERDICT: A" - so a first-match parser
  // reads the mid-prose answer and silently ignores the one the model was told to commit to. If
  // the model ever changes its mind between the two, a first-match parser reports the wrong
  // verdict and any agreement statistic built on it is fiction.
  const all = [...String(text).matchAll(/VERDICT:\s*(A|B|REJECT BOTH)\b/gi)];
  if (!all.length) return null;
  const v = all[all.length - 1][1].toUpperCase();
  return v === 'REJECT BOTH' ? 'REJECT' : v;
}

// THE PERCEPTION CHECK — the thing this model is genuinely good at, and free.
//
// Not a judgement. It answers "what does the canvas actually SAY?" so a headline that renders as
// "NOT REACI" is caught before shipping, without a human having to squint at every thumbnail. Feed
// it the -at360.png, because the point is what survives at the size the reader gets.
//
//   const r = await describe({ imagePath: 'out/x-at360.png', expect: 'TOLD. NOT REACHED.' });
//   if (r.mismatch) -> look at it yourself, something is clipped or covered
export async function describe({ imagePath, expect = '', model = DEFAULT_MODEL }) {
  const prompt = expect
    ? `Read this poster. Transcribe EXACTLY the largest headline text you can see, character for character, including any word that appears cut off. Reply with only the transcription, nothing else.`
    : `In one sentence: what is the largest element on this poster, and what does the headline say?`;
  const r = await ask({ imagePath, prompt, model });
  const seen = r.text.trim().replace(/\s+/g, ' ');
  const norm = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return {
    ...r,
    seen,
    // Deliberately a WARNING, never a gate. The model can misread, and a false block is worse than
    // a false pass here - this exists to send a human to the image, not to replace one.
    mismatch: expect ? !norm(seen).includes(norm(expect)) : false,
  };
}

export async function pairwise({ sheetPath, brief, model = DEFAULT_MODEL }) {
  const r = await ask({ imagePath: sheetPath, prompt: PAIRWISE_PROMPT(brief), model });
  return { ...r, verdict: parseVerdict(r.text) };
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────
if (import.meta.url === (await import('node:url')).pathToFileURL(process.argv[1] || '').href) {
  const [cmd, ...rest] = process.argv.slice(2);

  if (cmd === 'ask') {
    const [sheet, ...briefWords] = rest;
    if (!sheet) { console.log('usage: node covers/_judge.mjs ask <compare.png> "<brief>"'); process.exit(1); }
    const have = await models();
    console.log(`ollama: ${HOST}  models: ${have.join(', ') || '(none pulled)'}`);
    const r = await pairwise({ sheetPath: sheet, brief: briefWords.join(' ') || 'unspecified brief' });
    console.log(`\n--- ${r.model}  (${r.seconds}s)\n`);
    console.log(r.text.trim());
    console.log(`\nPARSED VERDICT: ${r.verdict ?? '(unparseable - the model did not commit)'}`);
    process.exit(0);
  }

  if (cmd === 'check') {
    console.log(`ollama up: ${await isUp()}`);
    console.log(`models: ${(await models()).join(', ') || '(none)'}`);
    process.exit(0);
  }

  console.log(`usage:
  node covers/_judge.mjs check
  node covers/_judge.mjs ask <compare.png> "<brief>"`);
}
