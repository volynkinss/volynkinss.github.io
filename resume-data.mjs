export const resume = {
  en: {
    name: 'Sergey Volynkin',
    headline: 'Software Implementation & Support Engineer',
    location: 'Saint Petersburg',
    availability: 'Saint Petersburg: office or hybrid; also open to remote and contract work. Russian and international companies; relocation with employer support.',
    summary: 'I implement and support applications on Linux: Docker deployment, service integrations, troubleshooting and open-source customization. At IBK, I support a remote-access gateway serving 70–100 users daily and integrate applications with Keycloak. Python development and changes to existing Go codebases help me automate operations and resolve application issues.',
    metaDescription: 'Sergey Volynkin — Software Implementation & Support Engineer. Linux, Docker, application integration, Keycloak, PostgreSQL and troubleshooting. Saint Petersburg; open to remote work.',
    ui: { skip: 'Skip to content', navLabel: 'Resume sections', languageLabel: 'Resume language', print: 'Print', backToTop: 'Back to top', email: 'Email', phone: 'Phone', github: 'GitHub', telegram: 'Telegram', experience: 'Work experience', projects: 'Selected projects', otherProjects: 'Other engineering projects', skills: 'Key competencies', background: 'Earlier experience outside IT', education: 'Education', contacts: 'Get in touch', projectLink: 'Visit project', moreProjects: 'Earlier software projects' },
    contacts: [
      { label: 'Email', value: 'volynkin.s04@gmail.com', href: 'mailto:volynkin.s04@gmail.com' },
      { label: 'Telegram', value: '@volynkin_s', href: 'https://t.me/volynkin_s' },
      { label: 'GitHub', value: 'github.com/volynkinss', href: 'https://github.com/volynkinss' },
      { label: 'Phone', value: '+7 (999) 022-60-61', href: 'tel:+79990226061' },
    ],
    employment: {
      company: 'IBK LLC', role: 'Lead System Administrator', department: 'Import Substitution Solutions Department', period: 'Sep 2025 — Present',
      overview: 'Implement and support open-source solutions in a six-person engineering team. My scope covers Linux operations, deployment, application and identity integrations, troubleshooting and source code changes.',
      cases: [
        { id: 'rdpgw', title: 'RDPGW', subtitle: 'Open-source customization · remote access', status: 'Production · 70–100 daily users',
          bullets: ['Added terminal farm / RDS collection support to an existing Go gateway, plus SQLite-backed connection history, active-session views and filtered Excel export.', 'Build, deploy and support this business-critical gateway for remote work; investigate authentication and connection issues.'],
          stack: ['Go', 'Linux', 'Docker', 'SQLite', 'OIDC'] },
        { id: 'dashboard', title: 'Dashboard', subtitle: 'Internal service catalog',
          bullets: ['Built a FastAPI portal with a PostgreSQL service catalog, Dashy YAML import and a bilingual interface.', 'Integrated Keycloak/OIDC sign-in, group-based service visibility, persistent sessions and audit logging; packaged the portal with Docker Compose.'],
          stack: ['Python', 'FastAPI', 'Jinja2', 'PostgreSQL', 'Keycloak', 'Docker Compose'], links: [{ label: 'Source on GitHub', url: 'https://github.com/volynkinss/dashboard' }] },
        { id: 'pulp', title: 'Pulp', subtitle: 'Package and artifact repositories', status: 'In progress',
          bullets: ['Evaluate and deploy Pulp in Docker: repositories, remotes, distributions, reverse proxy and authentication integration.', 'Design the operating model for upstream retrieval and local artifact reuse, including serving previously downloaded artifacts without external internet access.'],
          stack: ['Pulp', 'Docker', 'Reverse proxy'] },
        { id: 'keycloak', title: 'Keycloak', subtitle: 'Application identity integration',
          bullets: ['Administer Keycloak and integrate applications with SAML 2.0 and OIDC together with my manager.', 'Troubleshoot SAMLResponse assertions, NameID and attribute mapping, ACS flows and service provider / identity provider interactions.'],
          stack: ['Keycloak', 'SAML 2.0', 'OIDC'] },
      ],
      automation: 'Automated export of Postman API collections and environments for migration to Hoppscotch.',
    },
    projectIntro: "Projects outside my IBK role: a co-owned product and my own services built for clients.",
    projects: [
      {
        id: "supplier-parser",
        title: "Supplier Price Parser / Price Order",
        status: "In active development",
        role: "Project owner · requirements, development and deployment",
        contribution: "Developed with substantial Codex and AI assistance: I define task scope and acceptance criteria, review generated changes, run relevant checks and validate operator workflows.",
        description: "A client system for catalog matching, price comparison and order preparation using supplier price lists and Telegram messages.",
        bullets: [
          "A unified Telegram/XLSX ingestion workflow normalizes products and reuses confirmed catalog mappings. Operators review and confirm LLM suggestions from OpenRouter; supplier offers can be compared with PiterGSM retail prices.",
          "PostgreSQL-backed background jobs use leases, retries and worker recovery, with protection against stale results. Source snapshots and an audit trail preserve input data and processing decisions.",
          "Operational tooling includes Prometheus/Grafana monitoring, encrypted backups to S3 and restore checks in an isolated Docker environment."
        ],
        stack: [
          "Python",
          "FastAPI",
          "PostgreSQL",
          "Telegram",
          "OpenPyXL · XLSX",
          "OpenRouter · LLM APIs",
          "Codex",
          "Docker Compose",
          "GitHub Actions",
          "Prometheus · Grafana",
          "S3 · age"
        ],
        category: "Client project"
      },
      {
        id: "boltfather",
        title: "BoltFather",
        role: "Co-owner · backend development and operations",
        category: "Co-owned product · 25% ownership",
        contribution: "Code written manually.",
        period: "Feb 2024 — Present",
        status: "Production",
        description: "Telegram community access and subscription service with TON integrations.",
        bullets: [
          "Rewrote the product and continue to develop its backend, bot and infrastructure, including deployment and operations.",
          "Automated delivery with GitHub Actions, GHCR images, SSH deployment, Alembic migrations and Docker Compose.",
          "Deployed Prometheus, Grafana and Loki/Promtail for application metrics and Docker logs; added operational reporting backed by PostgreSQL."
        ],
        stack: [
          "Python",
          "FastAPI",
          "aiogram",
          "PostgreSQL",
          "Redis",
          "Docker Compose",
          "GitHub Actions",
          "Prometheus",
          "Grafana",
          "Loki"
        ],
        links: [
          {"label":"BoltFather website","url":"https://boltfather.com/"}
        ]
      },
      {
        id: "kvartirka",
        title: "Kvartirka / RentalKeeper",
        role: "Project owner · development and deployment",
        contribution: "Code developed with substantial assistance from AI tools.",
        status: "In client use · being refined",
        description: "A short-term rental management service with bookings, payments, documents and financial planning for properties and portfolios.",
        bullets: [
          "Financial planning and plan-versus-actual reporting cover revenue, occupancy, platform and payment fees, payroll, taxes, allocated expenses and profit at property and portfolio level.",
          "RealtyCalendar webhooks import bookings, payments and refunds with duplicate-event detection and handling for stale updates and conflicts.",
          "The NestJS/Fastify API and Next.js interface use Prisma/PostgreSQL and Redis. GitHub Actions delivery includes Docker images, migrations, readiness checks, configurable API/UI canary checks and application rollback."
        ],
        stack: [
          "TypeScript",
          "NestJS",
          "Next.js · React",
          "Prisma",
          "PostgreSQL",
          "Redis",
          "Docker Compose",
          "GitHub Actions"
        ],
        links: [
          {"label":"Project website","url":"https://rentalkeeper.ru/"}
        ],
        category: "Client project"
      },
      {
        id: "deliveries",
        title: "Deliveries",
        status: "Development complete · in client use",
        role: "Project owner · development and deployment",
        contribution: "Code developed with substantial assistance from AI tools.",
        period: "Jan 2025 — Present",
        description: "Delivery planning with geographic zones, address processing and route calculation.",
        bullets: [
          "The FastAPI/PostGIS backend and React map support address imports, geocoding, courier workflows and access control.",
          "The project integrates OSRM routing, H3 zone recommendations for review and LLM fallback parsing of delivery text, with Docker and CI/CD workflows."
        ],
        stack: [
          "Python",
          "FastAPI",
          "PostgreSQL · PostGIS",
          "React · TypeScript",
          "OSRM",
          "H3",
          "Docker",
          "GitHub Actions"
        ],
        category: "Client project"
      }
    ],
    otherProjects: [
      { id: 'user-balances', title: 'User Balances', period: 'Feb 2025 — Jul 2025', description: 'Backend development for TON data processing: service APIs, block parsing, queue workers and database models.', stack: ['FastAPI', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Taskiq'] },
      { id: 'scale-api', title: 'Scale API', period: 'Mar 2025', status: 'Project closed', description: 'Developed an API and background synchronization for staking and on-chain data.', stack: ['FastAPI', 'PostgreSQL', 'Alembic', 'Docker'] },
      { id: 'printly3d', title: 'Printly3D', period: 'Aug 2025 — Nov 2025', status: 'Project closed', description: 'Developed a Telegram bot and backend for 3D-printing order workflows.', stack: ['Python', 'aiogram', 'PostgreSQL', 'Alembic', 'Docker'] },
      { id: 'token-prices', title: 'Token Prices', description: 'Built token price monitoring and Telegram notifications with TON integrations, Redis state and automated Docker deployment.', stack: ['aiogram', 'Redis', 'TON APIs', 'Docker'] },
      { id: 'fanton-rent', title: 'Fanton Rent', period: 'Apr 2025 — Oct 2025', status: 'Project closed', description: 'Developed a bot for in-game asset rentals, integrating the Fanton API with wallet and reservation workflows.', stack: ['Python', 'aiogram', 'Redis', 'TON APIs', 'GitHub Actions'] },
    ],
    skills: [
      {
        title: "Implementation and operations",
        description: "Application deployment and troubleshooting on Linux.",
        items: [
          "Linux",
          "Docker · Docker Compose",
          "Nginx · reverse proxy",
          "Prometheus · Grafana · Loki"
        ]
      },
      {
        title: "Integrations and data",
        description: "Authentication, service access, APIs and databases.",
        items: [
          "Keycloak · SAML 2.0 · OIDC",
          "REST APIs",
          "PostgreSQL · SQLAlchemy · Alembic",
          "SQLite · Redis"
        ]
      },
      {
        title: "Automation and software changes",
        description: "Python development, existing Go code changes, application builds and delivery.",
        items: [
          "Python · FastAPI · async I/O",
          "Go — open-source customization",
          "CI/CD · GitHub Actions",
          "Pulp — implementation in progress"
        ]
      },
      {
        title: "Additional project experience",
        description: "TypeScript/NestJS/React, geospatial tools and LLM APIs in AI-assisted projects. Kubernetes, Helm and werf: basic exposure through individual deployment tasks.",
        items: [
          "TypeScript · NestJS · React/Next.js",
          "PostGIS · OSRM",
          "RabbitMQ · Taskiq",
          "aiogram · TON integrations",
          "LLM APIs",
          "Codex — scoped development and change review"
        ]
      }
    ],
    background: { company: 'M.Video-Eldorado', role: 'Sales Associate, then Sales Floor Manager', period: 'Aug 2016 — Sep 2022', description: 'Around three years managing teams of up to 20 people: organizing daily work, coordinating staff and overseeing sales-floor operations.' },
    education: { institution: 'Saint Petersburg State Institute of Technology (Technical University)', degree: 'Bachelor’s degree · Applied Informatics', year: '2017' },
    languages: 'Russian. English: read texts with occasional translation of unfamiliar words; can explain a viewpoint in simple terms.',
    footer: 'Sergey Volynkin · Saint Petersburg',
  },
  ru: {
    name: 'Сергей Волынкин',
    headline: 'Инженер по внедрению и сопровождению ПО',
    location: 'Санкт-Петербург',
    availability: 'Санкт-Петербург: офис или гибрид; также удалённая и контрактная работа. Российские и международные компании; релокация — при поддержке работодателя.',
    summary: 'Внедряю и сопровождаю приложения на Linux: развёртывание в Docker, интеграции, диагностика и доработка open-source решений. В IBK поддерживаю шлюз удалённого доступа для 70–100 пользователей в день и интегрирую приложения с Keycloak. Разработка на Python и доработка кода на Go помогают автоматизировать задачи и устранять проблемы в приложениях.',
    metaDescription: 'Сергей Волынкин — инженер по внедрению и сопровождению ПО. Linux, Docker, интеграции, Keycloak, PostgreSQL и диагностика приложений. Санкт-Петербург; офис, гибрид, удалённая работа.',
    ui: { skip: 'Перейти к содержимому', navLabel: 'Разделы резюме', languageLabel: 'Язык резюме', print: 'Печать', backToTop: 'Вернуться к началу', email: 'Почта', phone: 'Телефон', github: 'GitHub', telegram: 'Telegram', experience: 'Опыт работы', projects: 'Выбранные проекты', otherProjects: 'Другие инженерные проекты', skills: 'Ключевые компетенции', background: 'Предыдущий опыт вне IT', education: 'Образование', contacts: 'Связаться со мной', projectLink: 'Перейти к проекту', moreProjects: 'Другие программные проекты' },
    contacts: [
      { label: 'Почта', value: 'volynkin.s04@gmail.com', href: 'mailto:volynkin.s04@gmail.com' },
      { label: 'Telegram', value: '@volynkin_s', href: 'https://t.me/volynkin_s' },
      { label: 'GitHub', value: 'github.com/volynkinss', href: 'https://github.com/volynkinss' },
      { label: 'Телефон', value: '+7 (999) 022-60-61', href: 'tel:+79990226061' },
    ],
    employment: {
      company: 'ООО «Ай Би Кей»', role: 'Главный системный администратор', department: 'Отдел импортозамещающих решений', period: 'сен. 2025 — настоящее время',
      overview: 'Внедряю и сопровождаю open-source решения в инженерной команде из шести человек. Отвечаю за эксплуатацию Linux, развёртывание, интеграции приложений и аутентификации, диагностику проблем и доработку кода.',
      cases: [
        { id: 'rdpgw', title: 'RDPGW', subtitle: 'Доработка open-source шлюза удалённого доступа', status: 'В эксплуатации · 70–100 пользователей ежедневно',
          bullets: ['Добавил в существующий шлюз на Go поддержку терминальных ферм и коллекций RDS, историю подключений в SQLite, просмотр активных сеансов и выгрузку в Excel с фильтрами.', 'Собираю, развёртываю и сопровождаю критически важный шлюз удалённого доступа; диагностирую проблемы аутентификации и подключения.'],
          stack: ['Go', 'Linux', 'Docker', 'SQLite', 'OIDC'] },
        { id: 'dashboard', title: 'Dashboard', subtitle: 'Каталог внутренних сервисов',
          bullets: ['Разработал портал на FastAPI с каталогом сервисов в PostgreSQL, импортом из Dashy YAML и двуязычным интерфейсом.', 'Интегрировал вход через Keycloak/OIDC, доступ к сервисам по группам, хранение сессий и журнал действий; подготовил развёртывание в Docker Compose.'], stack: ['Python', 'FastAPI', 'Jinja2', 'PostgreSQL', 'Keycloak', 'Docker Compose'],
          links: [{ label: 'Код на GitHub', url: 'https://github.com/volynkinss/dashboard' }] },
        { id: 'pulp', title: 'Pulp', subtitle: 'Репозитории пакетов и артефактов', status: 'В процессе внедрения',
          bullets: ['Исследую и внедряю Pulp в Docker: репозитории, удалённые источники, публикации, обратное проксирование и интеграция аутентификации.', 'Прорабатываю получение артефактов из upstream и повторную выдачу локальных копий, включая доступ к ранее загруженным артефактам без внешнего интернета.'],
          stack: ['Pulp', 'Docker', 'Обратное проксирование'] },
        { id: 'keycloak', title: 'Keycloak', subtitle: 'Интеграция аутентификации приложений',
          bullets: ['Совместно с руководителем администрирую Keycloak и интегрирую приложения по SAML 2.0 и OIDC.', 'Разбираю SAMLResponse и assertions, сопоставление NameID и атрибутов, обработку ACS и взаимодействие приложения с провайдером идентификации.'],
          stack: ['Keycloak', 'SAML 2.0', 'OIDC'] },
      ],
      automation: 'Автоматизировал экспорт коллекций API и окружений Postman для переноса в Hoppscotch.',
    },
    projectIntro: "Проекты вне основной работы в IBK: продукт в совместной собственности и собственные сервисы для заказчиков.",
    projects: [
      {
        id: "supplier-parser",
        title: "Парсер прайс-листов / Price Order",
        status: "В активной разработке",
        role: "Владелец проекта · требования, разработка и развёртывание",
        contribution: "Разрабатываю с существенной помощью Codex и AI-инструментов: задаю границы задач и критерии приёмки, проверяю сгенерированные изменения, запускаю проверки и проверяю сценарии оператора.",
        description: "Система для заказчика: от прайс-листов поставщиков и сообщений Telegram до сопоставления товаров, сравнения цен и подготовки заказов.",
        bullets: [
          "Единый приём из Telegram и XLSX, нормализация товаров и повторное применение подтверждённых сопоставлений. Оператор проверяет и подтверждает LLM-подсказки через OpenRouter; предложения поставщиков можно сравнивать с розничными ценами PiterGSM.",
          "Фоновые задания в PostgreSQL: контроль владения заданием, повторные попытки, восстановление после остановки worker и защита от устаревших результатов. Снимки источников и аудит сохраняют исходные данные и решения обработки.",
          "Эксплуатационные инструменты: мониторинг Prometheus/Grafana, зашифрованные резервные копии в S3 и проверка восстановления в изолированном Docker-окружении."
        ],
        stack: [
          "Python",
          "FastAPI",
          "PostgreSQL",
          "Telegram",
          "OpenPyXL · XLSX",
          "OpenRouter · LLM API",
          "Codex",
          "Docker Compose",
          "GitHub Actions",
          "Prometheus · Grafana",
          "S3 · age"
        ],
        category: "Проект для заказчика"
      },
      {
        id: "boltfather",
        title: "BoltFather",
        role: "Совладелец · разработка бэкенда и эксплуатация",
        category: "Продукт в совместной собственности · доля 25%",
        contribution: "Код написан вручную.",
        period: "фев. 2024 — настоящее время",
        status: "В эксплуатации",
        description: "Сервис управления доступом и подписками в Telegram-сообществах с интеграциями TON.",
        bullets: [
          "Переписал продукт; продолжаю развивать бэкенд, бота и инфраструктуру, включая развёртывание и эксплуатацию.",
          "Автоматизировал доставку через GitHub Actions: образы в GHCR, развёртывание по SSH, миграции Alembic и Docker Compose.",
          "Самостоятельно развернул Prometheus, Grafana и Loki/Promtail для метрик приложения и логов Docker; добавил операционные отчёты по данным PostgreSQL."
        ],
        stack: [
          "Python",
          "FastAPI",
          "aiogram",
          "PostgreSQL",
          "Redis",
          "Docker Compose",
          "GitHub Actions",
          "Prometheus",
          "Grafana",
          "Loki"
        ],
        links: [
          {"label":"Сайт BoltFather","url":"https://boltfather.com/"}
        ]
      },
      {
        id: "kvartirka",
        title: "Kvartirka / RentalKeeper",
        role: "Владелец проекта · разработка и развёртывание",
        contribution: "Код разработан с существенным участием AI-инструментов.",
        status: "Используется заказчиком · дорабатывается",
        description: "Сервис управления посуточной арендой: бронирования, платежи, документы и финансовое планирование по объектам и портфелю.",
        bullets: [
          "Финансовое планирование и план-факт: выручка, загрузка, комиссии площадок и платёжных сервисов, зарплата, налоги, распределение расходов и прибыль по объектам и портфелю.",
          "Webhooks RealtyCalendar импортируют брони, платежи и возвраты с защитой от повторных событий и обработкой устаревших обновлений и конфликтов.",
          "API на NestJS/Fastify и интерфейс Next.js используют Prisma/PostgreSQL и Redis. Доставка через GitHub Actions включает Docker-образы, миграции, проверки готовности, настраиваемые canary-проверки API/UI и откат приложения."
        ],
        stack: [
          "TypeScript",
          "NestJS",
          "Next.js · React",
          "Prisma",
          "PostgreSQL",
          "Redis",
          "Docker Compose",
          "GitHub Actions"
        ],
        links: [
          {"label":"Сайт проекта","url":"https://rentalkeeper.ru/"}
        ],
        category: "Проект для заказчика"
      },
      {
        id: "deliveries",
        title: "Deliveries",
        status: "Разработка завершена · используется заказчиком",
        role: "Владелец проекта · разработка и развёртывание",
        contribution: "Код разработан с существенным участием AI-инструментов.",
        period: "янв. 2025 — настоящее время",
        description: "Планирование доставок: географические зоны, обработка адресов и расчёт маршрутов.",
        bullets: [
          "Бэкенд FastAPI/PostGIS и карта на React поддерживают импорт адресов, геокодирование, работу курьеров и разграничение доступа.",
          "В проект интегрированы OSRM для маршрутов, рекомендации зон H3 с проверкой оператором и резервный LLM-разбор текста; настроены Docker и CI/CD."
        ],
        stack: [
          "Python",
          "FastAPI",
          "PostgreSQL · PostGIS",
          "React · TypeScript",
          "OSRM",
          "H3",
          "Docker",
          "GitHub Actions"
        ],
        category: "Проект для заказчика"
      }
    ],
    otherProjects: [
      { id: 'user-balances', title: 'User Balances', period: 'фев. 2025 — июл. 2025', description: 'Разработка бэкенда для обработки данных TON: API, парсинг блоков, очереди задач, воркеры и модели БД.', stack: ['FastAPI', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Taskiq'] },
      { id: 'scale-api', title: 'Scale API', period: 'мар. 2025', status: 'Проект закрыт', description: 'Разработал API и фоновую синхронизацию данных стейкинга и блокчейна.', stack: ['FastAPI', 'PostgreSQL', 'Alembic', 'Docker'] },
      { id: 'printly3d', title: 'Printly3D', period: 'авг. 2025 — нояб. 2025', status: 'Проект закрыт', description: 'Разработал Telegram-бота и бэкенд для обработки заказов на 3D-печать.', stack: ['Python', 'aiogram', 'PostgreSQL', 'Alembic', 'Docker'] },
      { id: 'token-prices', title: 'Token Prices', description: 'Разработал мониторинг цен токенов и уведомления в Telegram: интеграции TON, хранение состояния в Redis и автоматизированное развёртывание Docker.', stack: ['aiogram', 'Redis', 'TON APIs', 'Docker'] },
      { id: 'fanton-rent', title: 'Fanton Rent', period: 'апр. 2025 — окт. 2025', status: 'Проект закрыт', description: 'Разработал бота для аренды игровых активов: интеграция с Fanton API, кошельками и логикой бронирования.', stack: ['Python', 'aiogram', 'Redis', 'TON APIs', 'GitHub Actions'] },
    ],
    skills: [
      {
        title: "Внедрение и эксплуатация",
        description: "Развёртывание приложений и диагностика проблем в Linux.",
        items: [
          "Linux",
          "Docker · Docker Compose",
          "Nginx · обратное проксирование",
          "Prometheus · Grafana · Loki"
        ]
      },
      {
        title: "Интеграции и данные",
        description: "Аутентификация, доступ к сервисам, API и базы данных.",
        items: [
          "Keycloak · SAML 2.0 · OIDC",
          "REST API",
          "PostgreSQL · SQLAlchemy · Alembic",
          "SQLite · Redis"
        ]
      },
      {
        title: "Автоматизация и доработка ПО",
        description: "Python и изменения существующего Go-кода; сборка и доставка приложений.",
        items: [
          "Python · FastAPI · асинхронный ввод-вывод",
          "Go — доработка open-source",
          "CI/CD · GitHub Actions",
          "Pulp — внедрение в процессе"
        ]
      },
      {
        title: "Дополнительный проектный опыт",
        description: "TypeScript/NestJS/React, геоданные и LLM API — в проектах с участием AI. Kubernetes, Helm и werf — начальный опыт в отдельных задачах развёртывания.",
        items: [
          "TypeScript · NestJS · React/Next.js",
          "PostGIS · OSRM",
          "RabbitMQ · Taskiq",
          "aiogram · интеграции TON",
          "LLM API",
          "Codex — постановка задач и проверка изменений"
        ]
      }
    ],
    background: { company: 'М.Видео-Эльдорадо', role: 'Продавец, затем менеджер торгового зала', period: 'авг. 2016 — сен. 2022', description: 'Около трёх лет управлял командами до 20 человек: организовывал ежедневную работу, координировал сотрудников и отвечал за работу торгового зала.' },
    education: { institution: 'Санкт-Петербургский государственный технологический институт (технический университет)', degree: 'Бакалавр · Прикладная информатика', year: '2017' },
    languages: 'Русский. Английский: читаю тексты, при необходимости перевожу отдельные слова; могу объяснить свою точку зрения простыми фразами.',
    footer: 'Сергей Волынкин · Санкт-Петербург',
  },
};
