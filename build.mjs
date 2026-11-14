// Builds index.html: src/app.html with pdf.js embedded, so the app is one self-contained file.
// Only needed after changing src/app.html.  Run:  node build.mjs
import { readFileSync, writeFileSync } from "node:fs";

const dir = new URL("./", import.meta.url);
const read = p => readFileSync(new URL(p, dir), "utf8");
const PDFJS = "vendor/pdfjs-4.10.38/";

const app = read("src/app.html");
const worker = read(PDFJS + "pdf.worker.min.mjs");
const lib = read(PDFJS + "pdf.min.mjs");
for (const [name, code] of [["worker", worker], ["lib", lib]])
  if (/<\/script|<!--/i.test(code)) throw new Error(`pdf.js ${name} contains text that would break inline <script>`);
if (!app.includes("<!--PDFJS-->")) throw new Error("placeholder <!--PDFJS--> missing in src/app.html");

// pdf.js 4.10.38 (Apache-2.0, Mozilla). Worker first: it sets globalThis.pdfjsWorker so pdf.js runs
// in the page without a separate worker file (works from file:// too).
const embed = `<!-- pdf.js 4.10.38 (legacy build), Apache License 2.0, https://github.com/mozilla/pdf.js -->
<script type="module">${worker}</script>
<script type="module">${lib}</script>`;
const out = app.replace("<!--PDFJS-->", () => embed);   // function form: no $-pattern substitution
writeFileSync(new URL("index.html", dir), out);
console.log(`index.html written (${(out.length / 1024 / 1024).toFixed(2)} MB)`);
