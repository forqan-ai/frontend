export interface Teacher {

  teacherId: string;

  fullName: string;

  email: string;

  profileImageURL?: string;

  bio?: string;

  rating: number;

  ratingCount: number;

  verifiedStatus: boolean;

  specialties: string[];
}