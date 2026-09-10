# Resume preview

Static, dependency-free bilingual resume site.

## Files

- `resume-data.mjs` contains the editable resume content.
- `renderer.mjs` normalizes the bilingual data and renders semantic HTML.
- `build.mjs` generates the English `index.html` from `index.template.html`.
- `script.js` switches language at runtime with `?lang=ru|en`, `localStorage` key `resume-lang-v2`, and metadata updates.
- `styles.css` contains the light architectural layout: sage surfaces, restrained cards, and decorative isometric layers in the hero. The layers use CSS only, with no external assets or dependencies.
- `print.css` contains the A4 print layout.

## Build

```sh
node build.mjs
```

The build is deterministic and has no runtime package dependencies. `resume-data.mjs` must exist and match the expected bilingual data shape.

## Test

```sh
node --test tests/*.test.mjs
```

## Local preview

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. Direct language links such as `/?lang=ru` and `/?lang=en#experience` are supported.

## Design and accessibility

The three decorative layers are localized with the page and excluded from the accessibility tree. On narrow screens and in print they are hidden. Hover movement is enabled only for fine pointers when reduced motion is not requested. Resume content, contacts, language switching, and the static English fallback work independently of the illustration.

The separate A4 print stylesheet keeps a compact text layout and expands the additional projects through the existing print handlers.
