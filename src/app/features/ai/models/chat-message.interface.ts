import { MessageRole } from "../enums/message-role";
import { IReference } from "./reference.interface";
import { ICourseRecommendation } from "./course-recommendation.interface";

export interface IChatMessage {
  role: MessageRole;
  content: string;
  createdAt: string;
  references?: IReference[];
  recommendedCourses?: ICourseRecommendation[];
}