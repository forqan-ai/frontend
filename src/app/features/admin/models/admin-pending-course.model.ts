export interface AdminPendingCourse {
  courseID: string;
  title: string;
  description: string | null;
  thumbnailURL: string | null;
  level: string;
  categoryID: string;
  categoryName: string;
  teacherID: string;
  teacherName: string;
  teacherImgUrl: string | null;
  durationSeconds: number;
}
