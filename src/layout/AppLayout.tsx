import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NysBacktotop, NysSkipnav } from "@nysds/components/react";

import { DEFAULT_LOCALE, dirForLocale, isSupportedLocale } from "../i18n/locales";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/**
 * Locale-aware page chrome (PRD §8 order):
 * skipnav → unavheader → globalheader → main → backtotop → footer(globalfooter, unavfooter).
 * Also validates the `:lang` segment and keeps i18n + <html lang>/<dir> in sync.
 */
export function AppLayout() {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  const valid = isSupportedLocale(lang);
  const locale = valid ? lang : DEFAULT_LOCALE;

  useEffect(() => {
    if (!valid) return;
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dirForLocale(locale);
  }, [valid, locale, i18n]);

  // Unknown/empty locale → redirect to the default locale home.
  if (!valid) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  return (
    <>
      <NysSkipnav href="#main-content" />
      <SiteHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <NysBacktotop />
      <SiteFooter />
    </>
  );
}
