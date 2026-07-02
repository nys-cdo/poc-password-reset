// Locale configuration shared across routing and i18n.

/** Locales that are fully translated and switchable in-app. */
export const SUPPORTED_LOCALES = ["en", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isSupportedLocale(value: string | undefined): value is Locale {
  return value !== undefined && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Language codes that render right-to-left. Designed-for per PRD §11 even though
 * these locales are stubbed for v1, so components must stay logical-property safe.
 */
const RTL_CODES = new Set(["ar", "ur", "yi"]);

export function dirForLocale(code: string): "ltr" | "rtl" {
  return RTL_CODES.has(code) ? "rtl" : "ltr";
}

/**
 * The demo's 14-language menu. Matches the default `languages` array that
 * `nys-unavheader` ships (see PRD §8.1). We pass it explicitly so each option is
 * wired to our router locale switch instead of the default Smartling redirect.
 * Only `en` and `es` switch in-app; the remaining entries are parity stubs (v1).
 */
export interface LanguageOption {
  code: string;
  label: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "zh", label: "中文" },
  { code: "zh-traditional", label: "繁體中文" },
  { code: "yi", label: "יידיש" },
  { code: "ru", label: "Русский" },
  { code: "bn", label: "বাংলা" },
  { code: "ko", label: "한국어" },
  { code: "ht", label: "Kreyòl Ayisyen" },
  { code: "it", label: "Italiano" },
  { code: "ar", label: "العربية" },
  { code: "pl", label: "Polski" },
  { code: "fr", label: "Français" },
  { code: "ur", label: "اردو" },
];
