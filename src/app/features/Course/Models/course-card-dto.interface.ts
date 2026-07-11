export interface ICourseCardDto {
    id: number;
    title: string;
    instructor: string;
    category: string;
    rating: number;
    reviewsCount: number;
    price: string;
    imageUrl: string;
    isFavorite?: boolean;
}