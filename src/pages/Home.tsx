import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NysIcon } from "@nysds/components/react";

import { TaskSelector } from "../components/TaskSelector";
import { IconActionCard } from "../components/IconActionCard";
import { ArticleCard } from "../components/ArticleCard";
import { featuredArticles } from "../data/articles";
import { useLocale } from "../i18n/useLocale";
import heroImg from "../assets/hero-williamsburg-bridge.jpg";

export function Home() {
  const { t } = useTranslation(["home", "common", "articles", "kb"]);
  const { localePath } = useLocale();

  return (
    <>
      <section className="home-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="nys-grid-container">
          <div className="nys-grid-row nys-grid-gap-500 home-hero__row">
            <div className="nys-grid-col-12 nys-desktop:nys-grid-col-6 home-hero__text">
              <h1 className="home-hero__title">{t("common:pageTitles.home")}</h1>
              <p className="home-hero__subtitle">{t("home:hero.subtitle")}</p>
              <Link className="home-hero__search" to={localePath("resident/knowledge")}>
                {t("home:hero.searchLink")}
                <NysIcon name="arrow_forward" size="16" />
              </Link>
            </div>
            <div className="nys-grid-col-12 nys-desktop:nys-grid-col-6 home-hero__aside">
              <TaskSelector />
            </div>
          </div>
        </div>
      </section>

      <div className="nys-grid-container nys-margin-t-700 nys-margin-b-1200">
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="section-heading">
            {t("home:quickActions.title")}
          </h2>
          <div className="nys-grid-row nys-grid-gap-400">
            <div className="nys-grid-col-12 nys-tablet:nys-grid-col-4">
              <IconActionCard
                icon="search"
                title={t("home:quickActions.items.search.title")}
                text={t("home:quickActions.items.search.text")}
                linkLabel={t("home:quickActions.items.search.link")}
                to={localePath("resident/knowledge")}
              />
            </div>
            <div className="nys-grid-col-12 nys-tablet:nys-grid-col-4">
              <IconActionCard
                icon="schedule"
                title={t("home:quickActions.items.ticket.title")}
                text={t("home:quickActions.items.ticket.text")}
                linkLabel={t("home:quickActions.items.ticket.link")}
                to={localePath("resident/a/tickets")}
              />
            </div>
            <div className="nys-grid-col-12 nys-tablet:nys-grid-col-4">
              <IconActionCard
                icon="refresh"
                accent
                title={t("home:quickActions.items.recovery.title")}
                text={t("home:quickActions.items.recovery.text")}
                linkLabel={t("home:quickActions.items.recovery.link")}
                to={localePath("resident/password-reset/forgot?method=security")}
              />
            </div>
          </div>
        </section>

        <section className="nys-margin-t-1200" aria-labelledby="kb-preview-heading">
          <div className="section-header nys-margin-b-600">
            <div className="section-header__titles">
              <h2 id="kb-preview-heading" className="section-heading">
                {t("home:kbPreview.title")}
              </h2>
              <p className="section-header__desc">{t("home:kbPreview.description")}</p>
            </div>
            <Link to={localePath("resident/knowledge")}>
              {t("home:kbPreview.viewAll")}
            </Link>
          </div>
          <div className="nys-grid-row nys-grid-gap-400">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                className="nys-grid-col-12 nys-tablet:nys-grid-col-6 nys-desktop:nys-grid-col-3"
              >
                <ArticleCard
                  image={heroImg}
                  title={t(`articles:${article.titleKey}` as "articles:data-privacy.title")}
                  excerpt={t(`articles:${article.excerptKey}` as "articles:data-privacy.excerpt")}
                  category={t(`kb:categories.${article.categoryId}` as "kb:categories.cybersecurity")}
                  readLabel={t("home:kbPreview.readArticle")}
                  to={localePath(`resident/knowledge/${article.slug}`)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
