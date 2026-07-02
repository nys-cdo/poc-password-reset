export interface SecurityQuestion {
  id: string;
  /** i18n key (passwordReset namespace) for the question text. */
  questionKey: string;
}

// Security-question branch of the recovery flow (PRD §13.6). In a real system
// these would be the questions the user previously configured.
export const securityQuestions: SecurityQuestion[] = [
  { id: "first-school", questionKey: "questions.firstSchool" },
  { id: "first-pet", questionKey: "questions.firstPet" },
];
