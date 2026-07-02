import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NysGlobalFooter, NysUnavFooter } from "@nysds/components/react";

import { useLocale } from "../i18n/useLocale";

export function SiteFooter() {
  const { t } = useTranslation();
  const { localePath } = useLocale();

  return (
    <footer>
      <NysGlobalFooter
        agencyName={t("footer.agencyName")}
        homepageLink="https://its.ny.gov"
      >
        <ul>
          <li>
            <Link to={localePath("")}>{t("footer.aboutGovArc")}</Link>
          </li>
          <li>
            <Link to={localePath("privacy")}>{t("footer.privacy")}</Link>
          </li>
          <li>
            <Link to={localePath("accessibility")}>
              {t("footer.accessibility")}
            </Link>
          </li>
        </ul>
      </NysGlobalFooter>

      <NysUnavFooter />
    </footer>
  );
}
