// Renderiza a cena quadro a quadro com Chromium headless (WebGL por software).
// Uso: node render.js still <t1,t2,...> [W H]   |   node render.js video <outDir> [W H] [fps] [worker nWorkers]
const { chromium } = require("playwright");
const fs = require("fs");
const BASE = "http://localhost:8765/creatives/motion/scene.html";
const ARGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"];

async function open(W, H) {
  const browser = await chromium.launch({ args: ARGS });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE", m.text()); });
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForFunction("window.ready === true", null, { timeout: 120000 });
  return { browser, page };
}

(async () => {
  const [mode, a, b, c] = process.argv.slice(2);
  if (mode === "still") {
    const W = +(b || 720), H = +(c || 1280);
    const { browser, page } = await open(W, H);
    for (const t of a.split(",").map(Number)) {
      await page.evaluate((tt) => window.setTime(tt), t);
      await page.screenshot({ path: `stills/t${String(t).replace(".", "_")}.png` });
      console.log("still", t);
    }
    await browser.close();
  } else if (mode === "video") {
    const out = a; const W = +(b || 720), H = +(c || 1280); const fps = +(process.argv[6] || 30);
    const wi = +(process.argv[7] || 0), wn = +(process.argv[8] || 1);
    fs.mkdirSync(out, { recursive: true });
    const { browser, page } = await open(W, H);
    const total = await page.evaluate("window.TOTAL"); const frames = Math.ceil(total * fps);
    const t0 = Date.now();
    for (let f = wi; f < frames; f += wn) {
      await page.evaluate((tt) => window.setTime(tt), f / fps);
      await page.screenshot({ path: `${out}/f${String(f).padStart(5, "0")}.jpg`, type: "jpeg", quality: 93 });
      if (f % 30 === wi % 30) console.log(`worker ${wi}: frame ${f}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    await browser.close();
  }
})();
