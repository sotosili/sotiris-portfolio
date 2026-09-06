// Render a cover-letter HTML file to a print-ready PDF (code-rendered, $0).
// Usage: node apply/make-cover-pdf.mjs apply/cover-letters/<name>.html
import { chromium } from 'playwright';
import path from 'node:path';
const input = process.argv[2];
if (!input) { console.error('usage: node apply/make-cover-pdf.mjs <file.html>'); process.exit(1); }
const abs = path.resolve(input);
const out = abs.replace(/\.html?$/i, '.pdf');
const url = 'file:///' + abs.replace(/\\/g, '/');
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
await p.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
await b.close();
console.log('PDF →', out);
