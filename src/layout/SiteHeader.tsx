import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  NysButton,
  NysDropdownMenu,
  NysDropdownMenuItem,
  NysGlobalHeader,
  NysUnavHeader,
} from "@nysds/components/react";

import { isSupportedLocale } from "../i18n/locales";
import { useLocale } from "../i18n/useLocale";

const HELP_TRIGGER_ID = "site-header-help";

// Restrict the unav-header Translate menu to the two locales this site actually
// supports (the component defaults to 14). Must be set imperatively as an element
// property — the React wrapper drops the `languages` prop (see
// docs/nysds-bug-unavheader-languages-react.md).
const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

/**
 * Detail shape emitted by `nys-unavheader`'s `nys-language-select` event.
 * The wrapper does not surface this as an `onNys*` prop, so we bind it natively.
 */
interface LanguageSelectDetail {
  language: { code: string; label: string };
}

export function SiteHeader() {
  const { t } = useTranslation();
  const { localePath, localeHref, switchLocale } = useLocale();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The `nys-language-select` event is composed + bubbles, so we listen on a
    // wrapping element. We can't use a ref on <NysUnavHeader> itself: its wrapper
    // (unlike NysButton) never forwards `ref` to the element. We rely on the
    // component's default language list, which matches the demo's 14 (PRD §8.1).
    const el = headerRef.current;
    if (!el) return;

    // Set the Translate language list imperatively (prop is dropped by the wrapper).
    const unav = el.querySelector("nys-unavheader") as (HTMLElement & { languages?: unknown }) | null;
    if (unav) unav.languages = SUPPORTED_LANGUAGES;

    const onLanguageSelect = (event: Event) => {
      // Suppress the default Smartling redirect for every option (unsupported
      // languages are parity stubs for v1); switch in-app only for en/es.
      event.preventDefault();
      const code = (event as CustomEvent<LanguageSelectDetail>).detail?.language?.code;
      if (isSupportedLocale(code)) switchLocale(code);
    };

    el.addEventListener("nys-language-select", onLanguageSelect);
    return () => el.removeEventListener("nys-language-select", onLanguageSelect);
  }, [switchLocale]);

  return (
    <div ref={headerRef}>
      <NysUnavHeader hideSearch />

      <NysGlobalHeader
        appName={t("appName")}
        homepageLink={localeHref("")}
      >
        <ul>
          <li>
            <Link to={localePath("")}>{t("nav.home")}</Link>
          </li>
          <li>
            <Link to={localePath("resident/knowledge")}>
              {t("nav.knowledgeBase")}
            </Link>
          </li>
          <li>
            {/* Submenu trigger; the dropdown enhances it. Real href is the
                no-JS fallback (Help → FAQ). See PRD §8.2 / open risk #2. */}
            <a id={HELP_TRIGGER_ID} href={localeHref("faq")}>
              {t("nav.help")}
            </a>
          </li>
        </ul>

        {/* Signed-out actions live in the built-in user-actions slot (PRD §8.2). */}
        <div slot="user-actions" className="site-header__actions">
          <NysButton
            variant="outline"
            label={t("userActions.signIn")}
            href={localeHref("resident/a/tickets")}
          />
          <NysButton
            variant="filled"
            label={t("userActions.createAccount")}
            href={localeHref("resident/a/tickets")}
          />
        </div>
      </NysGlobalHeader>

      {/* Help submenu attaches to its trigger by id (PRD §8.2 / §10.1). */}
      <NysDropdownMenu id="site-header-help-menu" for={HELP_TRIGGER_ID}>
        <NysDropdownMenuItem label={t("nav.faq")} href={localeHref("faq")} />
        <NysDropdownMenuItem
          label={t("nav.accessibility")}
          href={localeHref("accessibility")}
        />
        <NysDropdownMenuItem
          label={t("nav.contactSupport")}
          href={localeHref("faq")}
        />
      </NysDropdownMenu>
    </div>
  );
}
