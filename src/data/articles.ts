import type { Article } from "./types";

// Knowledge-base fixtures (PRD §13.3/§13.4). Titles/excerpts resolve from the
// `articles` i18n namespace by id; full body content (featured set) lives in the
// `article` i18n namespace under `bodies.<id>`.
export const articles: Article[] = [
  { id: "data-privacy", slug: "protecting-your-data-privacy", titleKey: "data-privacy.title", excerptKey: "data-privacy.excerpt", categoryId: "cybersecurity", readMinutes: 6, author: "NYS ITS", views: 1284, featured: true },
  { id: "webex", slug: "getting-started-with-webex", titleKey: "webex.title", excerptKey: "webex.excerpt", categoryId: "software", readMinutes: 4, author: "NYS ITS", views: 932, featured: true },
  { id: "smartphone-safety", slug: "smartphone-safety-tips", titleKey: "smartphone-safety.title", excerptKey: "smartphone-safety.excerpt", categoryId: "cybersecurity", readMinutes: 5, author: "NYS ITS", views: 1547, featured: true },
  { id: "microsoft-outlook", slug: "microsoft-outlook-basics", titleKey: "microsoft-outlook.title", excerptKey: "microsoft-outlook.excerpt", categoryId: "software", readMinutes: 7, author: "NYS ITS", views: 2103, featured: true },
  { id: "phishing-awareness", slug: "recognizing-phishing-attacks", titleKey: "phishing-awareness.title", excerptKey: "phishing-awareness.excerpt", categoryId: "cybersecurity", readMinutes: 5, author: "NYS ITS", views: 1876 },
  { id: "mfa-setup", slug: "setting-up-multi-factor-authentication", titleKey: "mfa-setup.title", excerptKey: "mfa-setup.excerpt", categoryId: "cybersecurity", readMinutes: 3, author: "NYS ITS", views: 1442 },
  { id: "password-best-practices", slug: "password-best-practices", titleKey: "password-best-practices.title", excerptKey: "password-best-practices.excerpt", categoryId: "cybersecurity", readMinutes: 4, author: "NYS ITS", views: 2210 },
  { id: "teams-basics", slug: "microsoft-teams-basics", titleKey: "teams-basics.title", excerptKey: "teams-basics.excerpt", categoryId: "software", readMinutes: 5, author: "NYS ITS", views: 1105 },
  { id: "onedrive-sharing", slug: "sharing-files-with-onedrive", titleKey: "onedrive-sharing.title", excerptKey: "onedrive-sharing.excerpt", categoryId: "software", readMinutes: 4, author: "NYS ITS", views: 876 },
  { id: "ai-responsible-use", slug: "responsible-use-of-ai", titleKey: "ai-responsible-use.title", excerptKey: "ai-responsible-use.excerpt", categoryId: "ai", readMinutes: 6, author: "NYS ITS", views: 654 },
  { id: "ai-chatbots", slug: "working-with-ai-chatbots", titleKey: "ai-chatbots.title", excerptKey: "ai-chatbots.excerpt", categoryId: "ai", readMinutes: 5, author: "NYS ITS", views: 733 },
  { id: "about-its", slug: "about-nys-its", titleKey: "about-its.title", excerptKey: "about-its.excerpt", categoryId: "its-careers", readMinutes: 3, author: "NYS ITS", views: 512 },
  { id: "careers-at-its", slug: "careers-at-nys-its", titleKey: "careers-at-its.title", excerptKey: "careers-at-its.excerpt", categoryId: "its-careers", readMinutes: 4, author: "NYS ITS", views: 489 },
  { id: "browser-troubleshooting", slug: "browser-troubleshooting", titleKey: "browser-troubleshooting.title", excerptKey: "browser-troubleshooting.excerpt", categoryId: "uncategorized", readMinutes: 5, author: "NYS ITS", views: 998 },
];

export const featuredArticles = articles.filter((a) => a.featured);

export function getArticleBySlug(slug: string | undefined): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
