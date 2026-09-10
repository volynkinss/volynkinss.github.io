import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const here = path.dirname(fileURLToPath(import.meta.url));
export const downloadsDir = path.join(here, "downloads");
export const manifestPath = path.join(downloadsDir, "manifest.json");

export const pdfAssets = [
  { lang: "ru", file: "Sergey_Volynkin_CV_RU.pdf" },
  { lang: "en", file: "Sergey_Volynkin_CV_EN.pdf" },
];

export const sourceFiles = [
  "resume-data.mjs",
  "renderer.mjs",
  "index.template.html",
  "styles.css",
  "print.css",
  "export-pdf.mjs",
  "pdf-assets.mjs",
];

export function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

export async function readSourceSnapshot() {
  const sources = [];
  const sourceHash = createHash("sha256");

  for (const file of sourceFiles) {
    const bytes = await fs.readFile(path.join(here, file));
    const fileHash = sha256(bytes);
    sources.push({ file, sha256: fileHash });
    sourceHash.update(file);
    sourceHash.update("\0");
    sourceHash.update(String(bytes.length));
    sourceHash.update("\0");
    sourceHash.update(bytes);
    sourceHash.update("\0");
  }

  return {
    sourceSha256: sourceHash.digest("hex"),
    sources,
  };
}

export async function buildPdfManifest(pdfBuffers) {
  const snapshot = await readSourceSnapshot();
  const pdfs = {};

  for (const asset of pdfAssets) {
    const buffer = pdfBuffers.get(asset.lang);
    if (!buffer) {
      throw new Error(`Missing generated PDF buffer for ${asset.lang}.`);
    }
    pdfs[asset.lang] = {
      file: asset.file,
      sha256: sha256(buffer),
      bytes: buffer.length,
    };
  }

  return {
    version: 1,
    sourceSha256: snapshot.sourceSha256,
    sources: snapshot.sources,
    pdfs,
  };
}

export function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
