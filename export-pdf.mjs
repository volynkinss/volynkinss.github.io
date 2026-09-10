import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { renderDocument, validateResumeData } from "./renderer.mjs";
import { resume } from "./resume-data.mjs";
import {
  buildPdfManifest,
  downloadsDir,
  here,
  manifestPath,
  pdfAssets,
  stableJson,
} from "./pdf-assets.mjs";

const require = createRequire(import.meta.url);
const minPages = 2;
const maxPages = 4;

async function main() {
  const written = await exportResumePdfs();
  for (const file of written) {
    console.log(`Generated ${path.relative(process.cwd(), file)}`);
  }
}

export async function exportResumePdfs() {
  validateResumeData(resume);
  const template = await fs.readFile(path.join(here, "index.template.html"), "utf8");
  const [screenCss, printCss] = await Promise.all([
    fs.readFile(path.join(here, "styles.css"), "utf8"),
    fs.readFile(path.join(here, "print.css"), "utf8"),
  ]);
  const rendered = new Map();

  for (const asset of pdfAssets) {
    const html = inlineStaticAssets(
      renderDocument(resume, asset.lang, template),
      screenCss,
      printCss,
    );
    rendered.set(asset.lang, html);
  }

  const { chromium } = loadPlaywright();
  let browser;
  try {
    browser = await chromium.launch();
    const pdfBuffers = new Map();

    for (const asset of pdfAssets) {
      const buffer = await renderPdf(browser, rendered.get(asset.lang), asset);
      assertPdfPageCount(buffer, asset.file);
      pdfBuffers.set(asset.lang, buffer);
    }

    const manifest = await buildPdfManifest(pdfBuffers);
    await fs.mkdir(downloadsDir, { recursive: true });

    const written = [];
    for (const asset of pdfAssets) {
      const outputPath = path.join(downloadsDir, asset.file);
      await fs.writeFile(outputPath, pdfBuffers.get(asset.lang));
      written.push(outputPath);
    }

    await fs.writeFile(manifestPath, stableJson(manifest), "utf8");
    written.push(manifestPath);
    return written;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function loadPlaywright() {
  const override = process.env.PLAYWRIGHT_MODULE;
  if (override && !path.isAbsolute(override)) {
    throw new Error("PLAYWRIGHT_MODULE must be an absolute filesystem path when set.");
  }

  try {
    return require(override || "playwright");
  } catch (error) {
    const source = override || "playwright";
    throw new Error(
      [
        `Unable to load Playwright from ${source}.`,
        "Install it with:",
        "  npm install --no-save --package-lock=false playwright@1.62.1",
        "  npx playwright install chromium",
        "Or set PLAYWRIGHT_MODULE to an absolute path for an existing Playwright package.",
        `Original error: ${error.message}`,
      ].join("\n"),
    );
  }
}

function inlineStaticAssets(html, screenCss, printCss) {
  return html
    .replace(
      /<link\s+rel="stylesheet"\s+href="styles\.css"\s*>/u,
      `<style data-export-source="styles.css">${escapeStyle(screenCss)}</style>`,
    )
    .replace(
      /<link\s+rel="stylesheet"\s+href="print\.css"\s+media="print"\s*>/u,
      `<style data-export-source="print.css" media="print">${escapeStyle(printCss)}</style>`,
    )
    .replace(/\s*<script\s+type="module"\s+src="script\.js"><\/script>\s*/u, "\n");
}

function escapeStyle(css) {
  return css.replace(/<\/style/giu, "<\\/style");
}

async function renderPdf(browser, html, asset) {
  const page = await browser.newPage();
  try {
    await page.route("**/*", (route) => route.abort());
    await page.setContent(html, { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => {
      for (const details of document.querySelectorAll("details")) {
        details.open = true;
      }
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    return await page.pdf({
      format: "A4",
      preferCSSPageSize: true,
      printBackground: false,
      tagged: true,
      outline: true,
    });
  } catch (error) {
    throw new Error(`Failed to generate ${asset.file}: ${error.message}`);
  } finally {
    await page.close();
  }
}

function assertPdfPageCount(buffer, file) {
  const pageCount = countPdfPages(buffer);
  if (pageCount < minPages || pageCount > maxPages) {
    throw new Error(
      `${file} must be ${minPages}-${maxPages} A4 pages; generated ${pageCount || "unknown"} pages.`,
    );
  }
}

function countPdfPages(buffer) {
  const text = buffer.toString("latin1");
  return (text.match(/\/Type\s*\/Page\b/g) || []).length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
