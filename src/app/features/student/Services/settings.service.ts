import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  IUserSettings,
  UpdateProfileRequest,
  ChangePasswordRequest
} from '../Models/settings.interface';
import { environment } from '../../../../environments/environment.development';


interface UserResponse {

  succeeded: boolean;

  data: IUserSettings;

  errors: any;

}


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl+'/api/users/me';


  user = signal<IUserSettings | null>(null);



  getSettings(): Observable<IUserSettings>{

    return this.http.get<UserResponse>(
      this.apiUrl
    ).pipe(
      map((res) => res.data)
    );

  }



  setUser(user:IUserSettings){

    this.user.set(user);

  }



  updateUser(data:Partial<IUserSettings>){

    const current = this.user();

    if(current){

      this.user.set({
        ...current,
        ...data
      });

    }

  }



  updateProfile(
    data: UpdateProfileRequest
  ): Observable<void>{

    return this.http.put<void>(
      this.apiUrl,
      data
    );

  }



  changePassword(
    data: ChangePasswordRequest
  ): Observable<void>{

    console.log('change password call')
    return this.http.put<void>(
      `${this.apiUrl}/password`,
      data
    );

  }



  updateProfileImage(
    file: File
  ): Observable<void>{

    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    return this.http.put<void>(
      `${this.apiUrl}/profile-picture`,
      formData
    );

  }

}