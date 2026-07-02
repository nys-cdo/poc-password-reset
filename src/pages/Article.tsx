import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { NysAlert } from "@nysds/components/react";

import { ArticleHero } from "../components/ArticleHero";
import { ArticleBody, type ArticleBodyBlock } from "../components/ArticleBody";
import { ArticleFeedback } from "../components/ArticleFeedback";
import { getArticleBySlug } from "../data/articles";
import { useLocale } from "../i18n/useLocale";

export function Article() {
  const { t } = useTranslation(["article", "kb", "articles", "common"]);
  const { id } = useParams();
  const { localePath } = useLocale();

  const article = getArticleBySlug(id);

  if (!article) {
    return (
      <div className="nys-grid-container content-page article-layout">
        <h1 className="page-header__title nys-margin-b-400">
          {t("article:notFound.heading")}
        </h1>
        <NysAlert type="warning">{t("article:notFound.body")}</NysAlert>
        <p className="nys-margin-t-400">
          <Link to={localePath("resident/knowledge")}>{t("article:notFound.back")}</Link>
        </p>
      </div>
    );
  }

  const title = t(`articles:${article.titleKey}` as "articles:data-privacy.title");
  const excerpt = t(`articles:${article.excerptKey}` as "articles:data-privacy.excerpt");
  const readTime = t("kb:readTime", { count: article.readMinutes });

  const raw = t(`article:bodies.${article.id}` as "article:bodies.data-privacy", {
    returnObjects: true,
  }) as unknown;
  const generic = t("article:genericBody", { returnObjects: true }) as string[];
  const blocks: ArticleBodyBlock[] = Array.isArray(raw)
    ? (raw as ArticleBodyBlock[])
    : [
        { type: "paragraph", text: excerpt },
        ...generic.map((text): ArticleBodyBlock => ({ type: "paragraph", text })),
      ];

  return (
    <>
      <ArticleHero
        title={title}
        description={excerpt}
        author={article.author}
        views={article.views}
        readTime={readTime}
      />
      <div className="nys-grid-container content-page">
        <div className="article-layout">
          <ArticleBody blocks={blocks} sourceLabel={t("article:sourceLabel")} />
          <ArticleFeedback />
        </div>
      </div>
    </>
  );
}
