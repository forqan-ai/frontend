export interface ICertificate {
  certificateId: string;
  courseId: string;
  studentName: string;
  courseTitle: string;
  teacherName: string;
  issuedAt: string;
  verificationCode: string;
  logoUrl?: string;
}