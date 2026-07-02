import { NysButton } from "@nysds/components/react";

export type ArticleView = "list" | "grid";

interface ViewToggleProps {
  view: ArticleView;
  onChange: (view: ArticleView) => void;
  groupLabel: string;
  listLabel: string;
  gridLabel: string;
}

/** Grid/List view toggle (PRD §13.3). Default view is List. */
export function ViewToggle({ view, onChange, groupLabel, listLabel, gridLabel }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label={groupLabel}>
      <NysButton
        variant={view === "list" ? "filled" : "outline"}
        prefixIcon="menu"
        label={listLabel}
        onClick={() => onChange("list")}
      />
      <NysButton
        variant={view === "grid" ? "filled" : "outline"}
        prefixIcon="filter_list"
        label={gridLabel}
        onClick={() => onChange("grid")}
      />
    </div>
  );
}
