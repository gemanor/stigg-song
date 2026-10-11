// Time the per-frame cost split: renderFrame (scene + composite) vs grab (JPEG encode + transfer).
// usage: node tools/profile.mjs --only _smoke,hud --t0 0 --n 12 [--scale 1] [--args "--flag --flag"]
import { chromium } from "playwright";
import { serve } from "./serve.mjs";
import { launchOptions } from "./browser.mjs";
const a = Object.fromEntries(process.argv.slice(2).join(" ").split("--").filter(Boolean).map((s) => { const [k, ...v] = s.trim().split(" "); return [k, v.join(" ")]; }));
const { srv, port } = await serve(0);
const lo = launchOptions();
if (process.env.CHROME_ARGS) lo.args = [...lo.args.filter((x) => !x.startsWith("--use-angle") && !x.startsWith("--use-gl")), ...process.env.CHROME_ARGS.split(",")];
const browser = await chromium.launch(lo);
const page = await browser.newPage();
page.on("console", (m) => { if (m.type() === "error") console.log("console:", m.text()); });
const q = new URLSearchParams({ scale: a.scale ?? "1", msaa: "0" });
if (a.only) q.set("only", a.only);
if (a.variant) q.set("variant", a.variant);
await page.goto(`http://127.0.0.1:${port}/engine/index.html?${q}`);
await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 120000 });
const n = +(a.n ?? 12), t0 = +(a.t0 ?? 0);
const res = await page.evaluate(async ({ n, t0 }) => {
  const out = { r: [], g: [] };
  for (let i = 0; i < n; i++) {
    const f = Math.round((t0 + i / 60) * 60);
    let s = performance.now(); await window.renderFrame(f, 60); out.r.push(performance.now() - s);
    s = performance.now(); await window.grab("image/jpeg", 0.94); out.g.push(performance.now() - s);
  }
  return out;
}, { n, t0 });
const med = (x) => x.slice(2).sort((p, q) => p - q)[Math.floor((x.length - 2) / 2)];
console.log(`renderFrame median ${med(res.r).toFixed(0)} ms · grab median ${med(res.g).toFixed(0)} ms · args ${lo.args.filter((x) => x.includes("gl") || x.includes("angle")).join(" ")}`);
await browser.close(); srv.close();
