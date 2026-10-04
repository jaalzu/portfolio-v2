export type Lang = "es" | "en";

export function storedLang(): Lang | null {
  try {
    const s = localStorage.getItem("lang");
    return s === "en" || s === "es" ? s : null;
  } catch {
    return null;
  }
}

export function browserLang(): Lang {
  try {
    const nav = navigator.language ?? (navigator as { userLanguage?: string }).userLanguage ?? "es";
    return nav.toLowerCase().startsWith("en") ? "en" : "es";
  } catch {
    return "es";
  }
}

/**
 * Resolution order:
 * 1. Manual choice in localStorage (only ever written by the toggle button)
 * 2. Browser language (follow it, but never persist detection)
 * 3. Spanish default
 */
export function resolveLang(): Lang {
  return storedLang() ?? browserLang();
}

export function rootLang(): Lang {
  return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "es";
}

export function applyLangToRoot(lang: Lang) {
  const root = document.documentElement;
  root.setAttribute("data-lang", lang);
  root.lang = lang;
}

/** Persist ONLY when the user explicitly toggles. */
export function persistLang(lang: Lang) {
  try {
    localStorage.setItem("lang", lang);
  } catch {
    // private mode etc. — lang still applies for this session
  }
}
