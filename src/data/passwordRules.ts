export interface PasswordRule {
  id: string;
  /** i18n key (passwordReset namespace) for the requirement label. */
  labelKey: string;
  test: (password: string) => boolean;
}

// New-password requirements (PRD §13.6). Used both to render the checklist and
// to validate the field before the (mock) submit.
export const passwordRules: PasswordRule[] = [
  { id: "length", labelKey: "rules.length", test: (pw) => pw.length >= 12 },
  { id: "upper", labelKey: "rules.upper", test: (pw) => /[A-Z]/.test(pw) },
  { id: "lower", labelKey: "rules.lower", test: (pw) => /[a-z]/.test(pw) },
  { id: "number", labelKey: "rules.number", test: (pw) => /[0-9]/.test(pw) },
  { id: "special", labelKey: "rules.special", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export function passwordMeetsAllRules(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password));
}
