export const QUIZ_SUBMISSION_ID_MAX_LENGTH = 128;

export type AuthoritativeQuizQuestionRecord = {
  stableId: string;
  prompt: string;
  choices: readonly string[];
  answerIndex: number;
  explanation: string;
  order: number;
};

export type QuizQuestionResult = {
  questionId: string;
  answerIndex: number;
  explanation: string;
  correct: boolean;
};

export function isStructuredQuizQuestion(question: Pick<AuthoritativeQuizQuestionRecord, "choices">) {
  return question.choices.length === 0;
}

export function toLearnerQuizQuestionPayload(question: AuthoritativeQuizQuestionRecord) {
  return {
    stableId: question.stableId,
    prompt: question.prompt,
    choices: [...question.choices],
    questionType: isStructuredQuizQuestion(question) ? ("structured" as const) : ("mcq" as const),
    order: question.order,
  };
}

export function normalizeQuizSubmissionId(value: string) {
  const submissionId = value.trim();

  if (!submissionId) {
    throw new Error("Quiz submission ID is required.");
  }

  if (submissionId.length > QUIZ_SUBMISSION_ID_MAX_LENGTH) {
    throw new Error(`Quiz submission ID must be at most ${QUIZ_SUBMISSION_ID_MAX_LENGTH} characters.`);
  }

  return submissionId;
}

export function validateQuizAnswer(question: AuthoritativeQuizQuestionRecord, answer: number) {
  if (!Number.isInteger(answer)) {
    throw new Error(`Quiz answer for ${question.stableId} must be an integer.`);
  }

  if (isStructuredQuizQuestion(question)) {
    if (answer !== -1) {
      throw new Error(`Structured quiz question ${question.stableId} does not accept an MCQ answer index.`);
    }
    return -1;
  }

  if (answer < -1 || answer >= question.choices.length) {
    throw new Error(`Quiz answer for ${question.stableId} is out of range.`);
  }

  return answer;
}

export function revealStructuredQuizAnswer(question: AuthoritativeQuizQuestionRecord) {
  if (!isStructuredQuizQuestion(question)) {
    throw new Error("This quiz question is multiple choice and does not have a revealable model answer.");
  }

  const modelAnswer = question.explanation.trim();
  if (!modelAnswer) {
    throw new Error("A model answer has not been published for this structured question.");
  }

  return {
    questionId: question.stableId,
    modelAnswer,
  };
}

export function gradeQuizAnswers(questions: readonly AuthoritativeQuizQuestionRecord[], answers: readonly number[]) {
  if (questions.length === 0) {
    throw new Error("Quiz has no questions and cannot be submitted.");
  }

  if (answers.length !== questions.length) {
    throw new Error(`Expected ${questions.length} quiz answers but received ${answers.length}.`);
  }

  const normalizedAnswers = questions.map((question, index) => validateQuizAnswer(question, answers[index]));
  const gradableQuestions = questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => !isStructuredQuizQuestion(question));

  const score = gradableQuestions.reduce(
    (total, { question, index }) => total + (normalizedAnswers[index] === question.answerIndex ? 1 : 0),
    0,
  );
  const totalQuestions = gradableQuestions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const questionResults: QuizQuestionResult[] = gradableQuestions.map(({ question, index }) => ({
    questionId: question.stableId,
    answerIndex: question.answerIndex,
    explanation: question.explanation,
    correct: normalizedAnswers[index] === question.answerIndex,
  }));

  return {
    answers: normalizedAnswers,
    score,
    totalQuestions,
    percentage,
    questionResults,
  };
}

export function quizAnswersMatch(left: readonly number[], right: readonly number[]) {
  return left.length === right.length && left.every((answer, index) => answer === right[index]);
}
