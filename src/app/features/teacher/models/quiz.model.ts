export interface QuizModel {
  quizID: string;
  moduleID: string;
  title: string;
  type: number;
  timeLimitMin: number;
  passingScore: number;
}