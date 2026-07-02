interface BreadcrumbItemProps {
  label: string;
  /** Destination URL for the crumb. Omit/ignored on the current (last) crumb. */
  link?: string;
  isLast?: boolean;
}

/**
 * A single crumb for `nys-breadcrumbs`. NYSDS reads a slotted `<ol>` of plain
 * `<li>` children: it pulls each `<li>`'s inner `<a href>` (href + text) and
 * rebuilds the trail in its shadow DOM, treating an `<li>` with no anchor as the
 * current page. So a crumb is just an `<li>` with an anchor (links) or text
 * (current). `nys-breadcrumbitem` is not a real element here. See
 * docs/nysds-notes.md.
 */
export function BreadcrumbItem({ label, link, isLast }: BreadcrumbItemProps) {
  return <li>{link && !isLast ? <a href={link}>{label}</a> : label}</li>;
}
