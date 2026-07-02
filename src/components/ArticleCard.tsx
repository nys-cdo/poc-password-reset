import { NysButton } from "@nysds/components/react";

import { NysCard } from "../ds-custom";

interface ArticleCardProps {
  image: string;
  title: string;
  excerpt: string;
  category: string;
  readLabel: string;
  /** Locale-resolved article path. */
  to: string;
}

/**
 * Knowledge-base article card: media image, category preheading, title,
 * excerpt, and a "Read article" button — composed on `nys-card` (PRD §13.1).
 */
export function ArticleCard({ image, title, excerpt, category, readLabel, to }: ArticleCardProps) {
  return (
    <NysCard preheading={category} heading={title} description={excerpt} variant="bordered">
      <img slot="media" className="article-card__image" src={image} alt="" />
      <NysButton slot="footer" label={readLabel} href={to} />
    </NysCard>
  );
}
