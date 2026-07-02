import type { ReactNode } from "react";

interface CalloutProps {
  title: string;
  children: ReactNode;
  /** Heading level for the callout title (default 2). */
  headingLevel?: 2 | 3 | 4;
}

/**
 * Bordered emphasis box built from DS tokens (PRD §10.2 / §13.5 / §13.7).
 */
export function Callout({ title, children, headingLevel = 2 }: CalloutProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <aside className="callout">
      <Heading className="callout__title">{title}</Heading>
      <div className="callout__body">{children}</div>
    </aside>
  );
}
