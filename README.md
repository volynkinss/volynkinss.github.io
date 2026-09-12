# Resume website

A static bilingual resume for Sergey Volynkin. The primary target role is **Software Implementation & Support Engineer / Инженер по внедрению и сопровождению ПО**. Actual employer titles remain in the employment history.

## Source and publication

- `resume-data.mjs` is the only editable source of resume text in Russian and English.
- `renderer.mjs` normalizes the data and renders semantic HTML for the website and PDFs.
- `index.template.html` defines the shared document and metadata.
- `build.mjs` generates `index.html`, `ru.html` and `en.html`.
- GitHub Pages publishes the root of `main` at <https://volynkinss.github.io/>.

The root URL keeps the existing English static default. Share `/ru.html` for the Russian resume and `/en.html` for the English resume: both contain the complete language-specific text and work without JavaScript. Language links are normal anchors. Dedicated language paths take precedence over storage and query parameters. Legacy `/?lang=ru` and `/?lang=en` links continue to work with JavaScript; the root retains the saved preference under `resume-lang-v2`. With JavaScript disabled, a legacy query URL shows the static English root; use the dedicated URLs for document extraction.

Each language has its own `lang`, title, description, canonical URL, Open Graph URL and alternate-language links. Metadata describes the page; it is not a hiring or ATS compatibility guarantee.

## Build and preview

Use Node 18+ for the build and tests, Node 20+ for PDF export.

```sh
node build.mjs
python3 -m http.server 8765 --bind 127.0.0.1
```

Open <http://127.0.0.1:8765/ru.html> or <http://127.0.0.1:8765/en.html>. Viewing the published HTML does not require Node or external dependencies.

## PDF export

The existing exporter uses Playwright Chromium. Reuse an installed package with `PLAYWRIGHT_MODULE=/absolute/path/to/playwright`, or install it for export work:

```sh
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
node build.mjs
node export-pdf.mjs
```

Outputs remain:

- `downloads/Sergey_Volynkin_CV_RU.pdf`
- `downloads/Sergey_Volynkin_CV_EN.pdf`
- `downloads/manifest.json`

The exporter renders the shared source and template, inlines screen and print CSS, removes the runtime script, blocks external requests and expands project details. PDFs contain selectable text and document tags. `print.css` uses a sequential A4 layout, keeps contact values on separate lines and also exposes project details for native printing without JavaScript. The download action always selects the current language; native printing remains a separate action when JavaScript is available, and the browser's own print command works without it.

The manifest records both source and PDF hashes. After changes to content, renderer, template, export or styles, regenerate all three HTML pages and both PDFs and include the updated downloads and manifest in the commit. Do not edit generated HTML or PDF text manually.

## Verification

Dependency-free tests:

```sh
node --test tests/*.test.mjs
```

With the preview server running and Playwright available:

```sh
CV_PREVIEW_URL=http://127.0.0.1:8765 node --test tests/*.browser.mjs
```

Browser checks cover static RU/EN with and without JavaScript, source-to-DOM content, language URLs, history and storage, native anchors, mobile navigation, fonts, contacts, downloads and print. Set `CV_QA_DIR=/absolute/path/to/qa` to save screenshots and native no-JavaScript PDFs during content-fidelity checks. This optional browser suite is separate from the dependency-free tests.

To verify actual text extraction from both tracked PDFs, use Python with `pypdf`:

```sh
python3 tests/pdf-text.py
```

Set `NODE_BIN=/absolute/path/to/node` if the default Node is too old; set `CV_QA_DIR` to save extracted text. To check native browser printouts with the same assertions, set `CV_PDF_DIR=/absolute/path/to/qa/native`. The check compares factual source values, language, chronology, summary duplication and contact separation. It complements visual inspection of every PDF page. None of these checks runs inside an employer's ATS or predicts a hiring decision.

## Content and design conventions

- Use one primary target role. Preserve actual employer names, titles and dates.
- Keep the full summary and key employment/project evidence visible. Use standard headings and lists; optional earlier projects may be expandable.
- Distinguish employment, co-owned products, client projects, modifications of existing open-source code and substantial AI assistance. `category` and `contribution` are ordinary visible project text.
- Describe confirmed project functionality without equating repository contents with sole authorship or measured impact. Confirm operational status with the owner; a completed codebase alone is insufficient.
- Do not invent metrics, dates, proficiency levels or technology experience. Keep Russian and English facts aligned. User-provided corrections belong in the source, not manually maintained exports.
- Keep editorial audits and vacancy research outside the public site repository.

The existing sage layout, CSS architectural illustration, local Manrope headings, system body font, focus indicators and reduced-motion behavior are retained. The illustration is decorative and excluded from the accessibility tree. The three-link mobile navigation uses native anchors; JavaScript adds active-section highlighting without changing history on scroll. Language switching preserves open project details; printing restores their state afterward.

`assets/fonts/manrope-600.ttf` is bundled with its SIL OFL license; no font service is contacted at runtime. Print uses Arial. `favicon.svg` remains the `sv.` monogram. The social cover `og-resume.png` (1733×907) removes the obsolete role from the original cover; `og.png` remains available for old links. The built-in Imagegen edit prompt is saved in `assets/social-cover-edit.prompt.txt`, and the original generation prompt remains in `assets/social-cover.prompt.txt`.
