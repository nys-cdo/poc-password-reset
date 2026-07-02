import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./locales";
import enCommon from "./en/common.json";
import esCommon from "./es/common.json";
import enHome from "./en/home.json";
import esHome from "./es/home.json";
import enFaq from "./en/faq.json";
import esFaq from "./es/faq.json";
import enAccessibility from "./en/accessibility.json";
import esAccessibility from "./es/accessibility.json";
import enPrivacy from "./en/privacy.json";
import esPrivacy from "./es/privacy.json";
import enArticles from "./en/articles.json";
import esArticles from "./es/articles.json";
import enArticle from "./en/article.json";
import esArticle from "./es/article.json";
import enKb from "./en/kb.json";
import esKb from "./es/kb.json";
import enPasswordReset from "./en/passwordReset.json";
import esPasswordReset from "./es/passwordReset.json";
import enTickets from "./en/tickets.json";
import esTickets from "./es/tickets.json";

export const defaultNS = "common";

export const resources = {
  en: {
    common: enCommon,
    home: enHome,
    faq: enFaq,
    accessibility: enAccessibility,
    privacy: enPrivacy,
    articles: enArticles,
    article: enArticle,
    kb: enKb,
    passwordReset: enPasswordReset,
    tickets: enTickets,
  },
  es: {
    common: esCommon,
    home: esHome,
    faq: esFaq,
    accessibility: esAccessibility,
    privacy: esPrivacy,
    articles: esArticles,
    article: esArticle,
    kb: esKb,
    passwordReset: esPasswordReset,
    tickets: esTickets,
  },
} as const;

export const namespaces = [
  "common",
  "home",
  "faq",
  "accessibility",
  "privacy",
  "articles",
  "article",
  "kb",
  "passwordReset",
  "tickets",
] as const;

// Derive the initial language from the URL's locale segment so the first paint
// is already correct. Client-side locale changes are handled by AppLayout.
function initialLocale(): string {
  if (typeof window !== "undefined") {
    const segment = window.location.pathname.split("/")[1];
    if ((SUPPORTED_LOCALES as readonly string[]).includes(segment)) {
      return segment;
    }
  }
  return DEFAULT_LOCALE;
}

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale(),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: SUPPORTED_LOCALES,
  defaultNS,
  ns: namespaces as unknown as string[],
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
