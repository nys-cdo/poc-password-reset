import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NysAlert, NysPagination } from "@nysds/components/react";

import { PageHeader } from "../components/PageHeader";
import { SearchBar } from "../components/SearchBar";
import { ViewToggle, type ArticleView } from "../components/ViewToggle";
import { CategorySidebar } from "../components/CategorySidebar";
import { ArticleListRow } from "../components/ArticleListRow";
import { ArticleCard } from "../components/ArticleCard";
import { articles } from "../data/articles";
import { categories } from "../data/categories";
import { useLocale } from "../i18n/useLocale";
import heroImg from "../assets/hero-williamsburg-bridge.jpg";

const PAGE_SIZE = 6;

export function KnowledgeBase() {
  const { t } = useTranslation(["kb", "common", "articles"]);
  const { localePath, localeHref } = useLocale();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<ArticleView>("list");
  const [page, setPage] = useState(1);

  const resolved = useMemo(
    () =>
      articles.map((article) => ({
        article,
        title: t(`articles:${article.titleKey}` as "articles:data-privacy.title"),
        excerpt: t(`articles:${article.excerptKey}` as "articles:data-privacy.excerpt"),
      })),
    [t],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resolved.filter(({ article, title, excerpt }) => {
      const inCategory = category === "all" || article.categoryId === category;
      const inQuery =
        !q || title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [resolved, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const categoryItems = categories.map((c) => ({
    id: c.id,
    label: t(`kb:${c.labelKey}` as "kb:categories.all"),
    count: c.count,
  }));

  return (
    <div className="nys-grid-container content-page">
      <PageHeader title={t("common:pageTitles.knowledge")} lead={t("kb:subtitle")} />

      <div className="nys-margin-t-600 nys-margin-b-400">
        <SearchBar
          value={query}
          onChange={(value) => {
            setQuery(value);
            resetPage();
          }}
          label={t("kb:search.label")}
          placeholder={t("kb:search.placeholder")}
          buttonLabel={t("kb:search.button")}
        />
      </div>

      <div className="kb-toolbar nys-margin-b-400">
        <p className="kb-toolbar__count" aria-live="polite">
          {t("kb:results.count", { count: filtered.length })}
        </p>
        <ViewToggle
          view={view}
          onChange={setView}
          groupLabel={t("kb:view.label")}
          listLabel={t("kb:view.list")}
          gridLabel={t("kb:view.grid")}
        />
      </div>

      <div className="nys-grid-row nys-grid-gap-500">
        <div className="nys-grid-col-12 nys-desktop:nys-grid-col-3">
          <CategorySidebar
            categories={categoryItems}
            activeId={category}
            onSelect={(id) => {
              setCategory(id);
              resetPage();
            }}
            heading={t("kb:categoriesHeading")}
            label={t("kb:categoriesLabel")}
          />
        </div>

        <div className="nys-grid-col-12 nys-desktop:nys-grid-col-9">
          {pageItems.length === 0 ? (
            <NysAlert type="info" heading={t("kb:empty.heading")}>
              {t("kb:empty.body")}
            </NysAlert>
          ) : view === "list" ? (
            <div className="article-list">
              {pageItems.map(({ article, title, excerpt }) => (
                <ArticleListRow
                  key={article.id}
                  title={title}
                  excerpt={excerpt}
                  category={t(`kb:categories.${article.categoryId}` as "kb:categories.cybersecurity")}
                  readTime={t("kb:readTime", { count: article.readMinutes })}
                  to={localePath(`resident/knowledge/${article.slug}`)}
                />
              ))}
            </div>
          ) : (
            <div className="nys-grid-row nys-grid-gap-400">
              {pageItems.map(({ article, title, excerpt }) => (
                <div
                  key={article.id}
                  className="nys-grid-col-12 nys-tablet:nys-grid-col-6"
                >
                  <ArticleCard
                    image={heroImg}
                    title={title}
                    excerpt={excerpt}
                    category={t(`kb:categories.${article.categoryId}` as "kb:categories.cybersecurity")}
                    readLabel={t("kb:readArticle")}
                    to={localeHref(`resident/knowledge/${article.slug}`)}
                  />
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="nys-margin-t-600">
              <NysPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNysChange={(event) => {
                  if (event instanceof CustomEvent) setPage(event.detail.page as number);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
