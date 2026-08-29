import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RatingRequestDto } from '../models/RatingRequestDto';

@Injectable({
    providedIn: 'root'
})
export class RatingService {

    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/api/ratings`;

    SubmitRating(dto: RatingRequestDto): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/add`, dto);
    }
}
