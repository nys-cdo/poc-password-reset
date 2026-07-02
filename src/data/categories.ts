import type { Category } from "./types";
import { articles } from "./articles";

// Category order for the KB sidebar (PRD §13.3). Labels resolve from the `kb`
// i18n namespace; counts are derived from the article fixtures.
const CATEGORY_IDS = ["its-careers", "ai", "cybersecurity", "software", "uncategorized"] as const;

export const categories: Category[] = [
  { id: "all", labelKey: "categories.all", count: articles.length },
  ...CATEGORY_IDS.map((id) => ({
    id,
    labelKey: `categories.${id}`,
    count: articles.filter((a) => a.categoryId === id).length,
  })),
];
