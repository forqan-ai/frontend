export type CourseLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced';

export interface ICourseListItem {
  courseID: string;
  title: string;
  description: string | null;
  thumbnailURL: string| null;
  level: CourseLevel;
  categoryID: string;
  categoryName: string;
  teacherID: string;
  teacherName: string;
  teacherImgUrl: string | null;
  durationSeconds: number;
}
