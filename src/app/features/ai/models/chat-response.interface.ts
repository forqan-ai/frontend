import { ISource } from "./source.interface";
import { ICourseRecommendation } from "./course-recommendation.interface";

export interface IChatResponse {
  conversationId: string;
  answer: string;
  source?: ISource;
  recommendedCourses?: ICourseRecommendation[];
}

