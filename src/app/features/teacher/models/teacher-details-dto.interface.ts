export interface ITeacherDetailsDto {
    teacherID: string;
    teacherName: string;
    teacherImgUrl: string | null;
    title: string;
    bio: string;
    verifiedStatus: boolean;
    rating: number;
    ratingCount: number;
    totalEnrollments: number;
    totalCourses: number;
    totalContentHours: number;
    joinedAt: string;
}
