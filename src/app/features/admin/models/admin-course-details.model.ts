export interface AdminCourseDetails {
  courseID: string;
  title: string;
  subtitle: string;
  description: string | null;
  thumbnailURL: string | null;
  status: string;
  modules: AdminCourseModule[];
  rejectionReason: string | null;
}
export interface AdminCourseReview {
  courseID: string;
  title: string;
  subtitle: string;
  description: string | null;
  thumbnailURL: string | null;
  status: string;
  modules: AdminCourseModule[];
  rejectionReason: string | null;
}


export interface AdminCourseModule {
  moduleID: string;
  title: string;
  orderIndex: number;
  lessons: AdminCourseLesson[];
}

export interface AdminCourseLesson {
  lessonID: string;
  title: string;
  contentType: string;
  durationSeconds: number;
  orderIndex: number;
}
