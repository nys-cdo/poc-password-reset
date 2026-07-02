import { useTranslation } from "react-i18next";

import { PageHeader } from "../components/PageHeader";
import { Callout } from "../components/Callout";
import { IconFeatureList, type IconFeature } from "../components/IconFeatureList";
import { ContactPanel } from "../components/ContactPanel";

// Icons are decorative (aria-hidden); meaning is carried by the adjacent text.
// Chosen from the shipped NYSDS icon set (~82 curated icons).
const FEATURE_ICONS = [
  "check_circle", // keyboard navigation
  "language", // screen reader support
  "visibility", // readable contrast
  "height", // resizable content
  "schedule", // reduced motion
  "info", // clear language
];

export function Accessibility() {
  const { t } = useTranslation(["accessibility", "common"]);

  const featureItems = t("accessibility:features.items", {
    returnObjects: true,
  }) as Array<{ title: string; text: string }>;
  const features: IconFeature[] = featureItems.map((item, index) => ({
    icon: FEATURE_ICONS[index] ?? "check_circle",
    title: item.title,
    text: item.text,
  }));

  const standards = t("accessibility:standards.items", {
    returnObjects: true,
  }) as string[];
  const testing = t("accessibility:testing.items", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="nys-grid-container content-page content-stack">
      <PageHeader
        title={t("common:pageTitles.accessibility")}
        lead={t("accessibility:intro")}
      />

      <Callout title={t("accessibility:commitment.title")}>
        <p>{t("accessibility:commitment.body")}</p>
      </Callout>

      <section className="section-stack" aria-labelledby="a11y-features-heading">
        <h2 id="a11y-features-heading" className="section-heading">
          {t("accessibility:features.title")}
        </h2>
        <IconFeatureList
          items={features}
          ariaLabel={t("accessibility:features.title")}
        />
      </section>

      <section className="section-stack prose" aria-labelledby="a11y-standards-heading">
        <h2 id="a11y-standards-heading" className="section-heading">
          {t("accessibility:standards.title")}
        </h2>
        <ul>
          {standards.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section-stack prose" aria-labelledby="a11y-testing-heading">
        <h2 id="a11y-testing-heading" className="section-heading">
          {t("accessibility:testing.title")}
        </h2>
        <ul>
          {testing.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <ContactPanel
        title={t("accessibility:report.title")}
        body={t("accessibility:report.body")}
        note={t("accessibility:report.response")}
        rows={[
          {
            label: t("accessibility:report.emailLabel"),
            value: t("accessibility:report.email"),
            href: `mailto:${t("accessibility:report.email")}`,
          },
        ]}
      />
    </div>
  );
}
