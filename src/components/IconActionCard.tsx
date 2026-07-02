import { NysButton, NysIcon } from "@nysds/components/react";

import { NysCard } from "../ds-custom";

interface IconActionCardProps {
  icon: string;
  title: string;
  text: string;
  linkLabel: string;
  /** Locale-resolved internal path. */
  to: string;
  /** Use the accent color for the icon badge (e.g. Account recovery). */
  accent?: boolean;
}

/**
 * Quick-action card: a filled circular icon badge, title, text, and a
 * call-to-action `nys-button`, composed on `nys-card` (PRD §13.1).
 */
export function IconActionCard({ icon, title, text, linkLabel, to, accent }: IconActionCardProps) {
  return (
    <NysCard heading={title} description={text}>
      <span
        slot="top"
        className={`icon-action__badge${accent ? " icon-action__badge--accent" : ""}`}
        aria-hidden="true"
      >
        <NysIcon name={icon} size="24" />
      </span>
      <NysButton slot="footer" variant="text" label={linkLabel} suffixIcon="arrow_forward" href={to} />
    </NysCard>
  );
}
