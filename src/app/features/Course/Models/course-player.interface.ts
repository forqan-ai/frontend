export interface ICoursePlayer {
  courseID: string;
  title: string;
  thumbnailURL: string;
  progressPercentage: number;
  modules: ICourseModule[];
}

export interface ICourseModule {
  moduleID: string;
  title: string;
  orderIndex: number;
  lessons: ILesson[];
}

export interface ILesson {
  lessonID: string;

  title: string;

  contentType: 'Video' | 'Audio' | 'Reading';

  contentURL?: string;

  contentHTML?: string;

  durationSeconds: number;

  orderIndex: number;

  isCompleted: boolean;

  watchPercentage: number;
}
