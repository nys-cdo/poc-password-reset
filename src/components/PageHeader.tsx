import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  lead?: string;
  /** Optional trailing content on the title row (e.g. an effective-date badge). */
  badge?: ReactNode;
}

/**
 * Content-page header: the page <h1> plus an optional lead paragraph and badge.
 * Used by FAQ, Accessibility, and Privacy (PRD §13.2/.5/.7).
 */
export function PageHeader({ title, lead, badge }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__titlerow">
        <h1 className="page-header__title">{title}</h1>
        {badge ? <div className="page-header__badge">{badge}</div> : null}
      </div>
      {lead ? <p className="page-header__lead">{lead}</p> : null}
    </header>
  );
}
