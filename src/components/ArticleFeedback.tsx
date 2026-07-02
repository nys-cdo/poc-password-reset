import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NysAlert, NysButton, NysTextarea } from "@nysds/components/react";

/**
 * "Was this article helpful?" feedback (PRD §13.4). Local-only; on submit shows
 * a success alert. Thumb buttons reflect selection via variant.
 */
export function ArticleFeedback() {
  const { t } = useTranslation("article");
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="article-feedback">
        <NysAlert type="success" heading={t("feedback.success")} />
      </div>
    );
  }

  return (
    <form
      className="article-feedback"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <p className="article-feedback__question">{t("feedback.question")}</p>
      <div className="article-feedback__buttons">
        <NysButton
          type="button"
          variant={helpful === true ? "filled" : "outline"}
          prefixIcon="thumb_up"
          label={t("feedback.yes")}
          onClick={() => setHelpful(true)}
        />
        <NysButton
          type="button"
          variant={helpful === false ? "filled" : "outline"}
          prefixIcon="thumb_down"
          label={t("feedback.no")}
          onClick={() => setHelpful(false)}
        />
      </div>
      <NysTextarea
        label={t("feedback.commentLabel")}
        placeholder={t("feedback.commentPlaceholder")}
        optional
      />
      <NysButton type="submit" variant="filled" label={t("feedback.submit")} />
    </form>
  );
}
