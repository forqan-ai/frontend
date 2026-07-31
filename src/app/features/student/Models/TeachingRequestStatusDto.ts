export interface TeachingRequestStatusDto {
    status: RequestStatus;
    rejectionReason: string;
}

export type RequestStatus = 'Pending' | 'Accepted' | 'Refused' | 'notRegistered';
