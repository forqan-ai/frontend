import { ICourseCardDto } from "../../Course/Models/course-card-dto.interface";

export interface ITeacherDetailsCourse {
    courseID: string;
    title: string;
    description: string | null;
    categoryName: string;
    thumbnailURL: string | null;
    durationSeconds: number;
    rating: number;
    reviewsCount: number;
    price: number;
}

export interface ITeacherDetailsDto {
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
    courses: ICourseCardDto[];
}
