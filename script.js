const i18n = {
  ru: {
    nav: {
      about: "Обо мне",
      skills: "Навыки",
      projects: "Проекты",
      contacts: "Контакты",
    },
    hero: {
      eyebrow: "Resume Page",
      title: "Middle Backend Python Engineer (DevOps-oriented)",
      subtitle:
        "Проектирую и поддерживаю production-сервисы: backend API, Telegram-боты, LLM-интеграции, PostgreSQL и эксплуатацию инфраструктуры.",
      facts: [
        "Санкт-Петербург",
        "Дата рождения: 04.11.1994 (31)",
        "Текущий фокус: Backend + DevOps развитие",
        "Полная занятость, возможны командировки и переезд",
      ],
    },
    about: {
      title: "Позиционирование",
      p1: "Профиль без завышения: уверенный Middle backend-инженер с сильной практикой в продовой разработке и сопровождении собственных сервисов.",
      p2: "DevOps-часть практическая: Linux, Nginx, SSL, DNS, UFW, Docker/Compose, базовый опыт K8s/werf и observability-стека. K8s и мониторинг использовались в формате внедрения и развертывания, без заявления глубокой SRE-экспертизы.",
    },
    skills: {
      title: "Skill Matrix",
      subtitle: "Реалистичная самооценка по текущим проектам",
      note: "Уровни отражают практику из реальных проектов, а не сертификаты.",
    },
    experience: {
      title: "Текущая занятость",
    },
    projects: {
      title: "Проекты",
      subtitle: "7 ключевых проектов с кратким вкладом и результатом",
    },
    interests: {
      title: "Личные качества и интересы",
      qualitiesTitle: "Качества",
      interestsTitle: "Интересы",
    },
    contacts: {
      title: "Контакты",
    },
    labels: {
      stack: "Стек",
      contribution: "Вклад",
      result: "Результат",
      period: "Период",
      level: "Уровень",
      architecture: "Архитектурный срез",
    },
    footer: {
      text: "Одностраничное резюме для интервью-процесса. Целевой хостинг: GitHub Pages.",
    },
  },
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      contacts: "Contacts",
    },
    hero: {
      eyebrow: "Resume Page",
      title: "Middle Backend Python Engineer (DevOps-oriented)",
      subtitle:
        "I build and operate production services: backend APIs, Telegram bots, LLM integrations, PostgreSQL systems, and practical infrastructure operations.",
      facts: [
        "Saint Petersburg",
        "Date of Birth: 1994-11-04 (31)",
        "Current focus: Backend + DevOps growth",
        "Full-time, open to business trips and relocation",
      ],
    },
    about: {
      title: "Positioning",
      p1: "No inflated title: strong Middle backend engineer with deep practical experience in production development and support of personal products.",
      p2: "DevOps scope is practical: Linux, Nginx, SSL, DNS, UFW, Docker/Compose, foundational K8s/werf and observability stack. Kubernetes and monitoring were used in deployment and implementation scenarios, not framed as deep SRE expertise.",
    },
    skills: {
      title: "Skill Matrix",
      subtitle: "Realistic self-assessment based on shipped projects",
      note: "Levels reflect hands-on delivery experience, not certificate count.",
    },
    experience: {
      title: "Current Employment",
    },
    projects: {
      title: "Projects",
      subtitle: "7 key projects with concise contribution and outcome",
    },
    interests: {
      title: "Personal Qualities and Interests",
      qualitiesTitle: "Qualities",
      interestsTitle: "Interests",
    },
    contacts: {
      title: "Contacts",
    },
    labels: {
      stack: "Stack",
      contribution: "Contribution",
      result: "Result",
      period: "Period",
      level: "Level",
      architecture: "Architecture snapshot",
    },
    footer: {
      text: "Single-page resume for interview flow. Hosting target: GitHub Pages.",
    },
  },
};

const skills = [
  {
    level: 4,
    name: {
      ru: "Python Backend / FastAPI / AsyncIO",
      en: "Python Backend / FastAPI / AsyncIO",
    },
    note: {
      ru: "Production API, асинхронные сервисы, интеграции и эксплуатация.",
      en: "Production APIs, asynchronous services, integrations, and operations.",
    },
  },
  {
    level: 4,
    name: {
      ru: "PostgreSQL / SQLAlchemy / Alembic",
      en: "PostgreSQL / SQLAlchemy / Alembic",
    },
    note: {
      ru: "Проектирование схем, миграции, работа с тяжелыми структурами БД.",
      en: "Schema design, migrations, and handling complex database structures.",
    },
  },
  {
    level: 4,
    name: {
      ru: "Telegram Bot Engineering (aiogram)",
      en: "Telegram Bot Engineering (aiogram)",
    },
    note: {
      ru: "Несколько production-ботов с собственной логикой и интеграциями.",
      en: "Multiple production bots with custom logic and integrations.",
    },
  },
  {
    level: 3,
    name: {
      ru: "LLM Integration (OpenAI / OpenRouter)",
      en: "LLM Integration (OpenAI / OpenRouter)",
    },
    note: {
      ru: "Structured outputs, fallback-парсинг и прикладные LLM-фичи.",
      en: "Structured outputs, fallback parsing, and practical LLM features.",
    },
  },
  {
    level: 4,
    name: {
      ru: "Docker / Docker Compose",
      en: "Docker / Docker Compose",
    },
    note: {
      ru: "Сборка, деплой и сопровождение многоконтейнерных сервисов.",
      en: "Build, deployment, and support of multi-container services.",
    },
  },
  {
    level: 3,
    name: {
      ru: "CI/CD (GitHub Actions)",
      en: "CI/CD (GitHub Actions)",
    },
    note: {
      ru: "Автоматизация проверки и доставки изменений через workflow-пайплайны.",
      en: "Automating validation and delivery with workflow-based pipelines.",
    },
  },
  {
    level: 3,
    name: {
      ru: "Linux Ops / Nginx / SSL / DNS / UFW",
      en: "Linux Ops / Nginx / SSL / DNS / UFW",
    },
    note: {
      ru: "Серверная эксплуатация: домены, сертификаты, проксирование, портовые правила.",
      en: "Server operations: domains, certificates, proxying, and firewall rules.",
    },
  },
  {
    level: 2,
    name: {
      ru: "Kubernetes / werf / helm",
      en: "Kubernetes / werf / helm",
    },
    note: {
      ru: "Практика в формате внедрения и разового разворачивания.",
      en: "Practical usage in implementation and one-time deployment scenarios.",
    },
  },
  {
    level: 2,
    name: {
      ru: "Prometheus / Grafana / Loki",
      en: "Prometheus / Grafana / Loki",
    },
    note: {
      ru: "Базовая observability-настройка для продовых сервисов.",
      en: "Foundational observability setup for production services.",
    },
  },
];

const experience = [
  {
    company: {
      ru: "ООО «АЙ БИ КЕЙ»",
      en: "IBK LLC",
    },
    role: {
      ru: "Главный системный администратор",
      en: "Lead System Administrator",
    },
    period: {
      ru: "09.2025 — по настоящее время",
      en: "Sep 2025 — Present",
    },
    location: {
      ru: "Санкт-Петербург",
      en: "Saint Petersburg",
    },
    bullets: {
      ru: [
        "Разработка и администрирование импортозамещающих решений.",
        "Эксплуатация Linux-сервисов и инфраструктурных компонентов.",
      ],
      en: [
        "Development and administration of import-substitution solutions.",
        "Operations support for Linux services and infrastructure components.",
      ],
    },
  },
  {
    company: {
      ru: "ИП / частная практика / фриланс",
      en: "Private Practice / Freelance",
    },
    role: {
      ru: "Backend-разработчик / Администратор",
      en: "Backend Developer / Administrator",
    },
    period: {
      ru: "02.2023 — по настоящее время",
      en: "Feb 2023 — Present",
    },
    location: {
      ru: "Санкт-Петербург",
      en: "Saint Petersburg",
    },
    bullets: {
      ru: [
        "Полный цикл разработки собственных backend и bot-проектов.",
        "Администрирование и продовая поддержка сервисов.",
      ],
      en: [
        "End-to-end development of personal backend and bot projects.",
        "Operations and production support for active services.",
      ],
    },
  },
];

const projects = [
  {
    name: "BoltFather",
    period: { ru: "02.2024 — по н.в.", en: "Feb 2024 — Present" },
    stack: ["FastAPI", "aiogram", "PostgreSQL", "Redis", "Docker Compose", "GitHub Actions", "Prometheus", "Grafana", "Loki"],
    contribution: {
      ru: "Переписал проект с нуля; веду backend, бота, инфраструктурную часть и администрирование.",
      en: "Rebuilt the project from scratch; continue handling backend, bot, infrastructure, and operations.",
    },
    result: {
      ru: "Сервис стабильно работает в production с мониторингом, логированием и предсказуемым деплоем.",
      en: "The service runs stably in production with monitoring, logging, and predictable deployments.",
    },
    architecture: {
      ru: [
        "Telegram Users",
        "  -> Bot Service (aiogram)",
        "     -> Backend API (FastAPI)",
        "        -> PostgreSQL",
        "        -> Redis",
        "        -> Scheduler jobs (APScheduler)",
        "Metrics/Logs -> Prometheus + Loki -> Grafana",
      ].join("\n"),
      en: [
        "Telegram Users",
        "  -> Bot Service (aiogram)",
        "     -> Backend API (FastAPI)",
        "        -> PostgreSQL",
        "        -> Redis",
        "        -> Scheduler jobs (APScheduler)",
        "Metrics/Logs -> Prometheus + Loki -> Grafana",
      ].join("\n"),
    },
  },
  {
    name: "Deliveries",
    period: { ru: "01.2025 — по н.в.", en: "Jan 2025 — Present" },
    stack: ["FastAPI", "PostgreSQL", "PostGIS", "React", "TypeScript", "Docker", "GitHub Actions", "OSRM", "OpenAI API"],
    contribution: {
      ru: "Индивидуальная разработка backend и интеграция LLM-функций; использование Cursor/Codex в разработке.",
      en: "Individual backend development and LLM feature integration; active use of Cursor/Codex.",
    },
    result: {
      ru: "Автоматизировано распределение доставок и снижена доля ручных операций.",
      en: "Delivery distribution was automated, reducing manual operations.",
    },
    architecture: {
      ru: [
        "Web UI (React/TS)",
        "  -> Nginx",
        "     -> FastAPI Backend",
        "        -> PostgreSQL + PostGIS",
        "        -> OSRM (routing engine)",
        "        -> OpenAI API (LLM fallback)",
        "        -> Telegram auth/notifications",
      ].join("\n"),
      en: [
        "Web UI (React/TS)",
        "  -> Nginx",
        "     -> FastAPI Backend",
        "        -> PostgreSQL + PostGIS",
        "        -> OSRM (routing engine)",
        "        -> OpenAI API (LLM fallback)",
        "        -> Telegram auth/notifications",
      ].join("\n"),
    },
  },
  {
    name: "user-balances",
    period: { ru: "02.2025 — 07.2025", en: "Feb 2025 — Jul 2025" },
    stack: ["FastAPI", "PostgreSQL", "Redis", "RabbitMQ", "taskiq-aio-pika", "Alembic", "WebSockets", "Docker", "werf"],
    contribution: {
      ru: "Индивидуальная реализация многосервисной backend-архитектуры со сложной структурой БД и фоновыми процессами.",
      en: "Individual implementation of a multi-service backend architecture with complex data model and background processing.",
    },
    result: {
      ru: "Собран масштабируемый pipeline обработки on-chain и сервисных данных.",
      en: "Built a scalable pipeline for on-chain and service data processing.",
    },
    architecture: {
      ru: [
        "TON WebSocket sources",
        "  -> block_parser service",
        "     -> RabbitMQ broker",
        "        -> taskiq workers",
        "           -> PostgreSQL",
        "FastAPI API <-> Redis cache",
        "checker-bot service -> moderation/approval flow",
      ].join("\n"),
      en: [
        "TON WebSocket sources",
        "  -> block_parser service",
        "     -> RabbitMQ broker",
        "        -> taskiq workers",
        "           -> PostgreSQL",
        "FastAPI API <-> Redis cache",
        "checker-bot service -> moderation/approval flow",
      ].join("\n"),
    },
  },
  {
    name: "scale_api",
    period: { ru: "03.2025", en: "Mar 2025" },
    stack: ["FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "Redis", "WebSockets", "Docker"],
    contribution: {
      ru: "Индивидуальная разработка API и фоновых циклов сбора staking/on-chain данных.",
      en: "Individual development of API and background loops for staking/on-chain data collection.",
    },
    result: {
      ru: "Организован стабильный процесс периодической синхронизации и обработки данных.",
      en: "Established a stable periodic synchronization and processing pipeline.",
    },
    architecture: {
      ru: [
        "TON APIs / staking data",
        "  -> background fetch loop (every 60s)",
        "     -> FastAPI service layer",
        "        -> PostgreSQL",
        "        -> Redis cache",
        "REST endpoints -> external clients",
      ].join("\n"),
      en: [
        "TON APIs / staking data",
        "  -> background fetch loop (every 60s)",
        "     -> FastAPI service layer",
        "        -> PostgreSQL",
        "        -> Redis cache",
        "REST endpoints -> external clients",
      ].join("\n"),
    },
  },
  {
    name: "Printly3D",
    period: { ru: "08.2025 — 11.2025", en: "Aug 2025 — Nov 2025" },
    stack: ["Python", "aiogram", "PostgreSQL", "SQLAlchemy", "Alembic", "Docker"],
    contribution: {
      ru: "Индивидуальная разработка Telegram-бота и backend-части.",
      en: "Individual development of Telegram bot and backend services.",
    },
    result: {
      ru: "Собран рабочий продукт для автоматизации процессов в нише 3D-печати.",
      en: "Delivered a working product for 3D-printing workflow automation.",
    },
    architecture: {
      ru: [
        "Telegram User",
        "  -> aiogram bot",
        "     -> app services / business logic",
        "        -> PostgreSQL",
        "        -> file storage (static/storage)",
        "Startup -> Alembic migrations -> bot runtime",
      ].join("\n"),
      en: [
        "Telegram User",
        "  -> aiogram bot",
        "     -> app services / business logic",
        "        -> PostgreSQL",
        "        -> file storage (static/storage)",
        "Startup -> Alembic migrations -> bot runtime",
      ].join("\n"),
    },
  },
  {
    name: "token_price",
    period: { ru: "11.2024 — по н.в.", en: "Nov 2024 — Present" },
    stack: ["aiogram", "Redis", "pytonapi", "pytoniq", "TON SDK", "Docker"],
    contribution: {
      ru: "Индивидуальная разработка и поддержка сервиса уведомлений по рынку токенов.",
      en: "Individual development and maintenance of token market notification service.",
    },
    result: {
      ru: "Проект остается активным и поддерживается в рабочем состоянии.",
      en: "The project remains active and is continuously maintained.",
    },
    architecture: {
      ru: [
        "Token data providers (TON APIs)",
        "  -> bot processing loop",
        "     -> Redis cache / state",
        "        -> Telegram channels/users",
        "Docker Compose runtime (bot + redis)",
      ].join("\n"),
      en: [
        "Token data providers (TON APIs)",
        "  -> bot processing loop",
        "     -> Redis cache / state",
        "        -> Telegram channels/users",
        "Docker Compose runtime (bot + redis)",
      ].join("\n"),
    },
  },
  {
    name: "fanton_rent_bot",
    period: { ru: "04.2025 — 10.2025", en: "Apr 2025 — Oct 2025" },
    stack: ["Python", "aiogram", "aiohttp", "Redis", "pytonapi", "Docker", "GitHub Actions"],
    contribution: {
      ru: "Индивидуальная разработка бота для аренды игровых активов.",
      en: "Individual development of a bot for in-game asset rentals.",
    },
    result: {
      ru: "Запущен и доведен до рабочей production-логики в рамках проекта Fanton.",
      en: "Delivered to production-grade behavior within the Fanton project context.",
    },
    architecture: {
      ru: [
        "Telegram User",
        "  -> aiogram bot handlers",
        "     -> Fanton API / TonAPI adapters",
        "        -> Redis reservation/cache layer",
        "           -> response + action workflows",
        "Docker Compose runtime (bot + redis)",
      ].join("\n"),
      en: [
        "Telegram User",
        "  -> aiogram bot handlers",
        "     -> Fanton API / TonAPI adapters",
        "        -> Redis reservation/cache layer",
        "           -> response + action workflows",
        "Docker Compose runtime (bot + redis)",
      ].join("\n"),
    },
  },
];

const personalInterestsData = {
  qualities: {
    ru: ["Целеустремленность", "Вовлеченность", "Открытость"],
    en: ["Goal-oriented", "Engaged", "Open-minded"],
  },
  hobbies: {
    ru: [
      "Спорт (футбол, горные лыжи, биатлон)",
      "Путешествия",
      "Развитие в бизнес-направлении",
      "Автоматизация и инженерия",
    ],
    en: [
      "Sports (football, alpine skiing, biathlon)",
      "Travel",
      "Business growth",
      "Automation and engineering",
    ],
  },
};

const contacts = [
  {
    key: "phone",
    label: { ru: "Телефон", en: "Phone" },
    value: "+7 (999) 022-60-61",
    href: "tel:+79990226061",
  },
  {
    key: "email",
    label: { ru: "Email", en: "Email" },
    value: "volynkin.s04@gmail.com",
    href: "mailto:volynkin.s04@gmail.com",
  },
  {
    key: "telegram",
    label: { ru: "Telegram", en: "Telegram" },
    value: "@volynkin_s",
    href: "https://t.me/volynkin_s",
  },
  {
    key: "github",
    label: { ru: "GitHub", en: "GitHub" },
    value: "github.com/volynkinss",
    href: "https://github.com/volynkinss",
  },
  {
    key: "city",
    label: { ru: "Город", en: "City" },
    value: "Санкт-Петербург / Saint Petersburg",
    href: "",
  },
];

let currentLang = "ru";
let sectionObserver = null;

function setPageTitle(lang) {
  document.title =
    lang === "ru"
      ? "Сергей Волынкин | Middle Backend Python Engineer"
      : "Sergey Volynkin | Middle Backend Python Engineer";
}

function resolve(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), obj);
}

function applyStaticText(lang) {
  const dict = i18n[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = resolve(dict, key);
    if (typeof value === "string") {
      el.textContent = value;
    }
  });
  document.documentElement.lang = lang;
}

function levelLabel(level, lang) {
  const ru = ["Начальный", "Базовый", "Рабочий", "Уверенный", "Сильный"];
  const en = ["Intro", "Foundational", "Working", "Strong", "Advanced"];
  return lang === "ru" ? ru[level - 1] : en[level - 1];
}

function renderFacts(lang) {
  const node = document.getElementById("hero-facts");
  node.innerHTML = "";
  i18n[lang].hero.facts.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "fact-item";
    chip.textContent = item;
    node.appendChild(chip);
  });
}

function renderSkills(lang) {
  const node = document.getElementById("skills-grid");
  node.innerHTML = "";
  skills.forEach((skill) => {
    const card = document.createElement("article");
    card.className = "skill-card";
    card.innerHTML = `
      <div class="skill-head">
        <p class="skill-name">${skill.name[lang]}</p>
      </div>
      <p class="skill-level-row">
        <span class="skill-level">${i18n[lang].labels.level}: ${levelLabel(skill.level, lang)}</span>
      </p>
      <div class="meter"><span style="width:${(skill.level / 5) * 100}%"></span></div>
      <p class="skill-note">${skill.note[lang]}</p>
    `;
    node.appendChild(card);
  });
}

function renderExperience(lang) {
  const node = document.getElementById("experience-list");
  node.innerHTML = "";
  experience.forEach((item) => {
    const article = document.createElement("article");
    article.className = "experience-item";
    const bullets = item.bullets[lang]
      .map((line) => `<li>${line}</li>`)
      .join("");
    article.innerHTML = `
      <p class="experience-title">${item.company[lang]}</p>
      <p class="experience-role">${item.role[lang]}</p>
      <p class="experience-meta">${item.period[lang]} | ${item.location[lang]}</p>
      <ul>${bullets}</ul>
    `;
    node.appendChild(article);
  });
}

function renderProjects(lang) {
  const node = document.getElementById("projects-accordion");
  node.innerHTML = "";
  projects.forEach((project, idx) => {
    const details = document.createElement("details");
    details.className = "project-item";
    if (idx === 0) details.open = true;
    const stack = project.stack.map((s) => `<span>${s}</span>`).join("");
    details.innerHTML = `
      <summary>
        <strong>${project.name}</strong>
        <span class="summary-right">
          <span>${project.period[lang]}</span>
          <i class="summary-chevron" aria-hidden="true"></i>
        </span>
      </summary>
      <div class="project-body">
        <p class="project-meta"><strong>${i18n[lang].labels.period}:</strong> ${project.period[lang]}</p>
        <p><strong>${i18n[lang].labels.stack}:</strong></p>
        <div class="stack">${stack}</div>
        <p class="project-contrib"><strong>${i18n[lang].labels.contribution}:</strong> ${project.contribution[lang]}</p>
        <p class="project-result"><strong>${i18n[lang].labels.result}:</strong> ${project.result[lang]}</p>
        <p class="project-arch-title"><strong>${i18n[lang].labels.architecture}:</strong></p>
        <pre class="project-arch">${project.architecture[lang]}</pre>
      </div>
    `;
    node.appendChild(details);
  });
}

function renderInterests(lang) {
  const qualitiesNode = document.getElementById("qualities");
  const interestsNode = document.getElementById("interests-list");
  if (!qualitiesNode || !interestsNode) {
    return;
  }
  qualitiesNode.innerHTML = "";
  interestsNode.innerHTML = "";

  personalInterestsData.qualities[lang].forEach((item) => {
    const chip = document.createElement("span");
    chip.textContent = item;
    qualitiesNode.appendChild(chip);
  });

  personalInterestsData.hobbies[lang].forEach((item) => {
    const chip = document.createElement("span");
    chip.textContent = item;
    interestsNode.appendChild(chip);
  });
}

function renderContacts(lang) {
  const node = document.getElementById("contacts-grid");
  node.innerHTML = "";
  contacts.forEach((item) => {
    const article = document.createElement("article");
    article.className = "contact-item";
    const value = item.href
      ? `<a href="${item.href}" ${item.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>${item.value}</a>`
      : item.value;
    article.innerHTML = `
      <p class="contact-label">${item.label[lang]}</p>
      <p class="contact-value">${value}</p>
    `;
    node.appendChild(article);
  });
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("resume-lang", lang);
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.langBtn === lang);
  });
  applyStaticText(lang);
  renderFacts(lang);
  renderSkills(lang);
  renderExperience(lang);
  renderProjects(lang);
  renderInterests(lang);
  renderContacts(lang);
  setPageTitle(lang);
}

function setupRevealObserver() {
  const nodes = [...document.querySelectorAll(".reveal")];
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  nodes.forEach((node) => observer.observe(node));
}

function setupActiveNav() {
  const links = [...document.querySelectorAll("[data-nav-link]")];
  const linkMap = new Map(
    links.map((link) => [link.getAttribute("href").slice(1), link])
  );
  const sections = [...document.querySelectorAll(".observed-section[id]")].filter(
    (section) => linkMap.has(section.id)
  );

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href").slice(1);
      setActive(id);
    });
  });

  setActive("about");

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const visibility = new Map();
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibility.set(entry.target.id, entry.intersectionRatio);
      });
      let bestId = null;
      let bestRatio = 0;
      sections.forEach((section) => {
        const ratio = visibility.get(section.id) || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = section.id;
        }
      });
      if (bestId) {
        setActive(bestId);
      }
    },
    {
      threshold: [0.16, 0.3, 0.5, 0.75],
      rootMargin: "-22% 0px -58% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function init() {
  const preferred = localStorage.getItem("resume-lang");
  const lang = preferred === "en" ? "en" : "ru";

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.dataset.langBtn);
    });
  });

  setupRevealObserver();
  setupActiveNav();
  applyLanguage(lang);
}

init();
