import { RequestState } from "./RequestState";

export interface RequestResponseDto {
    requestId: string;
    userId: string;
    reviewerId: string;
    rejectionReason: string;
    status: RequestState
}