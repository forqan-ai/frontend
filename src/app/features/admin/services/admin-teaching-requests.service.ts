import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Service, ɵɵresolveBody } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedTeachingRequestDto } from '../models/PaginatedTeachingRequestDto';
import { environment } from '../../../../environments/environment.development';
import { RequestState } from '../models/RequestState';
import { TeachingRequestDto } from '../models/TeachingRequestDto';
import { RequestResponseDto } from '../models/RequestResponseDto';


@Injectable({
    providedIn: 'root'
})

export class AdminTeachingRequestsService {
    private http = inject(HttpClient);

    private env = environment.apiUrl;
    private baseUrl = `${environment.apiUrl}/api/admin`


    getPaginatedRequests(pageSize: number, pageNumber: number, state: RequestState): Observable<PaginatedTeachingRequestDto> {
        const params = new HttpParams()
            .set('pageSize', pageSize)
            .set('pageNumber', pageNumber)
            .set('state', state);
        return this.http.get<PaginatedTeachingRequestDto>(`${this.baseUrl}/teaching-requests`, { params });
    }

    getRequestDetails(requestId: string): Observable<TeachingRequestDto> {
        const params = new HttpParams()
            .set('requestId', requestId);
        return this.http.get<TeachingRequestDto>(`${this.baseUrl}/teaching-request-details`, { params });
    }

    SetRequestResponse(response: RequestResponseDto): Observable<boolean> {
        return this.http.put<boolean>(`${this.baseUrl}/teaching-request-details`, response);
    }
}
