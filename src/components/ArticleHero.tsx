import { useTranslation } from "react-i18next";
import { NysBreadcrumbs, NysIcon } from "@nysds/components/react";

import { BreadcrumbItem } from "./BreadcrumbItem";
import { useLocale } from "../i18n/useLocale";

interface ArticleHeroProps {
  title: string;
  description: string;
  author: string;
  views: number;
  readTime: string;
}

/**
 * State-blue article hero with breadcrumb trail, title, description, and a meta
 * row (read time, author, views) (PRD §13.4). Link/text tokens are overridden
 * to their reverse variants in CSS so the breadcrumb reads on the dark band.
 */
export function ArticleHero({ title, description, author, views, readTime }: ArticleHeroProps) {
  const { t } = useTranslation(["article", "common"]);
  const { localePath } = useLocale();

  return (
    <section className="article-hero">
      <div className="nys-grid-container">
        <NysBreadcrumbs ariaLabel={title}>
          <ol>
            <BreadcrumbItem label={t("common:nav.home")} link={localePath("")} />
            <BreadcrumbItem
              label={t("common:nav.knowledgeBase")}
              link={localePath("resident/knowledge")}
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
