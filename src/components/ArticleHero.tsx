import { useTranslation } from "react-i18next";
import { NysBreadcrumbs, NysIcon } from "@nysds/components/react";

import { BreadcrumbItem } from "./BreadcrumbItem";
import { useLocale } from "../i18n/useLocale";
import heroImg from "../assets/hero-williamsburg-bridge.jpg";

interface ArticleHeroProps {
  title: string;
  description: string;
  author: string;
  views: number;
  readTime: string;
}

/**
 * State-blue article hero with breadcrumb trail, title, description, and a meta
 * row (read time, author, views) (PRD §13.4). A state-blue tint over the
 * bridge photo (same approach as the home hero) backs the band; link/text
 * tokens are overridden to their reverse variants in CSS so the breadcrumb
 * reads on the dark band.
 */
export function ArticleHero({ title, description, author, views, readTime }: ArticleHeroProps) {
  const { t } = useTranslation(["article", "common"]);
  // Breadcrumbs render as raw <a href> (slotted into nys-breadcrumbs), so they
  // bypass the router basename — use localeHref to include the deploy base path.
  const { localeHref } = useLocale();

  return (
    <section className="article-hero" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="nys-grid-container">
        <NysBreadcrumbs ariaLabel={title}>
          <ol>
            <BreadcrumbItem label={t("common:nav.home")} link={localeHref("")} />
            <BreadcrumbItem
              label={t("common:nav.knowledgeBase")}
              link={localeHref("resident/knowledge")}
            />
            <BreadcrumbItem label={title} isLast />
          </ol>
        </NysBreadcrumbs>

        <h1 className="article-hero__title">{title}</h1>
        <p className="article-hero__desc">{description}</p>

        <div className="article-hero__meta">
          <span className="article-hero__metaitem">
            <NysIcon name="schedule" size="16" />
            {readTime}
          </span>
          <span className="article-hero__metaitem">
            <NysIcon name="account_circle" size="16" />
            {t("article:meta.by", { author })}
          </span>
          <span className="article-hero__metaitem">
            <NysIcon name="visibility" size="16" />
            {t("article:meta.views", { count: views })}
          </span>
        </div>
      </div>
    </section>
  );
}
