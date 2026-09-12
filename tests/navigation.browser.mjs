import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.CV_PREVIEW_URL || 'http://127.0.0.1:8765';

test('RU/EN navigation follows native anchors, viewport and language changes', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const lang of ['ru', 'en']) {
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${base}/${lang}.html`, { waitUntil: 'networkidle' });
        const nav = width <= 620 ? '.mobile-nav' : '.site-nav';
        assert.equal(await page.locator('.mobile-nav').isVisible(), width <= 620);
        assert.equal(await page.locator(`${nav} [aria-current]`).count(), 0, 'hero has no active section');
        assert.ok(await page.evaluate(() => document.fonts.check('600 32px Manrope', 'Сергей Волынкин')));
        assert.match(await page.locator('h1').evaluate((el) => getComputedStyle(el).fontFamily), /Manrope/);

        for (const id of ['skills', 'experience', 'projects']) {
          const link = page.locator(`${nav} [data-nav-section="${id}"]`);
          await link.focus();
          await page.keyboard.press('Enter');
          await page.waitForFunction(({ nav, id }) => document.querySelector(`${nav} [aria-current]`)?.dataset.navSection === id, { nav, id });
          assert.equal(new URL(page.url()).hash, `#${id}`);
          assert.equal(await page.locator(`${nav} [aria-current]`).count(), 1);
          const targetTop = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
          const barBottom = await page.locator(width <= 620 ? nav : '.site-header').evaluate((el) => el.getBoundingClientRect().bottom);
          assert.ok(targetTop >= barBottom - 1, `${lang}/${width}/${id}: heading clears sticky navigation`);
        }
        if (width <= 620) {
          assert.ok(Math.abs(await page.locator(nav).evaluate((el) => el.getBoundingClientRect().top)) < 1);
          assert.ok(await page.locator(`${nav} a`).evaluateAll((nodes) => nodes.every((el) => el.getBoundingClientRect().height >= 44)));
        }
        const href = page.url();
        const historyLength = await page.evaluate(() => history.length);
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        const last = width <= 620 ? 'projects' : 'contacts';
        await page.waitForFunction(({ nav, last }) => document.querySelector(`${nav} [aria-current]`)?.dataset.navSection === last, { nav, last });
        assert.equal(page.url(), href, 'scroll tracking preserves the fragment');
        assert.equal(await page.evaluate(() => history.length), historyLength, 'scroll tracking does not write history');
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForFunction((nav) => !document.querySelector(`${nav} [aria-current]`), nav);
      }
    }

    await page.goto(`${base}/ru.html?lang=en#projects`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
    await page.waitForFunction(() => document.querySelector('.site-nav [aria-current]')?.dataset.navSection === 'projects');
    await page.locator('[data-lang-btn="en"]').click();
    assert.equal(new URL(page.url()).pathname, '/en.html');
    assert.equal(new URL(page.url()).hash, '#projects');
    await page.locator('.site-nav [data-nav-section="experience"]').click();
    await page.waitForFunction(() => document.querySelector('.site-nav [aria-current]')?.dataset.navSection === 'experience');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.mobile-nav [data-nav-section="projects"]').click();
    await page.waitForFunction(() => document.querySelector('.mobile-nav [aria-current]')?.dataset.navSection === 'projects');
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('.mobile-nav').isVisible(), false);
    assert.doesNotMatch(await page.locator('h1').evaluate((el) => getComputedStyle(el).fontFamily), /Manrope/);
    assert.deepEqual(errors, []);

    const fallback = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await fallback.goto(`${base}/ru.html?source=test#experience`);
    assert.equal(await fallback.locator('html').getAttribute('lang'), 'ru');
    assert.equal(await fallback.locator('[data-lang-btn="en"]').getAttribute('href'), '/en.html');
    assert.equal(await fallback.locator('[data-lang-btn="ru"]').getAttribute('href'), '/ru.html');
    await fallback.locator('[data-lang-btn="en"]').click();
    assert.equal(new URL(fallback.url()).pathname, '/en.html');
    assert.equal(await fallback.locator('html').getAttribute('lang'), 'en');
    await fallback.locator('.mobile-nav [data-nav-section="projects"]').click();
    assert.equal(new URL(fallback.url()).hash, '#projects');
    const top = await fallback.locator('#projects').evaluate((el) => el.getBoundingClientRect().top);
    const bottom = await fallback.locator('.mobile-nav').evaluate((el) => el.getBoundingClientRect().bottom);
    assert.ok(top >= bottom - 1, 'static anchors clear the mobile bar without JavaScript');

    const compatibility = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const compatibilityErrors = [];
    compatibility.on('pageerror', (error) => compatibilityErrors.push(error.message));
    await compatibility.addInitScript(() => {
      Object.hasOwn = undefined;
      Array.prototype.at = undefined;
      Object.defineProperty(document, 'fonts', { get: () => undefined });
    });
    await compatibility.goto(`${base}/?lang=ru`);
    assert.equal(await compatibility.locator('html').getAttribute('lang'), 'ru');
    await compatibility.locator('[data-lang-btn="en"]').evaluate((link) => {
      const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, metaKey: true });
      link.dispatchEvent(event);
    });
    assert.equal(await compatibility.locator('html').getAttribute('lang'), 'ru');
    await compatibility.locator('[data-lang-btn="en"]').click();
    assert.equal(new URL(compatibility.url()).pathname, '/en.html');
    await compatibility.locator('.mobile-nav [data-nav-section="projects"]').click();
    await compatibility.waitForFunction(() => document.querySelector('.mobile-nav [aria-current]')?.dataset.navSection === 'projects');
    await compatibility.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await compatibility.waitForFunction(() => document.querySelector('.mobile-nav [aria-current]')?.dataset.navSection === 'projects');
    assert.equal(await compatibility.locator('html').getAttribute('lang'), 'en');
    assert.deepEqual(compatibilityErrors, [], 'new helper APIs are not required');
  } finally {
    await browser.close();
  }
});

test('language paths, saved preference, history, details and blocked storage stay compatible', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.evaluate(() => localStorage.setItem('resume-lang-v2', 'en'));
    await page.goto(`${base}/ru.html?lang=en&ref=resume#projects`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru', 'static language path wins over query and storage');
    await page.locator('[data-disclosure="other-projects"] summary').click();
    assert.equal(await page.locator('[data-disclosure="other-projects"]').getAttribute('open'), '');
    await page.locator('[data-lang-btn="en"]').click();
    assert.equal(new URL(page.url()).pathname, '/en.html');
    assert.equal(new URL(page.url()).searchParams.get('ref'), 'resume');
    assert.equal(new URL(page.url()).searchParams.has('lang'), false);
    assert.equal(new URL(page.url()).hash, '#projects');
    assert.equal(await page.locator('[data-disclosure="other-projects"]').getAttribute('open'), '');
    assert.equal(await page.locator('[data-lang-btn="en"]').evaluate(el => el === document.activeElement), true);
    assert.match(await page.locator('meta[property="og:image:alt"]').getAttribute('content'), /Sergey Volynkin/);
    await page.goBack();
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
    await page.goForward();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.goto(`${base}/?lang=ru#background`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru');
    await page.locator('[data-lang-btn="ru"]').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('resume-lang-v2')), 'ru');
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru', 'root keeps prior saved-preference strategy');
    await page.goto(`${base}/en.html`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.evaluate(() => { window.print = () => { window.printWasCalled = true; }; });
    await page.locator('[data-print]').click();
    assert.equal(await page.evaluate(() => window.printWasCalled), true);
    assert.equal(await page.locator('[data-disclosure="other-projects"]').getAttribute('open'), null);
    await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
    assert.equal(await page.locator('[data-disclosure="other-projects"]').getAttribute('open'), '');
    await page.evaluate(() => dispatchEvent(new Event('afterprint')));
    assert.equal(await page.locator('[data-disclosure="other-projects"]').getAttribute('open'), null);

    const locked = await browser.newPage();
    const errors = [];
    locked.on('pageerror', e => errors.push(e.message));
    await locked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
    await locked.goto(`${base}/ru.html`, { waitUntil: 'networkidle' });
    await locked.locator('[data-lang-btn="en"]').click();
    assert.equal(await locked.locator('html').getAttribute('lang'), 'en');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
