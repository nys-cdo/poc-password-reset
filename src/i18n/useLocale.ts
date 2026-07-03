import { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "./locales";

/**
 * Reads the active locale from the `:lang` route segment and provides
 * locale-aware helpers for building links and switching languages while
 * preserving the current path + query (PRD §11).
 */
export function useLocale() {
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const locale: Locale = isSupportedLocale(lang) ? lang : DEFAULT_LOCALE;

  /**
   * App-relative, locale-prefixed path (e.g. `/en/faq`). Use for React Router
   * `<Link to>` and `navigate()` — the router prepends the deploy basename.
   */
  const localePath = useCallback(
    (path: string) => {
      const clean = path.replace(/^\/+/, "");
      return clean ? `/${locale}/${clean}` : `/${locale}`;
    },
    [locale],
  );

  /**
   * Full href including the deploy base path (e.g. `/poc-password-reset/en/faq`).
   * Use for RAW anchors that bypass React Router — plain `<a href>` and NYSDS
   * `href`/`homepageLink` props (nys-button, nys-dropdownmenuitem, nys-globalheader).
   * The router's basename does NOT touch these, so the base must be baked in.
   * `BASE_URL` is "/" in dev and "/poc-password-reset/" in the production build.
   */
  const localeHref = useCallback(
    (path: string) => `${import.meta.env.BASE_URL}${localePath(path).slice(1)}`,
    [localePath],
  );

  /** Switch locale, keeping the same sub-path + query string. */
  const switchLocale = useCallback(
    (next: Locale) => {
      const rest = location.pathname.replace(/^\/[^/]+/, "");
      navigate(`/${next}${rest}${location.search}`);
    },
    [location.pathname, location.search, navigate],
  );

  return { locale, localePath, localeHref, switchLocale };
}
