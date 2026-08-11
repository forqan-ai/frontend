export const CourseLevelArabic: Record<string, string> = {
    Beginner: 'مبتدئ',
    Intermediate: 'متوسط',
    Advanced: 'متقدم',
};

export interface ICourseCardDto {
    courseID: string;
    title: string;
    description: string,
    thumbnailURL: string,
    level: string,
    categoryID: string,
    categoryName: string;
    teacherID: string,
    teacherName: string,
    teacherImgUrl: string,
    durationSeconds: number,
    rating: number,
    reviewsCount: number;
    price: number;
    createdAt: string;
}