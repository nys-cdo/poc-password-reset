import type { Faq } from "./types";

// FAQ page (PRD §13.2). Q/A resolve from the `faq` i18n namespace by id.
export const faqs: Faq[] = [
  { id: "what-is-govarc", questionKey: "items.whatIsGovArc.q", answerKey: "items.whatIsGovArc.a" },
  { id: "reset-password", questionKey: "items.resetPassword.q", answerKey: "items.resetPassword.a" },
  { id: "enroll-mfa", questionKey: "items.enrollMfa.q", answerKey: "items.enrollMfa.a" },
  { id: "account-locked", questionKey: "items.accountLocked.q", answerKey: "items.accountLocked.a" },
  { id: "supported-browsers", questionKey: "items.supportedBrowsers.q", answerKey: "items.supportedBrowsers.a" },
  { id: "is-accessible", questionKey: "items.isAccessible.q", answerKey: "items.isAccessible.a" },
  { id: "data-protection", questionKey: "items.dataProtection.q", answerKey: "items.dataProtection.a" },
  { id: "contact-support", questionKey: "items.contactSupport.q", answerKey: "items.contactSupport.a" },
];
