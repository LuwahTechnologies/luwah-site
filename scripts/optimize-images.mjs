#!/usr/bin/env node
/**
 * Shrinks oversized JPEGs in public/images in place.
 *
 * Why this exists: next.config.js sets images.unoptimized, so next/image serves
 * the file in public/ byte for byte. A 3.8 MB photo shown in a 300px band is
 * downloaded whole. Image optimisation on the server was left off for the
 * Render free plan's memory, so the fix is to ship files that are already
 * small.
 *
 * Same file name, same format, so nothing that points at an image (code, or a
 * "/images/..." path typed into Sanity) changes. A file is only replaced when
 * the result is at least 10% smaller. Metadata such as EXIF and GPS is
 * dropped, and colour is converted to sRGB. Brand and share images are skipped.
 *
 *   node scripts/optimize-images.mjs --check     report only
 *   node scripts/optimize-images.mjs             rewrite files
 *   node scripts/optimize-images.mjs --min-kb 300 --max-width 1600 --quality 75
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
// Logos and the images social networks and search engines fetch.
const SKIP = new Set(["Luwah Technologies LLC_LOGO D5.jpg", "og-image.jpg", "sharing-img-logo.jpg"]);

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(args[i + 1]);
};
const check = args.includes("--check");
const minBytes = flag("min-kb", 400) * 1024;
const maxWidth = flag("max-width", 1920);
const quality = flag("quality", 78);

const kb = (n) => `${Math.round(n / 1024)} KB`.padStart(9);
let before = 0;
let after = 0;

for (const name of (await readdir(DIR)).sort()) {
  if (!/\.jpe?g$/i.test(name) || SKIP.has(name)) continue;
  const file = path.join(DIR, name);
  const size = (await stat(file)).size;
  if (size < minBytes) continue;

  const out = await sharp(await readFile(file))
    .rotate() // apply EXIF orientation before the metadata is dropped
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true, progressive: true })
    .toBuffer();

  const worthIt = out.length <= size * 0.9;
  console.log(`${kb(size)} -> ${worthIt ? kb(out.length) : "  (kept)"}  ${name}`);
  before += size;
  if (worthIt) {
    after += out.length;
    if (!check) await writeFile(file, out);
  } else {
    after += size;
  }
}

const saved = before - after;
console.log(`\n${kb(before)} -> ${kb(after)}  saved ${kb(saved)}${check ? "  (dry run, nothing written)" : ""}`);
