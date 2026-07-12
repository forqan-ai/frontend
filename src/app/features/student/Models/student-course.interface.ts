export interface IStudentCourse {
  courseID: string;
  title: string;
  thumbnailURL: string | null;
  progressPercent: number;
  isCompleted: boolean;
}