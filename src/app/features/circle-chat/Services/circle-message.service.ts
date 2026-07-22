import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CircleMessage,
  CircleMessagesPage,
  EditMessagePayload,
  OperationResult,
  SendMessagePayload,
} from '../Models/circle-message.model';

@Injectable({ providedIn: 'root' })
export class CircleMessageService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/learning-circles`;

  getMessages(
    circleId: string,
    pageNumber: number = 1,
    pageSize: number = 50
  ): Observable<OperationResult<CircleMessagesPage>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<OperationResult<CircleMessagesPage>>(
      `${this.baseUrl}/${circleId}/messages`,
      { params }
    );
  }

  sendMessage(
    circleId: string,
    payload: SendMessagePayload
  ): Observable<OperationResult<CircleMessage>> {
    return this.http.post<OperationResult<CircleMessage>>(
      `${this.baseUrl}/${circleId}/messages`,
      payload
    );
  }

  editMessage(
    circleId: string,
    messageId: string,
    payload: EditMessagePayload
  ): Observable<OperationResult<CircleMessage>> {
    return this.http.put<OperationResult<CircleMessage>>(
      `${this.baseUrl}/${circleId}/messages/${messageId}`,
      payload
    );
  }

  deleteMessage(
    circleId: string,
    messageId: string
  ): Observable<OperationResult<boolean>> {
    return this.http.delete<OperationResult<boolean>>(
      `${this.baseUrl}/${circleId}/messages/${messageId}`
    );
  }
}
