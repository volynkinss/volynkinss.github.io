import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resume } from '../resume-data.mjs';
import { pickInitialLanguage, getLanguageFromUrl, buildLanguageHref, renderApp, renderDocument, createMetadata, normalizeResume } from '../renderer.mjs';

test('explicit language takes priority over stored preference; invalid values are safe', () => {
  assert.equal(pickInitialLanguage({ urlLang: 'ru', storedLang: 'en' }), 'ru');
  assert.equal(pickInitialLanguage({ storedLang: 'ru' }), 'ru');
  assert.equal(pickInitialLanguage({ urlLang: 'invalid', storedLang: 'ru' }), 'ru');
  assert.equal(pickInitialLanguage({ urlLang: 'invalid', storedLang: 'invalid' }), 'en');
});

test('language links round-trip without losing the section or other parameters', () => {
  const url = new URL(buildLanguageHref('https://example.com/cv/?source=referral&lang=en#projects', 'ru'));
  assert.equal(url.pathname, '/cv/');
  assert.equal(url.hash, '#projects');
  assert.equal(url.searchParams.get('source'), 'referral');
  assert.equal(getLanguageFromUrl(url.href), 'ru');
  assert.equal(getLanguageFromUrl('https://example.com/?lang=invalid'), '');
});

test('both languages cover the same cases, projects and UI controls', () => {
  assert.deepEqual(Object.keys(resume.en.ui).sort(), Object.keys(resume.ru.ui).sort());
  for (const group of ['projects', 'otherProjects']) {
    assert.deepEqual(resume.en[group].map(x => x.id), resume.ru[group].map(x => x.id));
  }
  assert.deepEqual(resume.en.employment.cases.map(x => x.id), resume.ru.employment.cases.map(x => x.id));
  assert.equal(resume.en.education.year, resume.ru.education.year);
  for (const page of Object.values(resume)) {
    assert.ok(Object.values(page.ui).every(text => typeof text === 'string' && text.trim()));
    assert.ok(page.projects.every(project => project.description && project.bullets.length && project.stack.length));
  }
});

test('static document includes essential content and language-specific metadata', async () => {
  const template = await readFile(new URL('../index.template.html', import.meta.url), 'utf8');
  for (const lang of ['ru', 'en']) {
    const html = renderDocument(resume, lang, template);
    const metadata = createMetadata(normalizeResume(resume)[lang], lang);
    assert.ok(html.includes(`<html lang="${lang}">`));
    assert.ok(metadata.title.includes(resume[lang].name));
    assert.equal(metadata.ogLocale, lang === 'ru' ? 'ru_RU' : 'en_US');
    for (const id of ['experience', 'projects', 'skills', 'background', 'education', 'contacts']) {
      assert.ok(html.includes(`id="${id}"`), `missing section ${id}`);
    }
    for (const name of ['RDPGW', 'Dashboard', 'Pulp', 'Keycloak', 'BoltFather', 'Kvartirka', 'Deliveries']) {
      assert.ok(html.includes(name), `missing content ${name}`);
    }
    assert.ok(!html.includes('{{'), 'unexpanded template marker');
  }
});

test('generated English HTML matches the current bilingual source', async () => {
  const template = await readFile(new URL('../index.template.html', import.meta.url), 'utf8');
  const generated = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal(generated, `${renderDocument(resume, 'en', template)}\n`);
});

test('PDF downloads follow the selected language and remain relative to the site', () => {
  for (const lang of ['ru', 'en']) {
    const filename = `Sergey_Volynkin_CV_${lang.toUpperCase()}.pdf`;
    const html = renderApp(resume, lang);
    assert.ok(html.includes(`href="./downloads/${filename}" download="${filename}"`));
    assert.ok(html.includes('data-print'), 'native print remains available');
  }
});

test('mobile summary keeps the complete source and disclosure state through re-rendering', () => {
  for (const lang of ['ru', 'en']) {
    assert.ok(resume[lang].summary.startsWith(resume[lang].summaryIntro));
    const html = renderApp(resume, lang, { openDisclosures: ['profile-summary', 'other-projects'] });
    assert.match(html, /data-disclosure="profile-summary" open/);
    assert.match(html, /data-disclosure="other-projects" open/);
    assert.ok(html.includes(resume[lang].summary));
  }
});

test('a missing or stale short introduction falls back to the full summary', () => {
  for (const summaryIntro of ['', 'An outdated introduction.']) {
    const changed = { ...resume, en: { ...resume.en, summaryIntro } };
    const html = renderApp(changed, 'en');
    assert.ok(html.includes(resume.en.summary));
    assert.ok(!html.includes('data-disclosure="profile-summary"'));
  }
});
