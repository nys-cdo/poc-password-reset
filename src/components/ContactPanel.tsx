import { NysAlert } from "@nysds/components/react";

export interface ContactRow {
  label: string;
  value: string;
  /** If set, the value renders as a link (e.g. `mailto:` or `tel:`). */
  href?: string;
}

interface ContactPanelProps {
  title: string;
  body: string;
  rows: ContactRow[];
  note?: string;
  type?: "info" | "base" | "warning";
}

/**
 * Contact/help panel built on `nys-alert` with a labeled detail list
 * (PRD §10.1 / §13.2 / §13.5 / §13.7).
 */
export function ContactPanel({ title, body, rows, note, type = "info" }: ContactPanelProps) {
  return (
    <NysAlert type={type} heading={title}>
      <div className="contact-panel">
        <p className="contact-panel__body">{body}</p>
        <dl className="contact-panel__list">
          {rows.map((row) => (
            <div className="contact-panel__row" key={row.label}>
              <dt className="contact-panel__label">{row.label}</dt>
              <dd className="contact-panel__value">
                {row.href ? <a href={row.href}>{row.value}</a> : row.value}
              </dd>
            </div>
          ))}
        </dl>
        {note ? <p className="contact-panel__note">{note}</p> : null}
      </div>
    </NysAlert>
  );
}
