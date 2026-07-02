import { NysIcon } from "@nysds/components/react";

export interface IconFeature {
  icon: string;
  title: string;
  text: string;
}

interface IconFeatureListProps {
  items: IconFeature[];
  /** Accessible label for the list region. */
  ariaLabel?: string;
}

/**
 * Grid of icon + title + text features (PRD §13.5). Icons are decorative;
 * meaning is carried by the adjacent text.
 */
export function IconFeatureList({ items, ariaLabel }: IconFeatureListProps) {
  return (
    <ul className="icon-feature-list nys-grid-row nys-grid-gap-400" aria-label={ariaLabel}>
      {items.map((item) => (
        <li
          className="icon-feature nys-grid-col-12 nys-tablet:nys-grid-col-6"
          key={item.title}
        >
          <span className="icon-feature__icon" aria-hidden="true">
            <NysIcon name={item.icon} size="32" />
          </span>
          <div className="icon-feature__text">
            <h3 className="icon-feature__title">{item.title}</h3>
            <p className="icon-feature__desc">{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
