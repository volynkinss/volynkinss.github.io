# Resume preview

Static, dependency-free bilingual resume site.

## Files

- `resume-data.mjs` contains the editable resume content.
- `renderer.mjs` normalizes the bilingual data and renders semantic HTML.
- `build.mjs` generates the English `index.html` from `index.template.html`.
- `script.js` switches language at runtime with `?lang=ru|en`, `localStorage` key `resume-lang-v2`, and metadata updates.
- `styles.css` contains the light architectural layout: sage surfaces, restrained cards, and decorative isometric layers in the hero. The layers use CSS only, with no external assets or dependencies.
- `print.css` contains the A4 print layout.
- `export-pdf.mjs` exports tracked bilingual PDF downloads through Playwright Chromium.
- `downloads/manifest.json` records the source and PDF hashes used by the freshness test.

## Build

```sh
node build.mjs
```

The build is deterministic and has no runtime package dependencies. `resume-data.mjs` must exist and match the expected bilingual data shape.

## PDF export

Use Node 20+ for PDF export. Install Playwright only for export work:

```sh
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
node build.mjs
node export-pdf.mjs
```

The exporter renders the same bilingual static HTML as the site, inlines the local screen and print styles, removes the runtime script, blocks external requests, expands disclosures, and writes:

- `downloads/Sergey_Volynkin_CV_RU.pdf`
- `downloads/Sergey_Volynkin_CV_EN.pdf`
- `downloads/manifest.json`

Set `PLAYWRIGHT_MODULE=/absolute/path/to/playwright` to reuse an existing bundled Playwright package instead of a local install.

## Test

```sh
node --test tests/*.test.mjs
```

Tests require Node 18+ and do not load Playwright. The PDF freshness test compares `downloads/manifest.json` with the current source files and actual PDF bytes, so content or style changes require a fresh `node export-pdf.mjs` run. Before committing changes, regenerate the HTML and both PDFs, then run the tests and include the updated downloads and manifest in the commit.

## Local preview

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. Direct language links such as `/?lang=ru` and `/?lang=en#experience` are supported.

## Design and accessibility

The three decorative layers are localized with the page and excluded from the accessibility tree. On narrow screens and in print they are hidden. Hover movement is enabled only for fine pointers when reduced motion is not requested. Resume content, contacts, language switching, and the static English fallback work independently of the illustration.

The separate A4 print stylesheet keeps a compact text layout and expands the additional projects through the existing print handlers.

On screens up to 700px, the first sentence of the profile is shown with a native “Read more” disclosure for the rest. The excerpt must be a prefix of the full summary; an absent or outdated excerpt falls back to the full text. Desktop and print always show the complete summary. Disclosure state survives language switching, and printing restores its prior state afterward.

Selected project cards show the title, role, period and optional status on separate lines. The primary download link selects the matching RU/EN PDF; native printing remains available as a secondary action.
