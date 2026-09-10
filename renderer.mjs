export const SUPPORTED_LANGUAGES = ["en", "ru"];
export const DEFAULT_LANGUAGE = "en";

const DEFAULT_UI = {
  en: {
    skip: "Skip to resume",
    navLabel: "Resume sections",
    languageLabel: "Language",
    print: "Print",
    backToTop: "Back to top",
    email: "Email",
    phone: "Phone",
    github: "GitHub",
    telegram: "Telegram",
    experience: "Current Experience",
    projects: "Selected Engineering Projects",
    otherProjects: "Other Engineering Projects",
    skills: "Skills",
    background: "Earlier Management Experience",
    education: "Education",
    contacts: "Contacts",
    projectLink: "Open link",
    moreProjects: "More projects",
    architectureCode: "Code",
    architectureServices: "Services",
    architectureInfrastructure: "Infrastructure",
  },
  ru: {
    skip: "Перейти к резюме",
    navLabel: "Разделы резюме",
    languageLabel: "Язык",
    print: "Печать",
    backToTop: "Наверх",
    email: "Email",
    phone: "Телефон",
    github: "GitHub",
    telegram: "Telegram",
    experience: "Текущий опыт",
    projects: "Ключевые инженерные проекты",
    otherProjects: "Другие инженерные проекты",
    skills: "Навыки",
    background: "Предыдущий управленческий опыт",
    education: "Образование",
    contacts: "Контакты",
    projectLink: "Открыть ссылку",
    moreProjects: "Ещё проекты",
    architectureCode: "Код",
    architectureServices: "Сервисы",
    architectureInfrastructure: "Инфраструктура",
  },
};

const SECTION_ORDER = [
  "experience",
  "projects",
  "other-projects",
  "skills",
  "background",
  "education",
  "contacts",
];

const HEADER_NAV_SECTION_IDS = ["experience", "projects", "skills", "contacts"];

export function isSupportedLanguage(value) {
  return SUPPORTED_LANGUAGES.includes(String(value || "").toLowerCase());
}

export function resolveLanguage(value, fallback = DEFAULT_LANGUAGE) {
  const lang = String(value || "").toLowerCase();
  if (isSupportedLanguage(lang)) {
    return lang;
  }
  return isSupportedLanguage(fallback) ? fallback : DEFAULT_LANGUAGE;
}

export function getLanguageFromUrl(urlLike) {
  try {
    const url = new URL(urlLike, "https://resume.local/");
    const lang = url.searchParams.get("lang");
    return isSupportedLanguage(lang) ? lang : "";
  } catch {
    return "";
  }
}

export function pickInitialLanguage({ urlLang = "", storedLang = "" } = {}) {
  if (isSupportedLanguage(urlLang)) {
    return resolveLanguage(urlLang);
  }
  if (isSupportedLanguage(storedLang)) {
    return resolveLanguage(storedLang);
  }
  return DEFAULT_LANGUAGE;
}

export function buildLanguageHref(currentHref, lang) {
  const nextLang = resolveLanguage(lang);
  const fallbackOrigin = "https://resume.local";
  const url = new URL(currentHref || "/", `${fallbackOrigin}/`);
  url.searchParams.set("lang", nextLang);
  if (url.origin === fallbackOrigin) {
    return `${url.pathname}${url.search}${url.hash}`;
  }
  return url.href;
}

export function normalizeResume(input = {}) {
  const source = objectOrEmpty(input);
  return {
    en: normalizePage(source.en, "en"),
    ru: normalizePage(source.ru, "ru"),
  };
}

export function validateResumeData(input) {
  const source = objectOrEmpty(input);
  for (const lang of SUPPORTED_LANGUAGES) {
    const page = objectOrEmpty(source[lang]);
    if (page !== source[lang]) {
      throw new Error(`resume.${lang} must be an object.`);
    }
    for (const field of ["name", "headline", "summary"]) {
      if (!text(page[field])) {
        throw new Error(`resume.${lang}.${field} must be a non-empty string.`);
      }
    }
    if (!text(objectOrEmpty(page.employment).company)) {
      throw new Error(`resume.${lang}.employment.company must be a non-empty string.`);
    }
    if (!Array.isArray(page.projects)) {
      throw new Error(`resume.${lang}.projects must be an array.`);
    }
  }
}

export function renderDocument(rawResume, lang, template) {
  const resume = normalizeResume(rawResume);
  const page = resume[resolveLanguage(lang)];
  const metadata = createMetadata(page, resolveLanguage(lang));
  const appHtml = renderApp(resume, resolveLanguage(lang));
  const structuredData = safeJsonForScript(createStructuredData(page, resolveLanguage(lang)));

  return replaceTemplate(template, {
    lang: resolveLanguage(lang),
    title: metadata.title,
    description: metadata.description,
    ogLocale: metadata.ogLocale,
    structuredData,
    appHtml,
  }).replace(/[ \t]+$/gm, "").trimEnd();
}

export function renderApp(rawResume, lang = DEFAULT_LANGUAGE, options = {}) {
  const resume = isNormalizedResume(rawResume) ? rawResume : normalizeResume(rawResume);
  const activeLang = resolveLanguage(lang);
  const page = resume[activeLang];
  const ui = page.ui;
  const sections = getVisibleSections(page);
  const activeDisclosures = new Set(options.openDisclosures || []);

  return `
    <a class="skip-link" href="#top">${escapeHtml(ui.skip)}</a>
    ${renderHeader(page, activeLang, sections)}
    <main id="top" class="resume-page" tabindex="-1">
      ${renderHero(page)}
      ${renderEmployment(page, "01")}
      ${renderProjects(page, "02")}
      ${renderOtherProjects(page, "03", activeDisclosures)}
      ${renderSkills(page, "04")}
      ${renderBackground(page, "05")}
      ${renderEducation(page, "06")}
      ${renderContacts(page, "07")}
    </main>
    ${renderFooter(page)}
    <a class="back-to-top" href="#top" aria-label="${escapeAttr(ui.backToTop)}">${escapeHtml(ui.backToTop)}</a>
  `;
}

export function createMetadata(page, lang = DEFAULT_LANGUAGE) {
  const titleParts = [page.name, page.headline].filter(Boolean);
  const title = titleParts.length ? titleParts.join(" - ") : "Resume";
  const description = truncate(page.metaDescription || page.summary || title, 220);
  return {
    title,
    description,
    ogLocale: resolveLanguage(lang) === "ru" ? "ru_RU" : "en_US",
  };
}

export function createStructuredData(page, lang = DEFAULT_LANGUAGE) {
  const sameAs = page.contacts
    .map((contact) => contact.href)
    .filter((href) => href && href.startsWith("https://"));
  const email = page.contacts.find((contact) => contact.href && contact.href.startsWith("mailto:"));
  const telephone = page.contacts.find((contact) => contact.href && contact.href.startsWith("tel:"));
  const person = compactObject({
    "@type": "Person",
    name: page.name || undefined,
    jobTitle: page.headline || undefined,
    email: email ? email.href : undefined,
    telephone: telephone ? telephone.value : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    address: page.location ? {
      "@type": "PostalAddress",
      addressLocality: page.location,
    } : undefined,
  });

  return compactObject({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    inLanguage: resolveLanguage(lang),
    name: page.name || undefined,
    description: page.metaDescription || page.summary || undefined,
    mainEntity: person.name ? person : undefined,
  });
}

export function runRendererSelfTests() {
  const selected = pickInitialLanguage({ urlLang: "ru", storedLang: "en" });
  if (selected !== "ru") {
    throw new Error("URL language must have priority over stored language.");
  }

  const stored = pickInitialLanguage({ storedLang: "ru" });
  if (stored !== "ru") {
    throw new Error("Stored language must be used when URL language is absent.");
  }

  const href = buildLanguageHref("https://example.test/cv/?ref=1#contacts", "ru");
  if (href !== "https://example.test/cv/?ref=1&lang=ru#contacts") {
    throw new Error("Language URL update must preserve other params and hash.");
  }

  const resume = normalizeResume({
    en: {
      name: "Sergey Volynkin",
      headline: "Software & Platform Engineer",
      summary: "Builds and operates production services.",
      contacts: [{ label: "Email", value: "name@example.test", href: "mailto:name@example.test" }],
      employment: {
        company: "IBK LLC",
        role: "Lead System Administrator",
        period: "Sep 2025 - Present",
        cases: [{ id: "rdpgw", title: "RDPGW", bullets: ["Modified Go codebase."], stack: ["Go"] }],
      },
    },
    ru: {
      name: "Сергей Волынкин",
      headline: "Software & Platform Engineer",
    },
  });
  const html = renderApp(resume, "en");
  if (!html.includes("Software &amp; Platform Engineer") || !html.includes('id="case-rdpgw"')) {
    throw new Error("Renderer must emit escaped headline and stable case id.");
  }
}

function normalizePage(page = {}, lang = DEFAULT_LANGUAGE) {
  const normalizedLang = resolveLanguage(lang);
  const ui = { ...DEFAULT_UI[normalizedLang], ...objectOrEmpty(page.ui) };
  return {
    name: text(page.name),
    headline: text(page.headline),
    location: text(page.location),
    availability: text(page.availability),
    summary: text(page.summary),
    metaDescription: text(page.metaDescription),
    ui,
    contacts: array(page.contacts).map(normalizeContact).filter((contact) => contact.value || contact.href),
    employment: normalizeEmployment(page.employment),
    projectIntro: text(page.projectIntro),
    projects: array(page.projects).map(normalizeProject).filter((project) => project.title || project.description),
    otherProjects: array(page.otherProjects).map(normalizeOtherProject).filter((project) => project.title || project.description),
    skills: array(page.skills).map(normalizeSkill).filter((skill) => skill.title || skill.items.length),
    background: normalizeBackground(page.background),
    education: normalizeEducation(page.education),
    languages: text(page.languages),
    footer: text(page.footer),
  };
}

function normalizeEmployment(input = {}) {
  const item = objectOrEmpty(input);
  return {
    company: text(item.company),
    role: text(item.role),
    department: text(item.department),
    period: text(item.period),
    overview: text(item.overview),
    cases: array(item.cases).map(normalizeCase).filter((entry) => entry.title || entry.bullets.length),
    automation: text(item.automation),
  };
}

function normalizeCase(input = {}) {
  const item = objectOrEmpty(input);
  return {
    id: stableId(item.id || item.title || "case"),
    title: text(item.title),
    subtitle: text(item.subtitle),
    status: text(item.status),
    bullets: strings(item.bullets),
    stack: strings(item.stack),
    links: array(item.links).map(normalizeLink).filter((link) => link.label && link.url),
  };
}

function normalizeProject(input = {}) {
  const item = objectOrEmpty(input);
  return {
    id: stableId(item.id || item.title || "project"),
    title: text(item.title),
    role: text(item.role),
    period: text(item.period),
    status: text(item.status),
    description: text(item.description),
    bullets: strings(item.bullets),
    stack: strings(item.stack),
    links: array(item.links).map(normalizeLink).filter((link) => link.label && link.url),
  };
}

function normalizeOtherProject(input = {}) {
  const item = objectOrEmpty(input);
  return {
    id: stableId(item.id || item.title || "other-project"),
    title: text(item.title),
    period: text(item.period),
    status: text(item.status),
    description: text(item.description),
    stack: strings(item.stack),
  };
}

function normalizeSkill(input = {}) {
  const item = objectOrEmpty(input);
  return {
    title: text(item.title),
    description: text(item.description),
    items: strings(item.items),
  };
}

function normalizeBackground(input = {}) {
  const item = objectOrEmpty(input);
  return {
    company: text(item.company),
    role: text(item.role),
    period: text(item.period),
    description: text(item.description),
  };
}

function normalizeEducation(input = {}) {
  const item = objectOrEmpty(input);
  return {
    institution: text(item.institution),
    degree: text(item.degree),
    year: text(item.year),
  };
}

function normalizeContact(input = {}) {
  const item = objectOrEmpty(input);
  return {
    label: text(item.label),
    value: text(item.value),
    href: safeUrl(item.href),
  };
}

function normalizeLink(input = {}) {
  const item = objectOrEmpty(input);
  return {
    label: text(item.label),
    url: safeUrl(item.url),
  };
}

function renderHeader(page, lang, sections) {
  const ui = page.ui;
  const navSections = sections.filter((section) => HEADER_NAV_SECTION_IDS.includes(section.id));
  return `
    <header class="site-header">
      <a class="brand" href="#top" aria-label="${escapeAttr(ui.backToTop)}">
        <span class="brand-mark" aria-hidden="true">sv<span>.</span></span>
        <span class="brand-copy">
          <span class="brand-name">${escapeHtml(page.name || "Resume")}</span>
          ${page.headline ? `<span class="brand-role">${escapeHtml(page.headline)}</span>` : ""}
        </span>
      </a>
      <nav class="site-nav" aria-label="${escapeAttr(ui.navLabel)}">
        ${navSections.map((section) => `<a href="#${section.id}">${escapeHtml(section.label)}</a>`).join("")}
      </nav>
      <div class="header-actions" aria-label="${escapeAttr(ui.languageLabel)}">
        <div class="language-switch" role="group" aria-label="${escapeAttr(ui.languageLabel)}">
          ${SUPPORTED_LANGUAGES.map((item) => `
            <button class="language-button" type="button" data-lang-btn="${item}" aria-pressed="${item === lang ? "true" : "false"}">
              ${item.toUpperCase()}
            </button>
          `).join("")}
        </div>
        <button class="print-button" type="button" data-print>${escapeHtml(ui.print)}</button>
      </div>
    </header>
  `;
}

function renderHero(page) {
  const metaItems = [
    page.location,
    page.languages,
  ].filter(Boolean);

  return `
    <section class="hero" aria-labelledby="hero-name">
      <span id="about" class="anchor-alias" aria-hidden="true"></span>
      <div class="hero-main">
        <div class="hero-copy">
          ${page.name ? `<h1 id="hero-name">${escapeHtml(page.name)}</h1>` : `<h1 id="hero-name">Resume</h1>`}
          ${page.headline ? `<p class="headline">${escapeHtml(page.headline)}</p>` : ""}
          ${metaItems.length ? `<ul class="meta-strip">${metaItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
        </div>
        <div class="architecture-scene" aria-hidden="true">
          <div class="architecture-object">
            <div class="architecture-shadow"></div>
            <div class="architecture-layer architecture-base">
              <span class="architecture-number">03</span>
              <span class="architecture-label">${escapeHtml(page.ui.architectureInfrastructure)}</span>
              <div class="architecture-rails"><i></i><i></i><i></i></div>
            </div>
            <div class="architecture-layer architecture-middle">
              <span class="architecture-number">02</span>
              <span class="architecture-label">${escapeHtml(page.ui.architectureServices)}</span>
              <div class="architecture-blocks"><i></i><i></i><i></i></div>
            </div>
            <div class="architecture-layer architecture-top">
              <span class="architecture-number">01</span>
              <span class="architecture-label">${escapeHtml(page.ui.architectureCode)}</span>
              <span class="architecture-code">{ }</span>
            </div>
          </div>
        </div>
      </div>
      ${page.summary ? `<p class="summary">${escapeHtml(page.summary)}</p>` : ""}
      ${renderContactList(page, "hero-contacts")}
      ${page.availability ? `<p class="availability">${escapeHtml(page.availability)}</p>` : ""}
    </section>
  `;
}

function renderEmployment(page, number) {
  const employment = page.employment;
  if (!hasEmployment(employment)) {
    return "";
  }
  const ui = page.ui;
  return `
    <section id="experience" class="content-section current-section" aria-labelledby="experience-title">
      ${renderSectionLabel(number, ui.experience)}
      <article class="employment-panel">
        <div class="employment-head">
          <div>
            ${employment.company ? `<p class="company">${escapeHtml(employment.company)}</p>` : ""}
            ${employment.role ? `<h2 id="experience-title">${escapeHtml(employment.role)}</h2>` : `<h2 id="experience-title">${escapeHtml(ui.experience)}</h2>`}
            ${employment.department ? `<p class="department">${escapeHtml(employment.department)}</p>` : ""}
          </div>
          ${employment.period ? `<p class="period">${escapeHtml(employment.period)}</p>` : ""}
        </div>
        ${employment.overview ? `<p class="overview">${escapeHtml(employment.overview)}</p>` : ""}
        ${employment.cases.length ? `<div class="case-grid">${employment.cases.map((item) => renderCase(item)).join("")}</div>` : ""}
        ${employment.automation ? `<p class="automation-note">${escapeHtml(employment.automation)}</p>` : ""}
      </article>
    </section>
  `;
}

function renderCase(item) {
  return `
    <article id="case-${escapeAttr(item.id)}" class="case-card">
      <div class="case-head">
        <div>
          ${item.title ? `<h3>${escapeHtml(item.title)}</h3>` : ""}
          ${item.subtitle ? `<p>${escapeHtml(item.subtitle)}</p>` : ""}
        </div>
        ${item.status ? `<span class="status">${escapeHtml(item.status)}</span>` : ""}
      </div>
      ${item.bullets.length ? renderBulletList(item.bullets) : ""}
      ${renderTagList(item.stack, "stack-list")}
      ${renderLinks(item.links)}
    </article>
  `;
}

function renderProjects(page, number) {
  if (!page.projects.length && !page.projectIntro) {
    return "";
  }
  const ui = page.ui;
  return `
    <section id="projects" class="content-section" aria-labelledby="projects-title">
      ${renderSectionLabel(number, ui.projects)}
      <div class="section-heading">
        <h2 id="projects-title">${escapeHtml(ui.projects)}</h2>
        ${page.projectIntro ? `<p>${escapeHtml(page.projectIntro)}</p>` : ""}
      </div>
      ${page.projects.length ? `<div class="project-grid">${page.projects.map(renderProject).join("")}</div>` : ""}
    </section>
  `;
}

function renderProject(project) {
  const meta = [project.role, project.period, project.status].filter(Boolean);
  return `
    <article id="project-${escapeAttr(project.id)}" class="project-card">
      <div class="project-head">
        ${project.title ? `<h3>${escapeHtml(project.title)}</h3>` : ""}
        ${meta.length ? `<p>${meta.map(escapeHtml).join(" · ")}</p>` : ""}
      </div>
      ${project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : ""}
      ${project.bullets.length ? renderBulletList(project.bullets) : ""}
      ${renderTagList(project.stack, "stack-list")}
      ${renderLinks(project.links)}
    </article>
  `;
}

function renderOtherProjects(page, number, activeDisclosures) {
  if (!page.otherProjects.length) {
    return "";
  }
  const ui = page.ui;
  const open = activeDisclosures.has("other-projects") ? " open" : "";
  return `
    <section id="other-projects" class="content-section secondary-section" aria-labelledby="other-projects-title">
      ${renderSectionLabel(number, ui.otherProjects)}
      <details class="other-projects" data-disclosure="other-projects"${open}>
        <summary>
          <span id="other-projects-title">${escapeHtml(ui.otherProjects)}</span>
          <span>${escapeHtml(ui.moreProjects)}</span>
        </summary>
        <div class="other-project-list">
          ${page.otherProjects.map(renderOtherProject).join("")}
        </div>
      </details>
    </section>
  `;
}

function renderOtherProject(project) {
  const meta = [project.period, project.status].filter(Boolean);
  return `
    <article id="other-${escapeAttr(project.id)}" class="other-project">
      <div>
        ${project.title ? `<h3>${escapeHtml(project.title)}</h3>` : ""}
        ${meta.length ? `<p class="small-meta">${meta.map(escapeHtml).join(" · ")}</p>` : ""}
      </div>
      ${project.description ? `<p>${escapeHtml(project.description)}</p>` : ""}
      ${renderTagList(project.stack, "stack-list compact")}
    </article>
  `;
}

function renderSkills(page, number) {
  if (!page.skills.length) {
    return "";
  }
  const ui = page.ui;
  return `
    <section id="skills" class="content-section" aria-labelledby="skills-title">
      ${renderSectionLabel(number, ui.skills)}
      <div class="section-heading">
        <h2 id="skills-title">${escapeHtml(ui.skills)}</h2>
      </div>
      <div class="skill-grid">
        ${page.skills.map(renderSkill).join("")}
      </div>
    </section>
  `;
}

function renderSkill(skill) {
  return `
    <article class="skill-group">
      ${skill.title ? `<h3>${escapeHtml(skill.title)}</h3>` : ""}
      ${skill.description ? `<p>${escapeHtml(skill.description)}</p>` : ""}
      ${renderTagList(skill.items, "skill-list")}
    </article>
  `;
}

function renderBackground(page, number) {
  const background = page.background;
  if (!background.company && !background.role && !background.description) {
    return "";
  }
  const ui = page.ui;
  return `
    <section id="background" class="content-section slim-section" aria-labelledby="background-title">
      ${renderSectionLabel(number, ui.background)}
      <div class="text-panel">
        <h2 id="background-title">${escapeHtml(ui.background)}</h2>
        <p class="strong-line">${[background.role, background.company, background.period].filter(Boolean).map(escapeHtml).join(" · ")}</p>
        ${background.description ? `<p>${escapeHtml(background.description)}</p>` : ""}
      </div>
    </section>
  `;
}

function renderEducation(page, number) {
  const education = page.education;
  if (!education.institution && !education.degree && !education.year) {
    return "";
  }
  const ui = page.ui;
  return `
    <section id="education" class="content-section slim-section" aria-labelledby="education-title">
      ${renderSectionLabel(number, ui.education)}
      <div class="text-panel">
        <h2 id="education-title">${escapeHtml(ui.education)}</h2>
        ${education.institution ? `<p class="strong-line">${escapeHtml(education.institution)}</p>` : ""}
        ${[education.degree, education.year].filter(Boolean).length ? `<p>${[education.degree, education.year].filter(Boolean).map(escapeHtml).join(" · ")}</p>` : ""}
      </div>
    </section>
  `;
}

function renderContacts(page, number) {
  if (!page.contacts.length) {
    return "";
  }
  const ui = page.ui;
  return `
    <section id="contacts" class="content-section contacts-section" aria-labelledby="contacts-title">
      ${renderSectionLabel(number, ui.contacts)}
      <div>
        <h2 id="contacts-title">${escapeHtml(ui.contacts)}</h2>
        ${renderContactList(page, "contact-grid")}
      </div>
    </section>
  `;
}

function renderContactList(page, className) {
  if (!page.contacts.length) {
    return "";
  }
  return `
    <ul class="${className}">
      ${page.contacts.map((contact) => `
        <li>
          <span>${escapeHtml(contact.label || contact.value)}</span>
          ${contact.href ? `<a href="${escapeAttr(contact.href)}">${escapeHtml(contact.value || contact.href)}</a>` : `<strong>${escapeHtml(contact.value)}</strong>`}
        </li>
      `).join("")}
    </ul>
  `;
}

function renderFooter(page) {
  const footer = page.footer || page.languages;
  const alias = '<span id="interests" class="anchor-alias" aria-hidden="true"></span>';
  if (!footer) {
    return `<footer class="site-footer">${alias}</footer>`;
  }
  return `<footer class="site-footer">${alias}<p>${escapeHtml(footer)}</p></footer>`;
}

function renderSectionLabel(number, label) {
  return `
    <div class="section-label" aria-hidden="true">
      <span>${escapeHtml(number)}</span>
      <strong>${escapeHtml(label)}</strong>
    </div>
  `;
}

function renderBulletList(items) {
  return `<ul class="bullet-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderTagList(items, className) {
  if (!items.length) {
    return "";
  }
  return `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderLinks(links) {
  if (!links || !links.length) {
    return "";
  }
  return `<p class="link-row">${links.map((link) => `<a href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}</p>`;
}

function getVisibleSections(page) {
  const available = {
    experience: hasEmployment(page.employment),
    projects: page.projects.length || page.projectIntro,
    "other-projects": page.otherProjects.length,
    skills: page.skills.length,
    background: page.background.company || page.background.role || page.background.description,
    education: page.education.institution || page.education.degree || page.education.year,
    contacts: page.contacts.length,
  };
  const labels = {
    experience: page.ui.experience,
    projects: page.ui.projects,
    "other-projects": page.ui.otherProjects,
    skills: page.ui.skills,
    background: page.ui.background,
    education: page.ui.education,
    contacts: page.ui.contacts,
  };
  return SECTION_ORDER.filter((id) => available[id]).map((id) => ({ id, label: labels[id] }));
}

function hasEmployment(employment) {
  return Boolean(
    employment.company ||
    employment.role ||
    employment.department ||
    employment.period ||
    employment.overview ||
    employment.cases.length ||
    employment.automation
  );
}

function replaceTemplate(template, values) {
  return template.replace(/\{\{([a-zA-Z]+)\}\}/g, (_, key) => escapeTemplateValue(values[key] || "", key));
}

function escapeTemplateValue(value, key) {
  if (key === "appHtml" || key === "structuredData") {
    return String(value);
  }
  return escapeAttr(value);
}

function isNormalizedResume(input) {
  return Boolean(input && input.en && input.ru && input.en.ui && input.ru.ui);
}

function objectOrEmpty(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function strings(value) {
  return array(value).map(text).filter(Boolean);
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function truncate(value, max) {
  const clean = text(value).replace(/\s+/g, " ");
  if (clean.length <= max) {
    return clean;
  }
  return `${clean.slice(0, max - 1).trim()}...`;
}

function stableId(value) {
  const id = text(value)
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return id || "item";
}

function safeUrl(value) {
  const url = text(value);
  if (!url) {
    return "";
  }
  if (
    url.startsWith("https://") ||
    url.startsWith("http://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    url.startsWith("#")
  ) {
    return url;
  }
  return "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (Array.isArray(entry)) {
        return entry.length > 0;
      }
      return entry !== undefined && entry !== null && entry !== "";
    })
  );
}

function safeJsonForScript(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}
