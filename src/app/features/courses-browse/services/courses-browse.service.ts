import { inject, injectAsync, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ICoursesQuery } from '../models/courses-query.interface';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Observable } from 'rxjs';
import { IPaginatedResult } from '../models/paginated-result.interface';
import { ICourseListItem } from '../models/course-list-item.interface';
import { ICategory } from '../models/category.interface';
import { ICourseCardDto } from '../../Course/Models/course-card-dto.interface';

@Service()
export class CoursesBrowseService {
  private readonly http = inject(HttpClient);

  private readonly coursesUrl = `${environment.apiUrl}/api/courses`;
  private readonly categoriesUrl = `${environment.apiUrl}/api/categories`;

  getCourses(query: ICoursesQuery): Observable<IPaginatedResult<ICourseCardDto>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    if (query.categoryId) {
      params = params.set('categoryId', query.categoryId);
    }

    return this.http.get<IPaginatedResult<ICourseCardDto>>(
      this.coursesUrl,
      { params },
    );
  }

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(
      this.categoriesUrl,
    );
  }

}
