import type { Quiz } from "./quizzes";

export type Mat111InfographyPage = {
  title: string;
  body: string;
};

export type Mat111MobileTopicDefinition = {
  lessonId: string;
  week: number;
  topicTitle: string;
  order: number;
  pages: Mat111InfographyPage[];
};

export type Mat111ExpandedQuiz = Quiz & {
  lessonId: string;
};

export type Mat111MobileExamQuestion = {
  stableId: string;
  questionNumber: string;
  prompt: string;
  modelAnswer: string;
  marks: number;
  order: number;
};

export type Mat111MobileExamPaper = {
  stableId: string;
  courseStableId: string;
  lessonId: string;
  week: number;
  topicTitle: string;
  title: string;
  paperCode: string;
  session: string;
  description: string;
  estimatedTime: string;
  totalMarks: number;
  order: number;
  questions: Mat111MobileExamQuestion[];
};
