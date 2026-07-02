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

  /** Prefix an app-relative path (without locale) with the active locale. */
  const localePath = useCallback(
    (path: string) => {
      const clean = path.replace(/^\/+/, "");
      return clean ? `/${locale}/${clean}` : `/${locale}`;
    },
    [locale],
  );

  /** Switch locale, keeping the same sub-path + query string. */
  const switchLocale = useCallback(
    (next: Locale) => {
      const rest = location.pathname.replace(/^\/[^/]+/, "");
      navigate(`/${next}${rest}${location.search}`);
    },
    [location.pathname, location.search, navigate],
  );

  return { locale, localePath, switchLocale };
}
