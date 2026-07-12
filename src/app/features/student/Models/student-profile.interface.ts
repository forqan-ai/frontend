export interface IStudentProfile {
  id: string;
  fullName: string;
  email: string;
  profileImageURL: string | null;
  knowledgePoints: number;
  knowledgeProgress: number;
  streakCount: number;
  joinedAt: string;
}