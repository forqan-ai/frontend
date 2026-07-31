export interface QuestionModel {
  questionID: string;

  quizID: string;

  text: string;

  questionType: number;

  feedback?: string;

  orderIndex: number;
}