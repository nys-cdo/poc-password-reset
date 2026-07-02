import { useTranslation } from "react-i18next";
import { NysAlert, NysButton } from "@nysds/components/react";

import { PageHeader } from "../components/PageHeader";
import { useLocale } from "../i18n/useLocale";

/**
 * Tickets — unauthenticated (auth-required) state only (PRD §13.8 / §15).
 * A warning alert plus a sign-in prompt; no signed-in ticket list in v1.
 */
export function Tickets() {
  const { t } = useTranslation(["tickets", "common"]);
  const { localePath } = useLocale();

  return (
    <div className="nys-grid-container content-page content-stack">
      <PageHeader title={t("common:pageTitles.tickets")} />

      <NysAlert type="warning" heading={t("tickets:auth.heading")}>
        {t("tickets:auth.body")}
      </NysAlert>

      <section className="signin-panel" aria-labelledby="signin-heading">
        <h2 id="signin-heading" className="signin-panel__heading">
          {t("tickets:signIn.heading")}
        </h2>
        <p className="signin-panel__text">{t("tickets:signIn.text")}</p>
        <NysButton
          fullWidth
          variant="filled"
          label={t("common:userActions.signIn")}
          href={localePath("")}
        />
      </section>
    </div>
  );
}
