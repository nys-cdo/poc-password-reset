// Static fixture types (PRD §14). User-facing strings live in i18n; fixtures
// hold structure/ids and reference i18n keys.

export interface ArticleBlock {
  type: "heading" | "paragraph" | "list" | "image" | "video" | "source";
  /** i18n key for text blocks (heading/paragraph/source). */
  textKey?: string;
  /** i18n keys for list items. */
  itemKeys?: string[];
  /** Asset path (image) or full YouTube URL (video). */
  src?: string;
  /** i18n key for image alt text. */
  altKey?: string;
}

export interface Article {
  id: string;
  slug: string;
  /** i18n key (articles namespace) for the title. */
  titleKey: string;
  /** i18n key (articles namespace) for the excerpt. */
  excerptKey: string;
  categoryId: string;
  readMinutes: number;
  author: string;
  views: number;
  image?: string;
  /** Whether this article appears in the Home KB preview. */
  featured?: boolean;
}

export interface Category {
  id: string;
  /** i18n key (kb namespace) for the label. */
  labelKey: string;
  count: number;
}

export interface Faq {
  id: string;
  /** i18n key (faq namespace) for the question. */
  questionKey: string;
  /** i18n key (faq namespace) for the answer. */
  answerKey: string;
}

export interface Task {
  id: string;
  /** i18n keys (home namespace). */
  labelKey: string;
  descriptionKey: string;
  estimateKey: string;
  /** Locale-relative path (without the /:lang prefix). */
  route: string;
}

export interface Ticket {
  id: string;
  subjectKey: string;
  status: "open" | "pending" | "resolved";
  updated: string;
}
