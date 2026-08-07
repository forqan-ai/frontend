import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IChatRequest } from '../models/chat-request.interface';
import { IChatResponse } from '../models/chat-response.interface';
import { IConversationHistory } from '../models/conversation-history.interface';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7054/api/chatbot';

  sendMessage(request: IChatRequest): Observable<IChatResponse> {
    return this.http.post<IChatResponse>(this.apiUrl, request);
  }

  getHistory(lessonId: string): Observable<IConversationHistory> {
    return this.http.get<IConversationHistory>(
      `${this.apiUrl}/history/${lessonId}`
    );
  }
}