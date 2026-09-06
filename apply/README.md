# Apply Assistant — human-in-the-loop job-form filler

Fills the boring parts of a job application, drafts the essay parts from your answer bank, and **never submits**. You stay the creative mind and the oversight: review, edit, click Submit yourself.

## One-time setup
Open `apply/profile.json` and fill the two TODOs:
- `fields.phone` — your phone number
- `fields.linkedin` — your LinkedIn URL
(Optional: `fields.resumePath` — absolute path to a PDF résumé to auto-attach.)

Edit any answer in `profile.json` anytime — it updates everywhere.

## Use it
```
node apply/fill.mjs "<application URL>"
```
Example:
```
node apply/fill.mjs "https://jobs.ashbyhq.com/granola/77cf40dd-0a11-4b23-ab9d-ff9d9d1e5f41"
```

What happens:
1. A real browser opens the application form (it auto-clicks "Apply" to reach the form).
2. It **auto-fills** name, email, portfolio/GitHub, location, "how did you hear," "why us," notice period, one-liner, etc.
3. It prints a summary: `✓ FILLED` and `⚠ NEEDS YOU` (essay/personal fields with no canned answer).
4. **It stops. Nothing is submitted.** You review in the browser, edit the NEEDS-YOU fields, and click Submit.
5. Press ENTER in the terminal to close the browser.

## Notes
- Works best on **Ashby, Greenhouse, Lever** public forms (no login needed).
- Tailor per company where it matters: `Why [Company]?`, "first project," and "which brand" answers are drafts — sharpen them.
- It never overwrites a field you already typed in.
- Safe by design: no auto-submit, no logins, no risk of a bot ban — you send every application yourself.
