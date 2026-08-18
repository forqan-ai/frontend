export enum SessionStatus {
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export interface ILiveSession {
  sessionId: string;
  title: string;
  description?: string | null;
  sessionDate: string;
  durationMinutes: number;
  pointsPrice: number;

  platform?: string | null;


  zoomJoinUrl?: string | null;
  zoomMeetingId?: string | null;
  zoomPassword?: string | null;
  zoomStartUrl?: string | null;

  status: SessionStatus;
  circleId: string;
  circleName: string;
  teacherId: string;
  teacherName: string;
  totalBookings: number;
  createdAt: string;
}

export interface ICreateSessionDto {
  title: string;
  description?: string | null;
  sessionDate: string;
  durationMinutes: number;
  pointsPrice: number;
  circleId: string;

  platform?: string | null;
}

export interface IUpdateSessionDto {
  title?: string | null;
  description?: string | null;
  sessionDate?: string | null;
  durationMinutes?: number | null;
  pointsPrice?: number | null;

  platform?: string | null;
}