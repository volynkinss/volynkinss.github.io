import {
  buildLanguageHref,
  createMetadata,
  createStructuredData,
  getLanguageFromUrl,
  normalizeResume,
  pickInitialLanguage,
  renderApp,
  resolveLanguage,
  validateResumeData,
} from "./renderer.mjs";
import { resume } from "./resume-data.mjs";

const STORAGE_KEY = "resume-lang-v2";
const root = document.getElementById("resume-app");

validateResumeData(resume);

const state = {
  resume: normalizeResume(resume),
  lang: "en",
};
let printOpenedDisclosures = [];
let navigationFrame = 0;
let navigationLinks = [];

init();

function init() {
  state.lang = pickInitialLanguage({
    urlLang: getLanguageFromUrl(window.location.href),
    storedLang: readStoredLanguage(),
  });
  applyLanguage(state.lang, { replace: true, persist: false, updateUrl: false });

  root.addEventListener("click", (event) => {
    const languageButton = event.target.closest("[data-lang-btn]");
    if (languageButton) {
      if (shouldLetBrowserHandleLanguageLink(event, languageButton)) {
        return;
      }
      event.preventDefault();
      const nextLang = resolveLanguage(languageButton.getAttribute("data-lang-btn"));
      applyLanguage(nextLang, { replace: false, persist: true, updateUrl: true, refocusLanguage: true });
      return;
    }

    const printButton = event.target.closest("[data-print]");
    if (printButton) {
      window.print();
    }
  });

  window.addEventListener("popstate", (event) => {
    const nextLang = pickInitialLanguage({
      urlLang: getLanguageFromUrl(window.location.href) || event.state?.lang,
      storedLang: readStoredLanguage(),
    });
    applyLanguage(nextLang, { replace: true, persist: false, updateUrl: false });
  });

  window.addEventListener("beforeprint", openDisclosuresForPrint);
  window.addEventListener("afterprint", restoreDisclosuresAfterPrint);
  window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
  window.addEventListener("resize", scheduleNavigationUpdate);
  window.addEventListener("hashchange", () => {
    refreshLanguageLinks();
    scheduleNavigationUpdate();
  });
  root.addEventListener("toggle", scheduleNavigationUpdate, true);
  if (document.fonts) document.fonts.ready.then(scheduleNavigationUpdate);
}

function applyLanguage(lang, options) {
  const nextLang = resolveLanguage(lang);
  const openDisclosures = getOpenDisclosures();
  const focusedLang = document.activeElement && document.activeElement.matches("[data-lang-btn]")
    ? document.activeElement.getAttribute("data-lang-btn")
    : "";

  state.lang = nextLang;
  document.documentElement.lang = nextLang;
  document.body.dataset.lang = nextLang;
  root.innerHTML = renderApp(state.resume, nextLang, { openDisclosures });
  root.querySelector("[data-print]").hidden = false;

  if (options.persist) {
    writeStoredLanguage(nextLang);
  }

  if (options.updateUrl) {
    const href = buildLanguageHref(window.location.href, nextLang);
    window.history.pushState({ lang: nextLang }, "", href);
  } else if (options.replace) {
    window.history.replaceState({ lang: nextLang }, "", window.location.href);
  }

  updateMetadata(nextLang);
  refreshLanguageLinks();
  navigationLinks = Array.from(root.querySelectorAll("[data-nav-section]"));
  updateNavigation();

  if (options.refocusLanguage && focusedLang) {
    const button = root.querySelector(`[data-lang-btn="${focusedLang}"]`);
    if (button) {
      button.focus({ preventScroll: true });
    }
  }
}

function shouldLetBrowserHandleLanguageLink(event, element) {
  return element.tagName === "A" && (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function scheduleNavigationUpdate() {
  if (navigationFrame) return;
  navigationFrame = window.requestAnimationFrame(() => {
    navigationFrame = 0;
    updateNavigation();
  });
}

function updateNavigation() {
  const mobile = window.matchMedia("(max-width: 620px)").matches;
  const nav = root.querySelector(mobile ? ".mobile-nav" : ".site-nav");
  const stickyBar = mobile ? nav : root.querySelector(".site-header");
  const offset = (stickyBar?.getBoundingClientRect().height || 0) + 16;
  document.documentElement.style.setProperty("--navigation-offset", `${offset}px`);

  const sections = Array.from(nav?.querySelectorAll("[data-nav-section]") || [])
    .map((link) => document.getElementById(link.dataset.navSection))
    .filter(Boolean);
  let current = "";
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= offset + 1) current = section.id;
  }
  // Short final sections may never reach the sticky bar, even at the page end.
  if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1]?.id || current;
  }
  for (const link of navigationLinks) {
    if (link.dataset.navSection === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

function getOpenDisclosures() {
  return Array.from(root.querySelectorAll("[data-disclosure][open]"))
    .map((item) => item.getAttribute("data-disclosure"))
    .filter(Boolean);
}

function updateMetadata(lang) {
  const page = state.resume[nextLangOrDefault(lang)];
  const metadata = createMetadata(page, lang);
  document.title = metadata.title;
  setMeta("description", metadata.description);
  setMeta("twitter:title", metadata.title);
  setMeta("twitter:description", metadata.description);
  setMeta("twitter:image:alt", metadata.imageAlt);
  setMetaProperty("og:title", metadata.title);
  setMetaProperty("og:description", metadata.description);
  setMetaProperty("og:locale", metadata.ogLocale);
  setMetaProperty("og:image:alt", metadata.imageAlt);
  setMetaProperty("og:url", metadata.ogUrl);
  setLink("canonical", metadata.canonicalUrl);
  setAlternateLinks(metadata.alternates);

  const structuredData = document.getElementById("structured-data");
  if (structuredData) {
    structuredData.textContent = JSON.stringify(createStructuredData(page, lang), null, 2);
  }
}

function refreshLanguageLinks() {
  for (const link of root.querySelectorAll("[data-lang-btn]")) {
    const lang = resolveLanguage(link.getAttribute("data-lang-btn"));
    link.setAttribute("href", buildLanguageHref(window.location.href, lang));
    if (lang === state.lang) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

function nextLangOrDefault(lang) {
  return resolveLanguage(lang);
}

function setMeta(name, content) {
  let element = document.head.querySelector(`meta[name="${cssEscape(name)}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.append(element);
  }
  element.setAttribute("content", content);
}

function setMetaProperty(property, content) {
  let element = document.head.querySelector(`meta[property="${cssEscape(property)}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.append(element);
  }
  element.setAttribute("content", content);
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${cssEscape(rel)}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.append(element);
  }
  element.setAttribute("href", href);
}

function setAlternateLinks(alternates) {
  for (const element of document.head.querySelectorAll("link[data-resume-alternate]")) {
    element.remove();
  }
  for (const item of alternates) {
    const element = document.createElement("link");
    element.setAttribute("rel", "alternate");
    element.setAttribute("hreflang", item.lang);
    element.setAttribute("href", item.href);
    element.setAttribute("data-resume-alternate", "");
    document.head.append(element);
  }
}

function readStoredLanguage() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function writeStoredLanguage(lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Private browsing and locked-down webviews can reject storage writes.
  }
}

function openDisclosuresForPrint() {
  printOpenedDisclosures = Array.from(root.querySelectorAll("[data-disclosure]:not([open])"));
  printOpenedDisclosures.forEach((item) => {
    item.setAttribute("open", "");
  });
}

function restoreDisclosuresAfterPrint() {
  printOpenedDisclosures.forEach((item) => {
    if (item.isConnected) {
      item.removeAttribute("open");
    }
  });
  printOpenedDisclosures = [];
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }
  return String(value).replace(/"/g, '\\"');
}
