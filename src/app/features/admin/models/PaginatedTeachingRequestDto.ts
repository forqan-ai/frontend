import { TeachingRequestCardDto } from "./TeachingRequestCardDto"

export interface PaginatedTeachingRequestDto {
    items: TeachingRequestCardDto[],
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    hasNextPage: boolean
}