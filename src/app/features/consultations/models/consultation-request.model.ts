export interface CreateConsultationRequest {
  teacherId: string;
  requestText: string;
}

export interface CreatedConsultation {
  consultationId: string;
}
