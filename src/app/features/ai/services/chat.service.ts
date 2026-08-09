import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IChatRequest } from '../models/chat-request.interface';
import { IChatResponse } from '../models/chat-response.interface';
import { IConversationHistory } from '../models/conversation-history.interface';
import { environment } from '../../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/chatbot`;

  sendMessage(request: IChatRequest): Observable<IChatResponse> {
    return this.http.post<IChatResponse>(this.apiUrl, request);
  }

  getHistory(lessonId: string): Observable<IConversationHistory> {
    return this.http.get<IConversationHistory>(
      `${this.apiUrl}/history/${lessonId}`
    );
  }
}