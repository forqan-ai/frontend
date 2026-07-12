import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategoryProgress } from '../Models/category-progress.interface';
import { IRecentActivity } from '../Models/recent-activity.interface';
import { IStudentCourse } from '../Models/student-course.interface';
import { IStudentProfile } from '../Models/student-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7054/api/users/student';



  getStudentProfile(): Observable<IStudentProfile> {

    return this.http.get<IStudentProfile>(
      `${this.apiUrl}/profile`
    );

  }



  getCourses(): Observable<IStudentCourse[]> {

    return this.http.get<IStudentCourse[]>(
      `${this.apiUrl}/courses`
    );

  }



  getCategories(): Observable<ICategoryProgress[]> {

    return this.http.get<ICategoryProgress[]>(
      `${this.apiUrl}/categories-progress`
    );

  }



  getActivities(): Observable<IRecentActivity[]> {

    return this.http.get<IRecentActivity[]>(
      `${this.apiUrl}/activities`
    );

  }

}