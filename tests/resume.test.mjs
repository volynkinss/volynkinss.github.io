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
  assert.equal(getLanguageFromUrl('https://example.com/ru.html?lang=en'), 'ru');
  assert.equal(getLanguageFromUrl('https://example.com/en.html?lang=ru'), 'en');
});

test('language links round-trip without losing the section or other parameters', () => {
  const url = new URL(buildLanguageHref('https://example.com/cv/?source=referral&lang=en#projects', 'ru'));
  assert.equal(url.pathname, '/cv/ru.html');
  assert.equal(url.hash, '#projects');
  assert.equal(url.searchParams.get('source'), 'referral');
  assert.equal(url.searchParams.has('lang'), false);
  assert.equal(getLanguageFromUrl(url.href), 'ru');
  assert.equal(getLanguageFromUrl('https://example.com/?lang=invalid'), '');

  const html = renderApp(resume, 'ru', { currentHref: '/cv/ru.html?source=referral&lang=ru#skills' });
  assert.ok(html.includes('href="/cv/en.html?source=referral#skills"'));
  assert.ok(html.includes('href="/cv/ru.html?source=referral#skills"'));
});

test('both languages cover the same cases, projects and UI controls', () => {
  assert.deepEqual(Object.keys(resume.en.ui).sort(), Object.keys(resume.ru.ui).sort());
  for (const group of ['projects', 'otherProjects']) {
    assert.deepEqual(resume.en[group].map(x => x.id), resume.ru[group].map(x => x.id));
  }
  for (const lang of ['ru', 'en']) {
    assert.ok(resume[lang].projects.some(project => project.category && project.contribution));
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
    const html = renderDocument(resume, lang, template, { path: `/${lang}.html` });
    const metadata = createMetadata(normalizeResume(resume)[lang], lang, { path: `/${lang}.html` });
    assert.ok(html.includes(`<html lang="${lang}">`));
    assert.ok(metadata.title.includes(resume[lang].name));
    assert.equal(metadata.ogLocale, lang === 'ru' ? 'ru_RU' : 'en_US');
    assert.ok(html.includes(`rel="canonical" href="https://volynkinss.github.io/${lang}.html"`));
    assert.ok(html.includes(`property="og:url" content="https://volynkinss.github.io/${lang}.html"`));
    assert.ok(html.includes('hreflang="en" href="https://volynkinss.github.io/en.html"'));
    assert.ok(html.includes('hreflang="ru" href="https://volynkinss.github.io/ru.html"'));
    assert.ok(html.includes('hreflang="x-default" href="https://volynkinss.github.io/"'));
    assert.ok(html.includes('https://volynkinss.github.io/og-resume.png'));
    assert.ok(!html.includes('Software &amp; Platform Engineer. Three sage architectural layers.'));
    for (const id of ['experience', 'projects', 'skills', 'background', 'education', 'contacts']) {
      assert.ok(html.includes(`id="${id}"`), `missing section ${id}`);
    }
    for (const name of ['RDPGW', 'Dashboard', 'Pulp', 'Keycloak', 'BoltFather', 'Kvartirka', 'Deliveries']) {
      assert.ok(html.includes(name), `missing content ${name}`);
    }
    for (const project of resume[lang].projects) {
      if (project.category) assert.ok(html.includes(project.category), `missing category ${project.title}`);
      if (project.contribution) assert.ok(html.includes(project.contribution), `missing contribution ${project.title}`);
    }
    assert.ok(!html.includes('{{'), 'unexpanded template marker');
  }
});

test('generated static HTML files match the current bilingual source', async () => {
  const template = await readFile(new URL('../index.template.html', import.meta.url), 'utf8');
  for (const item of [
    { file: 'index.html', lang: 'en', path: '/' },
    { file: 'en.html', lang: 'en', path: '/en.html' },
    { file: 'ru.html', lang: 'ru', path: '/ru.html' },
  ]) {
    const generated = await readFile(new URL(`../${item.file}`, import.meta.url), 'utf8');
    assert.equal(generated, `${renderDocument(resume, item.lang, template, { path: item.path })}\n`, item.file);
  }
});

test('PDF downloads follow the selected language and remain relative to the site', () => {
  for (const lang of ['ru', 'en']) {
    const filename = `Sergey_Volynkin_CV_${lang.toUpperCase()}.pdf`;
    const html = renderApp(resume, lang);
    assert.ok(html.includes(`href="./downloads/${filename}" download="${filename}"`));
    assert.ok(html.includes('data-print'), 'native print remains available');
  }
});

test('hero keeps contacts before one complete summary', () => {
  for (const lang of ['ru', 'en']) {
    const html = renderApp(resume, lang, { openDisclosures: ['profile-summary', 'other-projects'] });
    assert.ok(html.includes(resume[lang].summary));
    assert.equal(html.indexOf(resume[lang].summary), html.lastIndexOf(resume[lang].summary));
    assert.ok(html.indexOf('class="hero-contacts"') < html.indexOf('class="summary"'));
    assert.ok(!html.includes('summary-mobile'));
    assert.ok(!html.includes('summary-details'));
    assert.ok(!html.includes('data-disclosure="profile-summary"'));
    assert.match(html, /data-disclosure="other-projects" open/);
  }
});

test('skills, experience, education and language details use ATS-friendly order', () => {
  for (const lang of ['ru', 'en']) {
    const html = renderApp(resume, lang);
    const ids = ['skills', 'experience', 'projects', 'education', 'contacts'];
    const positions = ids.map((id) => html.indexOf(`id="${id}"`));
    assert.ok(positions.every((position) => position >= 0));
    assert.deepEqual([...positions].sort((a, b) => a - b), positions);
    assert.ok(html.includes(`<h2 id="experience-title">${lang === 'ru' ? 'Опыт работы' : 'Work experience'}</h2>`));
    assert.ok(html.includes(`<h3 id="employment-title">${resume[lang].employment.role}</h3>`));
    assert.ok(html.indexOf(resume[lang].employment.company) < html.indexOf(resume[lang].employment.role));
    assert.ok(html.indexOf(resume[lang].employment.role) < html.indexOf(resume[lang].employment.period));
    assert.ok(html.indexOf(resume[lang].employment.period) < html.indexOf(resume[lang].employment.department));
    assert.ok(html.indexOf('id="background"') > html.indexOf('class="employment-panel"'));
    assert.ok(html.includes(`<strong>${lang === 'ru' ? 'Языки' : 'Languages'}:</strong> ${resume[lang].languages}`));
  }
});

test('mobile navigation is localized and only links to sections present in the document', () => {
  for (const lang of ['ru', 'en']) {
    const html = renderApp(resume, lang);
    const mobile = html.match(/<nav class="mobile-nav"[\s\S]*?<\/nav>/)[0];
    assert.equal([...mobile.matchAll(/<a /g)].length, 3);
    assert.deepEqual([...mobile.matchAll(/data-nav-section="([^"]+)"/g)].map((match) => match[1]), ['skills', 'experience', 'projects']);
    for (const id of ['skills', 'experience', 'projects']) {
      assert.ok(mobile.includes(`href="#${id}" data-nav-section="${id}"`));
      assert.ok(html.includes(`id="${id}"`));
    }
    assert.ok(mobile.includes(lang === 'ru' ? '>Опыт<' : '>Experience<'));
  }
  const sparse = renderApp({ en: { name: 'Name', headline: 'Role', summary: 'Summary' } }, 'en');
  assert.ok(!sparse.includes('class="mobile-nav"'), 'no empty mobile landmark for absent sections');
});

test('sharing metadata points to the included cover with its actual PNG dimensions', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const png = await readFile(new URL('../og-resume.png', import.meta.url));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.ok(html.includes('property="og:image" content="https://volynkinss.github.io/og-resume.png"'));
  assert.ok(html.includes('name="twitter:image" content="https://volynkinss.github.io/og-resume.png"'));
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(html.includes(`property="og:image:width" content="${png.readUInt32BE(16)}"`));
  assert.ok(html.includes(`property="og:image:height" content="${png.readUInt32BE(20)}"`));
  assert.ok(html.includes('rel="icon" href="favicon.svg" type="image/svg+xml"'));
  const icon = await readFile(new URL('../favicon.svg', import.meta.url), 'utf8');
  assert.ok(icon.includes('viewBox="0 0 64 64"'));
});
