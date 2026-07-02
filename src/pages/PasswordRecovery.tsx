import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  NysAlert,
  NysButton,
  NysIcon,
  NysTextinput,
} from "@nysds/components/react";

import { QuickActions } from "../components/QuickActions";
import { securityQuestions } from "../data/securityQuestions";
import { passwordRules, passwordMeetsAllRules } from "../data/passwordRules";
import { useLocale } from "../i18n/useLocale";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

interface Values {
  email: string;
  answers: Record<string, string>;
  newPassword: string;
  confirmPassword: string;
}

const INITIAL: Values = { email: "", answers: {}, newPassword: "", confirmPassword: "" };

/**
 * Password recovery (security-question branch, PRD §13.6) — the POC centerpiece.
 * A 3-step flow (email → verify → reset) rendered as sequential forms in a
 * centered content column, with a Quick Actions rail on the side. No visual
 * stepper: the centered intro plus per-step headings carry wayfinding. Each
 * step reads native FormData on submit; values persist in state so navigating
 * back/forward re-populates fields (remounting on "start over" clears them).
 */
export function PasswordRecovery() {
  const { t } = useTranslation(["passwordReset", "common"]);
  const { localePath } = useLocale();

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const goToStep = (n: number) => {
    setErrors({});
    setStep(n);
  };

  const onSubmitEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setValues((v) => ({ ...v, email }));
    if (!email) return setErrors({ email: t("step1.required") });
    if (!EMAIL_RE.test(email)) return setErrors({ email: t("step1.invalid") });
    goToStep(2);
  };

  const onSubmitVerify = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const answers: Record<string, string> = {};
    const errs: Record<string, string> = {};
    securityQuestions.forEach((q) => {
      const answer = String(data.get(`answer-${q.id}`) ?? "").trim();
      answers[q.id] = answer;
      if (!answer) errs[`answer-${q.id}`] = t("step2.required");
    });
    setValues((v) => ({ ...v, answers }));
    if (Object.keys(errs).length) return setErrors(errs);
    goToStep(3);
  };

  const onSubmitReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    setValues((v) => ({ ...v, newPassword, confirmPassword }));
    const errs: Record<string, string> = {};
    if (!passwordMeetsAllRules(newPassword)) errs.newPassword = t("step3.weak");
    if (newPassword && newPassword !== confirmPassword) errs.confirmPassword = t("step3.mismatch");
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setSubmitted(true);
  };

  const startOver = () => {
    setSubmitted(false);
    setValues(INITIAL);
    setErrors({});
    setStep(1);
  };

  // Back returns to the previous step, or leaves the flow (home) from step 1.
  const backButton =
    step > 1 ? (
      <NysButton
        type="button"
        variant="outline"
        label={t("actions.back")}
        onClick={() => goToStep(step - 1)}
      />
    ) : (
      <NysButton variant="outline" label={t("actions.back")} href={localePath("")} />
    );

  return (
    <div className="nys-grid-container content-page recovery-page">
      <header className="recovery-header">
        <h1 className="page-header__title">{t("heading")}</h1>
        <p className="page-header__lead">{t("description")}</p>
      </header>

      <div className="nys-grid-row nys-grid-gap-500 recovery-body">
        <div className="nys-grid-col-12 nys-desktop:nys-grid-offset-3 nys-desktop:nys-grid-col-6 recovery-main">
          {submitted ? (
            <div className="step-form">
              <NysAlert type="success" heading={t("step3.success.heading")}>
                {t("step3.success.body")}
              </NysAlert>
              <div className="step-actions">
                <NysButton
                  type="button"
                  variant="outline"
                  label={t("actions.startOver")}
                  onClick={startOver}
                />
                <NysButton
                  variant="filled"
                  label={t("common:nav.home")}
                  href={localePath("")}
                />
              </div>
            </div>
          ) : step === 1 ? (
            <form className="step-form" onSubmit={onSubmitEmail} noValidate>
              <div className="step-fields">
                <NysTextinput
                  type="email"
                  name="email"
                  label={t("step1.emailLabel")}
                  placeholder={t("step1.emailPlaceholder")}
                  required
                  value={values.email}
                  showError={!!errors.email}
                  errorMessage={errors.email}
                />
              </div>
              <div className="step-actions">
                {backButton}
                <NysButton type="submit" variant="filled" label={t("actions.continue")} />
              </div>
            </form>
          ) : step === 2 ? (
            <form className="step-form" onSubmit={onSubmitVerify} noValidate>
              <h2 className="step-form__heading">{t("step2.heading")}</h2>
              <p className="step-form__desc">{t("step2.description")}</p>
              <div className="step-fields">
                {securityQuestions.map((q) => (
                  <NysTextinput
                    key={q.id}
                    name={`answer-${q.id}`}
                    label={t(`questions.${q.id === "first-school" ? "firstSchool" : "firstPet"}` as "questions.firstSchool")}
                    required
                    value={values.answers[q.id] ?? ""}
                    showError={!!errors[`answer-${q.id}`]}
                    errorMessage={errors[`answer-${q.id}`]}
                  />
                ))}
              </div>
              <div className="step-actions">
                {backButton}
                <NysButton type="submit" variant="filled" label={t("actions.continue")} />
              </div>
            </form>
          ) : (
            <form className="step-form" onSubmit={onSubmitReset} noValidate>
              <h2 className="step-form__heading">{t("step3.heading")}</h2>
              <p className="step-form__desc">{t("step3.description")}</p>
              <div className="step-fields">
                <NysTextinput
                  type="password"
                  name="newPassword"
                  label={t("step3.newLabel")}
                  required
                  value={values.newPassword}
                  showError={!!errors.newPassword}
                  errorMessage={errors.newPassword}
                  onNysInput={(event) => {
                    if (event instanceof CustomEvent)
                      setValues((v) => ({ ...v, newPassword: event.detail.value as string }));
                  }}
                />
                <div className="password-rules" aria-live="polite">
                  <p className="password-rules__title">{t("step3.requirements")}</p>
                  <ul className="password-rules__list">
                    {passwordRules.map((rule) => {
                      const ok = rule.test(values.newPassword);
                      return (
                        <li
                          key={rule.id}
                          className={`password-rule${ok ? " password-rule--ok" : ""}`}
                        >
                          <NysIcon name={ok ? "check_circle" : "cancel"} size="16" />
                          {t(rule.labelKey as "rules.length")}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <NysTextinput
                  type="password"
                  name="confirmPassword"
                  label={t("step3.confirmLabel")}
                  required
                  value={values.confirmPassword}
                  showError={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword}
                  onNysInput={(event) => {
                    if (event instanceof CustomEvent)
                      setValues((v) => ({ ...v, confirmPassword: event.detail.value as string }));
                  }}
                />
              </div>
              <div className="step-actions">
                {backButton}
                <NysButton type="submit" variant="filled" label={t("actions.submit")} />
              </div>
            </form>
          )}
        </div>

        <div className="nys-grid-col-12 nys-desktop:nys-grid-col-3 recovery-aside">
          <QuickActions
            heading={t("quickActions.heading")}
            items={[
              { icon: "help", label: t("quickActions.recovery"), to: localePath("faq") },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
