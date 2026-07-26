import { RequestState } from "./RequestState";

export interface TeachingRequestDto {
    id: string;
    userId: string;
    studentName: string;
    academicTitle: string;
    bio: string;
    specializations: string[];
    highestQualification: string;
    experienceYears: number;
    previousInstitutions?: string;
    previouslyTaughtCourses?: string;
    teachingVideoUrl?: string;
    teachingReason: string;
    phoneNumber: string;
    country: string;
    additionalInfo?: string;
    cvPath?: string;
    createdAt: Date;
    status: RequestState;
    certificates: string[];
    reviewedAt: string;
    reviewerId: string;
    reviewerName: string;
    reviewerEmail: string;
    rejectionReason: string;
}

