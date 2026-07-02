export interface CategoryItem {
  id: string;
  label: string;
  count: number;
}

interface CategorySidebarProps {
  categories: CategoryItem[];
  activeId: string;
  onSelect: (id: string) => void;
  heading: string;
  label: string;
}

/**
 * Selectable category list with counts (PRD §13.3). Uses native buttons for
 * accessible single-select (aria-pressed) filtering.
 */
export function CategorySidebar({ categories, activeId, onSelect, heading, label }: CategorySidebarProps) {
  return (
    <nav className="category-sidebar" aria-label={label}>
      <h2 className="category-sidebar__heading">{heading}</h2>
      <ul className="category-sidebar__list">
        {categories.map((category) => {
          const active = category.id === activeId;
          return (
            <li key={category.id}>
              <button
                type="button"
                className={`category-sidebar__item${active ? " category-sidebar__item--active" : ""}`}
                aria-pressed={active}
                onClick={() => onSelect(category.id)}
              >
                <span className="category-sidebar__label">{category.label}</span>
                <span className="category-sidebar__count">({category.count})</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
