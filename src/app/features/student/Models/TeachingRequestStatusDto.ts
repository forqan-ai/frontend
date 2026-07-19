export interface TeachingRequestStatusDto {
    status: RequestStatus;
}

export type RequestStatus = 'Pending' | 'Accepted' | 'Refused' | 'not registered';
