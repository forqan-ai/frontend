import { CourseDifficulty } from "./CourseDifficulty"
import { CourseRecommendation } from "./CourseRecommendation"

export interface RatingRequestDto {
    userId: string,
    courseId: string,
    teacherId: string,
    courseRating: number,
    teacherRating: number,
    feedback: string,
    recommendation: CourseRecommendation,
    difficulty: CourseDifficulty,
    additionalRecommendations: string
}