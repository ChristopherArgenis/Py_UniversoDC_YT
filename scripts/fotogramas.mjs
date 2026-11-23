// Renderiza muchos fotogramas de una composición con UN solo bundle (mucho más rápido que N `remotion still`).
//   node scripts/fotogramas.mjs <composición> <marcas.json> <carpeta-salida> [escala]
// marcas.json = [[frame, "etiqueta"], ...]. Lo usa scripts/revisar_fotogramas.py.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [comp, marcasRuta, salida, escala = "0.5"] = process.argv.slice(2);
const marcas = JSON.parse(fs.readFileSync(marcasRuta, "utf8"));
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const opciones = fs.existsSync(browserExecutable) ? { browserExecutable } : {};
fs.mkdirSync(salida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: comp, ...opciones });
for (const [frame, etiqueta] of marcas) {
  const f = Math.max(0, Math.min(composition.durationInFrames - 1, frame));
  const out = path.join(salida, `${String(f).padStart(6, "0")}_${etiqueta.replace(/[^\w:-]/g, "_")}.png`);
  await renderStill({ composition, serveUrl, output: out, frame: f, scale: Number(escala), ...opciones });
  process.stdout.write(".");
}
console.log(`\n${marcas.length} fotogramas en ${salida}`);
