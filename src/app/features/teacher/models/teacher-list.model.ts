export interface ITeacherListItem {
  teacherID: string;
  teacherName: string;
  teacherImgUrl: string | null;
  title: string | null;
  bio: string | null;
  verifiedStatus: boolean;
  rating: number;
  ratingCount: number;
  totalEnrollments: number;
  totalCourses: number;
  totalContentHours: number;
  joinedAt: string;
  specialties: string[];
}

export interface ITeacherListQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
}
