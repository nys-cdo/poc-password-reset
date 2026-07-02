import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { NysButton, NysRadiobutton, NysRadiogroup } from "@nysds/components/react";

import { NysCard } from "../ds-custom";
import { tasks } from "../data/tasks";
import { useLocale } from "../i18n/useLocale";

/**
 * Home task selector (PRD §13.1): a tile radio group on an elevated card that
 * sits alongside the hero. Uses native FormData on submit (no per-field state)
 * and routes to the matching flow.
 */
export function TaskSelector() {
  const { t } = useTranslation("home");
  const { localePath } = useLocale();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("task");
    const task = tasks.find((item) => item.id === value);
    if (!task) {
      setShowError(true);
      return;
    }
    setShowError(false);
    navigate(localePath(task.route));
  };

  return (
    <NysCard variant="elevated" className="task-selector">
      <form className="task-selector__form" onSubmit={onSubmit} noValidate>
        <NysRadiogroup
          label={t("taskSelector.legend")}
          tile
          required
          showError={showError}
          errorMessage={t("taskSelector.error")}
        >
          {tasks.map((task) => {
            const description = t(task.descriptionKey as "tasks.resetPassword.description");
            const estimate = t(task.estimateKey as "tasks.resetPassword.estimate");
            return (
              <NysRadiobutton
                key={task.id}
                name="task"
                value={task.id}
                label={t(task.labelKey as "tasks.resetPassword.label")}
                description={estimate ? `${description} · ${estimate}` : description}
              />
            );
          })}
        </NysRadiogroup>

        <div className="task-selector__footer">
          <span className="task-selector__helper">{t("taskSelector.helper")}</span>
          <NysButton
            type="submit"
            variant="filled"
            label={t("taskSelector.continue")}
            suffixIcon="arrow_forward"
          />
        </div>
      </form>
    </NysCard>
  );
}
