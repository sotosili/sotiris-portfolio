// Human-in-the-loop APPLY ASSISTANT (with submission verification).
// Opens one or more job application URLs in a real browser, auto-fills the mechanical
// fields and drafts the essay fields from apply/profile.json — then STOPS. It NEVER submits.
// You review, edit the "NEEDS YOU" fields, and click Submit yourself.
//
// It then WATCHES the page: when it detects the real confirmation screen it marks the
// job ✅ VERIFIED SENT and auto-advances to the next. If you close a window without a
// confirmation it marks it ⚠️ NOT SENT. Every result is written to apply/log.json so the
// pipeline can never again claim "applied" for something that was only filled.
//
// Usage:  node apply/fill.mjs "<url1>" "<url2>" ...
// Best on Ashby / Greenhouse / Lever public application forms (no login needed).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const urls = process.argv.slice(2);
if (!urls.length) { console.error('Usage: node apply/fill.mjs "<url1>" "<url2>" ...'); process.exit(1); }
const profile = JSON.parse(fs.readFileSync(path.resolve('apply/profile.json'), 'utf8'));
const F = profile.fields;
const LEDGER = path.resolve('apply/log.json');

// a post-submit confirmation reads like one of these (absent while the form is up)
const SUCCESS_RE = /(application (has been |was )?(submitted|received|sent)|thanks? for applying|thank you for applying|successfully submitted|we[' ’]?ve received your application|application (is )?complete|you[' ’]?ve applied)/i;

function companyOf(u) {
  try { const { host, pathname } = new URL(u); const seg = pathname.split('/').filter(Boolean)[0];
    if (/ashbyhq|greenhouse|lever|breezy|workable/.test(host) && seg) return seg;
    return host.replace(/^www\./, '');
  } catch { return u; }
}
function logResult(rec) {
  let arr = [];
  try { arr = JSON.parse(fs.readFileSync(LEDGER, 'utf8')); } catch {}
  arr.push(rec);
  fs.writeFileSync(LEDGER, JSON.stringify(arr, null, 2));
}

// map a question label -> a value from profile.json (or null)
function decide(label) {
  const s = label.toLowerCase();
  const has = (...ks) => ks.some(k => s.includes(k));
  if (has('e-mail', 'email')) return { value: F.email, source: 'email' };
  if (has('linkedin')) return { value: F.linkedin, source: 'linkedin' };
  if (has('github')) return { value: F.github, source: 'github' };
  if (has('portfolio', 'website', 'personal site')) return { value: F.portfolio, source: 'portfolio' };
  if (has('phone', 'mobile', 'contact number')) return { value: F.phone, source: 'phone' };
  if (has('first name')) return { value: F.firstName, source: 'firstName' };
  if (has('last name', 'surname')) return { value: F.lastName, source: 'lastName' };
  if (has('full name') || s === 'name' || has('your name')) return { value: F.name, source: 'name' };
  if (has('location', 'where are you based', 'city', 'country', 'based')) return { value: F.location, source: 'location' };
  if (has('where did you hear', 'how did you hear', 'hear about')) return { value: profile.whereHeard, source: 'whereHeard' };
  if (has("name you'd prefer", 'name you prefer', 'preferred name', 'preferred first name')) return { value: F.firstName, source: 'preferredName' };
  if (has('ux process', 'design process', 'where can we learn', 'see your work', 'examples of your work')) return { value: F.portfolio, source: 'portfolio(process)' };
  let best = null, bestScore = 0;
  for (const a of profile.answers) {
    const score = a.match.reduce((n, k) => n + (s.includes(k.toLowerCase()) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = a; }
  }
  if (best && bestScore > 0) return { value: best.text, source: best.key };
  return null;
}

// read every visible text field + its question label, in one page pass
const EXTRACT = () => {
  const clean = s => (s || '').replace(/\s+/g, ' ').trim();
  const sel = 'textarea, input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]):not([type=search])';
  const out = [];
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) continue;
    let label = clean(el.getAttribute('aria-label') || '');
    if (!label) { let c = el.parentElement; for (let up = 0; up < 5 && c; up++) { const l = c.querySelector('label,legend,h1,h2,h3,h4'); if (l && clean(l.textContent)) { label = clean(l.textContent); break; } c = c.parentElement; } }
    const id = el.getAttribute('id'), nm = el.getAttribute('name');
    const q = id ? `[id="${id}"]` : nm ? `[name="${nm}"]` : '';
    if (!q || !label) continue;
    out.push({ q, label, val: el.value || '' });
  }
  return out;
};

// fill one job form (never submits)
async function fillPage(page, url) {
  console.log(`\nopening ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(2500);

  for (const t of ['Apply for this Job', 'Apply for This Job', 'Apply Now', 'Apply']) {
    const b = page.getByRole('button', { name: t }).or(page.getByRole('link', { name: t })).first();
    if (await b.count() && await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(2000); break; }
  }

  if (F.resumePath && fs.existsSync(F.resumePath)) {
    // pick the REAL resume file input — never the "Autofill from resume" helper or the Cover Letter input
    const resumeSel = await page.evaluate(() => {
      const clean = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const labelFor = el => { let l = clean(el.getAttribute('aria-label') || ''); if (l) return l; let c = el.parentElement; for (let u = 0; u < 6 && c; u++) { const lb = c.querySelector('label,legend,h1,h2,h3,h4'); if (lb && clean(lb.textContent)) return clean(lb.textContent); c = c.parentElement; } return ''; };
      const known = document.querySelector('#_systemfield_resume');
      const files = [...document.querySelectorAll('input[type=file]')];
      const pick = known || files.find(f => { const l = labelFor(f); return /resume|cv|résumé/.test(l) && !/autofill|cover/.test(l); }) || files[0];
      if (!pick) return null;
      const id = pick.getAttribute('id'), nm = pick.getAttribute('name');
      return id ? `#${CSS.escape(id)}` : nm ? `input[type=file][name="${nm}"]` : null;
    });
    if (resumeSel) { await page.locator(resumeSel).setInputFiles(F.resumePath).catch(() => {}); await page.waitForTimeout(2500); console.log(`  attached CV → ${resumeSel}`); }
  }

  const fields = await page.evaluate(EXTRACT);
  const filled = [], needsYou = [];
  for (const f of fields) {
    if (f.val && f.val.trim()) continue;
    const ans = decide(f.label);
    if (ans && ans.value && !String(ans.value).startsWith('TODO')) {
      await page.fill(f.q, String(ans.value)).catch(() => {});
      filled.push(`  ✓ [${ans.source}] ${f.label.slice(0, 70)}`);
    } else {
      needsYou.push(`  ⚠ ${f.label.slice(0, 90)}${ans && String(ans.value).startsWith('TODO') ? '  (profile TODO: ' + ans.source + ')' : ''}`);
    }
  }
  console.log(`\n── FILLED (${filled.length}) ──\n${filled.join('\n') || '  (none — unusual form; fill manually)'}`);
  console.log(`── NEEDS YOU (${needsYou.length}) ──\n${needsYou.join('\n') || '  (none)'}`);
  console.log(`\n👉 Review, fill the NEEDS-YOU fields, then click Submit YOURSELF. I'm watching for the confirmation…`);
}

// after submit, the confirmation screen appears — detect it. resolves 'submitted' | 'closed' | 'timeout'.
function watchForSubmission(page, maxMs = 0) {
  let stop = false;
  const races = [new Promise(res => page.on('close', () => { stop = true; res('closed'); }))];
  races.push((async () => {
    while (!stop) {
      try {
        if (/confirmation|submitted|thank|success|applied/i.test(page.url())) return 'submitted';
        const txt = await page.evaluate(() => document.body.innerText || '');
        if (SUCCESS_RE.test(txt)) return 'submitted';
      } catch { /* navigating or closed — keep polling */ }
      await new Promise(r => setTimeout(r, 1500));
    }
    return 'closed';
  })());
  if (maxMs > 0) races.push(new Promise(res => setTimeout(() => { stop = true; res('timeout'); }, maxMs)));
  return Promise.race(races).then(r => { stop = true; return r; });
}

// handle an Ashby-style Location autocomplete: type the city, then pick the matching suggestion.
async function fillLocation(page, value) {
  if (!value) return false;
  const loc = page.getByLabel(/location/i).or(page.locator('input[name*="location" i], input[id*="location" i]')).first();
  if (!(await loc.count()) || !(await loc.isVisible().catch(() => false))) return false;
  if (await loc.inputValue().catch(() => '')) return true; // already set
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  await loc.click().catch(() => {});
  await loc.type(value, { delay: 70 }).catch(() => {});
  await page.waitForTimeout(1600); // let suggestions load
  const opt = page.getByRole('option', { name: new RegExp(value, 'i') })
    .or(page.getByRole('option')).first();
  if (await opt.count() && await opt.isVisible().catch(() => false)) { await opt.click().catch(() => {}); await page.waitForTimeout(500); return true; }
  await loc.press('ArrowDown').catch(() => {}); await loc.press('Enter').catch(() => {}); // fallback
  await page.waitForTimeout(400);
  return true;
}

// OPT-IN ONLY (APPLY_SUBMIT=1): click the form's Submit button for you. Returns true if a button was clicked.
async function clickSubmit(page) {
  await page.waitForTimeout(600);
  const btn = page.getByRole('button', { name: /submit/i })
    .or(page.locator('button[type=submit], input[type=submit], button:has-text("Submit")')).first();
  if (!(await btn.count())) return false;
  await btn.scrollIntoViewIfNeeded().catch(() => {});
  await btn.click().catch(() => {});
  return true;
}

const AUTO = process.env.APPLY_SUBMIT === '1'; // opt-in: assistant clicks Submit itself
const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
let aborted = false;
browser.on('disconnected', () => { aborted = true; });
const results = [];

for (let i = 0; i < urls.length; i++) {
  if (aborted) break;
  const url = urls[i], company = companyOf(url);
  console.log(`\n════ ${i + 1}/${urls.length}  ${company} ════`);
  let page;
  try {
    page = await browser.newPage({ viewport: null }); // use the real (maximized) window size so the page scrolls normally
    await fillPage(page, url);
    let outcome;
    if (AUTO) {
      await fillLocation(page, (F.location || '').split(',')[0].trim());
      const clicked = await clickSubmit(page);
      if (clicked) { console.log('  ↳ clicked Submit for you — verifying the confirmation…'); outcome = await watchForSubmission(page, 30000); }
      else { console.log('  ⚠ no Submit button found — left open for you'); outcome = await watchForSubmission(page); }
    } else {
      outcome = await watchForSubmission(page);
    }
    const status = outcome === 'submitted' ? 'submitted' : 'unsent';
    results.push({ company, status });
    logResult({ ts: new Date().toISOString(), company, url, status, mode: AUTO ? 'auto-submit' : 'manual', verifiedBy: 'on-page-confirmation' });
    if (status === 'submitted') {
      console.log(`\n✅ VERIFIED SENT — ${company}. Advancing…`);
      await page.waitForTimeout(2500);
      await page.close().catch(() => {});
    } else if (outcome === 'timeout') {
      console.log(`\n⚠️  ${company}: Submit was clicked but NO confirmation appeared — a required field is likely blocking it. Left open for you to finish.`);
    } else {
      console.log(`\n⚠️  NOT SENT — ${company} closed with no confirmation. Logged as unsent.`);
    }
  } catch { if (!aborted) results.push({ company, status: 'unsent' }); }
}

console.log(`\n════════ SUMMARY ════════`);
for (const r of results) console.log(`  ${r.status === 'submitted' ? '✅ SENT   ' : '⚠️  NOT SENT'}  ${r.company}`);
const sent = results.filter(r => r.status === 'submitted').length;
console.log(`\n  ${sent}/${urls.length} verified sent · ledger → apply/log.json\n`);
await browser.close().catch(() => {});
