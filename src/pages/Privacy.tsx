import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { NysBadge } from "@nysds/components/react";

import { PageHeader } from "../components/PageHeader";
import { Callout } from "../components/Callout";
import { ContactPanel } from "../components/ContactPanel";

interface PrivacySection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

export function Privacy() {
  const { t } = useTranslation(["privacy", "common"]);

  const sections = t("privacy:sections", {
    returnObjects: true,
  }) as PrivacySection[];

  return (
    <div className="nys-grid-container content-page content-stack">
      <PageHeader
        title={t("common:pageTitles.privacy")}
        badge={<NysBadge label={t("privacy:effectiveBadge")} intent="neutral" />}
      />

      <div className="prose">
        <p>{t("privacy:intro")}</p>

        {sections.map((section) => (
          <Fragment key={section.id}>
            <section aria-labelledby={`privacy-${section.id}`}>
              <h2 id={`privacy-${section.id}`}>{section.title}</h2>
              {section.paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
              {section.list ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
            {section.id === "security" ? (
              <Callout title={t("privacy:securityCallout.title")} headingLevel={3}>
                <p>{t("privacy:securityCallout.body")}</p>
              </Callout>
            ) : null}
          </Fragment>
        ))}
      </div>

      <ContactPanel
        title={t("privacy:contact.title")}
        body={t("privacy:contact.body")}
        rows={[
          {
            label: t("privacy:contact.emailLabel"),
            value: t("privacy:contact.email"),
            href: `mailto:${t("privacy:contact.email")}`,
          },
        ]}
      />
    </div>
  );
}
