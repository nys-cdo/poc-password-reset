import { Link } from "react-router-dom";
import { NysBadge, NysIcon } from "@nysds/components/react";

interface ArticleListRowProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  to: string;
}

/** List-view article row (PRD §13.3). */
export function ArticleListRow({ title, excerpt, category, readTime, to }: ArticleListRowProps) {
  return (
    <article className="article-row">
      <h3 className="article-row__title">
        <Link to={to}>{title}</Link>
      </h3>
      <p className="article-row__excerpt">{excerpt}</p>
      <div className="article-row__meta">
        <span className="article-row__read">
          <NysIcon name="schedule" size="16" />
          {readTime}
        </span>
        <NysBadge label={category} intent="neutral" size="sm" />
      </div>
    </article>
  );
}
