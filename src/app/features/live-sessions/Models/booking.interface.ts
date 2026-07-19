export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

export interface IBooking {
  bookingId: string;
  status: BookingStatus;
  bookedAt: string;
  pointsCharged: number;
  studentId: string;
  studentName: string;
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
}
