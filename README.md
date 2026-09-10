# Resume preview

Static, dependency-free bilingual resume site.

## Files

- `resume-data.mjs` contains the editable resume content.
- `renderer.mjs` normalizes the bilingual data and renders semantic HTML.
- `build.mjs` generates the English `index.html` from `index.template.html`.
- `script.js` switches language at runtime with `?lang=ru|en`, `localStorage` key `resume-lang-v2`, and metadata updates.
- `styles.css` contains the screen layout.
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
