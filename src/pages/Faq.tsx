import { useTranslation } from "react-i18next";
import { NysAccordion, NysAccordionItem } from "@nysds/components/react";

import { PageHeader } from "../components/PageHeader";
import { ContactPanel } from "../components/ContactPanel";
import { faqs } from "../data/faqs";

export function Faq() {
  const { t } = useTranslation(["faq", "common"]);

  return (
    <div className="nys-grid-container content-page content-stack">
      <PageHeader title={t("common:pageTitles.faq")} lead={t("faq:subtitle")} />

      <NysAccordion bordered>
        {faqs.map((faq, index) => (
          <NysAccordionItem
            key={faq.id}
            heading={t(`faq:${faq.questionKey}` as "faq:items.whatIsGovArc.q")}
            expanded={index === 0}
          >
            <p>{t(`faq:${faq.answerKey}` as "faq:items.whatIsGovArc.a")}</p>
          </NysAccordionItem>
        ))}
      </NysAccordion>

      <ContactPanel
        title={t("faq:contact.title")}
        body={t("faq:contact.body")}
        rows={[
          {
            label: t("faq:contact.emailLabel"),
            value: t("faq:contact.email"),
            href: `mailto:${t("faq:contact.email")}`,
          },
          { label: t("faq:contact.hoursLabel"), value: t("faq:contact.hours") },
        ]}
      />
    </div>
  );
}
