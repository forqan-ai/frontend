export interface IEnrollment {
  enrollmentID: string;
  courseID: string;
  courseName: string;
  enrolledAt: string;
  progressPercent: number;
  isCompleted: boolean;
}