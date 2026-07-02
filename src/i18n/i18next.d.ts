import "i18next";
import type enCommon from "./en/common.json";
import type enHome from "./en/home.json";
import type enFaq from "./en/faq.json";
import type enAccessibility from "./en/accessibility.json";
import type enPrivacy from "./en/privacy.json";
import type enArticles from "./en/articles.json";
import type enArticle from "./en/article.json";
import type enKb from "./en/kb.json";
import type enPasswordReset from "./en/passwordReset.json";
import type enTickets from "./en/tickets.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof enCommon;
      home: typeof enHome;
      faq: typeof enFaq;
      accessibility: typeof enAccessibility;
      privacy: typeof enPrivacy;
      articles: typeof enArticles;
      article: typeof enArticle;
      kb: typeof enKb;
      passwordReset: typeof enPasswordReset;
      tickets: typeof enTickets;
    };
  }
}
