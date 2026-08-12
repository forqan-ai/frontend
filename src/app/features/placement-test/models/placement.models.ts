export interface PlacementOption {
  optionID: string;
  optionText: string;
}

export interface PlacementQuestion {
  questionID: string;
  text: string;
  categoryID: string;
  categoryName: string;
  options: PlacementOption[];
}

export interface PlacementAnswerDto {
  questionID: string;
  selectedOptionID: string;
}

export interface SubmitPlacementDto {
  answers: PlacementAnswerDto[];
}

export interface CategoryScore {
  categoryID: string;
  categoryName: string;
  scorePct: number;
  level: string;
}

export interface LearningPathCourse {
  order: number;
  courseID: string;
  courseTitle: string;
  categoryName: string;
  thumbnailURL?: string;
}

export interface PlacementResult {
  categoryScores: CategoryScore[];
  learningPath: string;
  suggestedCourses: LearningPathCourse[];
}
