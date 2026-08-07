export interface CourseBuilderDto {
  courseID: string;
  title: string;
  subtitle: string;
  description: string | null;
  thumbnailURL: string | null;
  status: string;
  modules: ModuleBuilderDto[];
  rejectionReason: string | null;
}

export interface ModuleBuilderDto {
  moduleID: string;
  title: string;
  orderIndex: number;
  lessons: LessonBuilderDto[];
}

export interface LessonBuilderDto {
  lessonID: string;
  title: string;
  contentType: string;
  durationSeconds: number;
  orderIndex: number;
}
