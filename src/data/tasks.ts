import type { Task } from "./types";

// Home task selector (PRD §13.1). Labels/descriptions/estimates from the
// `home` i18n namespace; routes are locale-relative.
export const tasks: Task[] = [
  {
    id: "reset-password",
    labelKey: "tasks.resetPassword.label",
    descriptionKey: "tasks.resetPassword.description",
    estimateKey: "tasks.resetPassword.estimate",
    route: "resident/password-reset/forgot?method=security",
  },
  {
    id: "recover-account",
    labelKey: "tasks.recoverAccount.label",
    descriptionKey: "tasks.recoverAccount.description",
    estimateKey: "tasks.recoverAccount.estimate",
    route: "resident/password-reset/forgot?method=security",
  },
  {
    id: "something-else",
    labelKey: "tasks.somethingElse.label",
    descriptionKey: "tasks.somethingElse.description",
    estimateKey: "tasks.somethingElse.estimate",
    route: "faq",
  },
];
