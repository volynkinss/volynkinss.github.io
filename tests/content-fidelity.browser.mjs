import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { resume } from '../resume-data.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.CV_PREVIEW_URL || 'http://127.0.0.1:8765';
const qa = process.env.CV_QA_DIR;
const compact = (s) => s.normalize('NFKC').replace(/\s+/gu, '');
const fields = (record, names) => names.flatMap((key) => Array.isArray(record[key]) ? record[key] : record[key] ? [record[key]] : []);
function expected(page) {
  return [
    ...fields(page, ['name', 'headline', 'location', 'summary', 'availability', 'languages', 'projectIntro']),
    ...page.contacts.map(x => x.value),
    ...fields(page.employment, ['company', 'role', 'period', 'department', 'overview', 'automation']),
    ...page.employment.cases.flatMap(x => fields(x, ['title', 'subtitle', 'status', 'bullets', 'stack'])),
    ...page.projects.flatMap(x => fields(x, ['title', 'role', 'category', 'contribution', 'period', 'status', 'description', 'bullets', 'stack'])),
    ...page.otherProjects.flatMap(x => fields(x, ['title', 'period', 'status', 'description', 'stack'])),
    ...page.skills.flatMap(x => fields(x, ['title', 'description', 'items'])),
    ...fields(page.background, ['company', 'role', 'period', 'description']),
    ...fields(page.education, ['institution', 'degree', 'year']),
  ];
}

test('source facts survive static HTML, browser rendering and native no-JS printing', async () => {
  const browser = await chromium.launch();
  try {
    if (qa) await fs.mkdir(qa, {recursive:true});
    for (const lang of ['ru', 'en']) {
      const source = resume[lang];
      for (const javaScriptEnabled of [true, false]) {
        const context = await browser.newContext({ javaScriptEnabled, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        for (const width of [320, 375, 390, 412, 768, 1280, 1440]) {
          await page.setViewportSize({width, height:900});
          const response = await page.goto(`${base}/${lang}.html`, {waitUntil:'networkidle'});
          assert.equal(response.status(), 200);
          assert.equal(await page.locator('html').getAttribute('lang'), lang);
          const raw = await response.text();
          assert.ok(raw.includes(source.name), 'name is in original HTML response');
          assert.equal(await page.locator('h1').count(), 1);
          const all = compact(await page.locator('main').textContent());
          for (const value of expected(source)) assert.ok(all.includes(compact(value)), `${lang}/${width}/${javaScriptEnabled}: missing ${value}`);
          const other = resume[lang === 'ru' ? 'en' : 'ru'];
          assert.ok(!all.includes(compact(other.name)), 'only one resume language in DOM');
          const visible = compact(await page.locator('main').innerText());
          for (const value of [source.summary, source.employment.company, source.employment.role, source.employment.period, ...source.employment.cases.flatMap(x => x.bullets), ...source.projects.flatMap(x => x.bullets)]) {
            assert.ok(visible.includes(compact(value)), 'essential experience must be visible without expanding anything: '+value);
          }
          assert.equal(all.split(compact(source.summary)).length - 1, 1, 'summary has a single DOM copy');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${lang}/${width}: horizontal overflow`);
          assert.ok(await page.locator('.hero-contacts').isVisible());
          assert.equal(await page.locator('[data-print]').isVisible(), javaScriptEnabled, 'script-only print button is not a dead control without JS');
          for (const c of source.contacts) {
            assert.equal(await page.locator('.hero-contacts a').filter({hasText:c.value}).getAttribute('href'), c.href);
          }
          const order = await page.locator('main > section[id]').evaluateAll(nodes => nodes.map(n => n.id));
          assert.ok(order.indexOf('skills') < order.indexOf('experience'));
          assert.ok(order.indexOf('experience') < order.indexOf('projects'));
          assert.ok(order.indexOf('projects') < order.indexOf('education'));
          if(qa && javaScriptEnabled && [390,1440].includes(width)) {
            await page.screenshot({path:path.join(qa,`${lang}-${width}-hero.png`)});
            for (const id of ['skills', 'experience', 'projects', 'education']) {
              await page.locator('#'+id).scrollIntoViewIfNeeded();
              await page.screenshot({path:path.join(qa,`${lang}-${width}-${id}.png`)});
            }
          }
        }
        if (!javaScriptEnabled && qa) {
          await page.goto(`${base}/${lang}.html`, {waitUntil:'networkidle'});
          assert.equal(await page.locator('details[open]').count(), 0, 'print starts with native disclosures closed');
          await page.emulateMedia({media:'print'});
          await fs.mkdir(path.join(qa, 'native'), {recursive:true});
          await page.pdf({path:path.join(qa, 'native', `Sergey_Volynkin_CV_${lang.toUpperCase()}.pdf`),format:'A4',preferCSSPageSize:true,tagged:true});
        }
        assert.deepEqual(errors, []);
        await context.close();
      }
      const response = await browser.newPage();
      const filename = `Sergey_Volynkin_CV_${lang.toUpperCase()}.pdf`;
      const download = await response.request.get(`${base}/downloads/${filename}`);
      assert.equal(download.status(),200);
      assert.match(download.headers()['content-type'],/application\/pdf/);
      assert.deepEqual(await download.body(), await fs.readFile(new URL(`../downloads/${filename}`,import.meta.url)));
      await response.close();
    }
  } finally { await browser.close(); }
});
