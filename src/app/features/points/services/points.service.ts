import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { pointPakcage, pointResponse } from '../models/PointPackages';
import { AuthService } from '../../../core/services/auth.service';

@Service()
export class PointsService {
  Url = `${environment.apiUrl}`;
  http = inject(HttpClient);
  auth = inject(AuthService);
  getUserBalance(): Observable<number> {
    let userId = this.auth.getUserId();
    console.log(userId);
    
    return this.http.get<number>(`${this.Url}/api/pointBalance?userId=${userId}`);
  }

  getPointPackages(): Observable<pointPakcage[]> {
    return this.http.get<pointPakcage[]>(`${this.Url}/api/PointPackages`);
  }

  getPointPackage(id:string):Observable<pointResponse>{
    return this.http.get<pointResponse>(`${this.Url}/api/PointPackages/GetPackageById/${id}`)
  }

  AddPointsToUser(points:number,userId:string | null) :Observable<number>{
    return this.http.post<number>(`${this.Url}/api/PointBalance?points=${points}&userId=${userId}`,{});
  }
}
