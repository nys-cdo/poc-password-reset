import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useLocale } from "../i18n/useLocale";

/**
 * Catch-all 404. A single semantic <h1>, a short explanation, and a
 * locale-aware link back to the homepage.
 */
export function NotFound() {
  const { t } = useTranslation();
  const { localePath } = useLocale();

  return (
    <section className="nys-grid-container content-page">
      <h1 className="page-header__title nys-margin-b-400">
        {t("pageTitles.notFound")}
      </h1>
      <p>{t("notFound.body")}</p>
      <p className="nys-margin-t-400">
        <Link to={localePath("")}>{t("notFound.back")}</Link>
      </p>
    </section>
  );
}
