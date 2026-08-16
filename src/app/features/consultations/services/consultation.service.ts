import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateConsultationRequest,
  CreatedConsultation,
} from '../models/consultation-request.model';
import {
  AcceptConsultationRequest,
  CancelConsultationRequest,
  ConsultationDetails,
  ConsultationListItem,
  ConsultationListQuery,
  ConsultationPage,
  ConsultationProposalRequest,
  RejectConsultationRequest,
  SetMeetingLinkRequest,
} from '../models/consultation.models';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/api/consultations`;

  createConsultation(request: CreateConsultationRequest): Observable<CreatedConsultation> {
    return this.http.post<CreatedConsultation>(this.api, request);
  }

  getConsultations(
    query: ConsultationListQuery,
  ): Observable<ConsultationPage<ConsultationListItem>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize);

    if (query.status) {
      params = params.set('status', query.status);
    }

    return this.http.get<ConsultationPage<ConsultationListItem>>(this.api, { params });
  }

  getConsultationById(id: string): Observable<ConsultationDetails> {
    return this.http.get<ConsultationDetails>(`${this.api}/${id}`);
  }

  acceptConsultation(
    id: string,
    request: AcceptConsultationRequest,
  ): Observable<ConsultationDetails> {
    return this.http.post<ConsultationDetails>(`${this.api}/${id}/accept`, request);
  }

  updateProposal(id: string, request: ConsultationProposalRequest): Observable<ConsultationDetails> {
    return this.http.put<ConsultationDetails>(`${this.api}/${id}/proposal`, request);
  }

  setMeetingLink(id: string, request: SetMeetingLinkRequest): Observable<ConsultationDetails> {
    return this.http.patch<ConsultationDetails>(`${this.api}/${id}/meeting-link`, request);
  }

  rejectConsultation(id: string, request: RejectConsultationRequest): Observable<ConsultationDetails> {
    return this.http.post<ConsultationDetails>(`${this.api}/${id}/reject`, request);
  }

  completeConsultation(id: string): Observable<ConsultationDetails> {
    return this.http.post<ConsultationDetails>(`${this.api}/${id}/complete`, null);
  }

  cancelConsultation(id: string, request: CancelConsultationRequest): Observable<ConsultationDetails> {
    return this.http.post<ConsultationDetails>(`${this.api}/${id}/cancel`, request);
  }
}
