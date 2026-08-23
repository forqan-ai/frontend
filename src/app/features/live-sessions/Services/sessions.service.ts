import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILiveSession, ICreateSessionDto, IUpdateSessionDto } from '../Models/live-session.interface';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  createSession(dto: ICreateSessionDto): Observable<ILiveSession> {
    return this.http.post<ILiveSession>(`${this.apiUrl}/sessions`, dto);
  }

  getCircleSessions(circleId: string): Observable<ILiveSession[]> {
    return this.http.get<ILiveSession[]>(`${this.apiUrl}/circles/${circleId}/sessions`);
  }

  getSession(sessionId: string): Observable<ILiveSession> {
    return this.http.get<ILiveSession>(`${this.apiUrl}/sessions/${sessionId}`);
  }

  updateSession(sessionId: string, dto: IUpdateSessionDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/sessions/${sessionId}`, dto);
  }

  cancelSession(sessionId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/sessions/${sessionId}/cancel`, {});
  }
}
