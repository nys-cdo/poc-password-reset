import { Link } from "react-router-dom";
import { NysIcon } from "@nysds/components/react";

export interface QuickActionItem {
  icon: string;
  label: string;
  /** Locale-resolved internal path. */
  to: string;
}

interface QuickActionsProps {
  heading: string;
  items: QuickActionItem[];
}

/** Sidebar "Quick Actions" panel (PRD §13.6 / §10.2). */
export function QuickActions({ heading, items }: QuickActionsProps) {
  return (
    <aside className="quick-actions-panel" aria-label={heading}>
      <h2 className="quick-actions-panel__heading">{heading}</h2>
      <ul className="quick-actions-panel__list">
        {items.map((item) => (
          <li key={item.label}>
            <Link className="quick-actions-panel__link" to={item.to}>
              <NysIcon name={item.icon} size="20" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
