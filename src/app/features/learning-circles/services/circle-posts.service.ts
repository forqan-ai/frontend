import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CirclePost,
  CreateCirclePostRequest,
  SetCirclePostPinRequest,
  UpdateCirclePostRequest,
} from '../models/circle-post.models';
import {
  PagedResult,
  PaginationQuery,
} from '../models/pagination.models';

@Injectable({ providedIn: 'root' })
export class CirclePostsService {
  private readonly http = inject(HttpClient);
  private readonly circlesUrl =
    `${environment.apiUrl}/api/learning-circles`;

  getPosts(
    circleId: string,
    query: PaginationQuery,
  ): Observable<PagedResult<CirclePost>> {
    const params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());

    return this.http.get<PagedResult<CirclePost>>(
      this.postsUrl(circleId),
      { params },
    );
  }

  getPost(
    circleId: string,
    postId: string,
  ): Observable<CirclePost> {
    return this.http.get<CirclePost>(
      `${this.postsUrl(circleId)}/${postId}`,
    );
  }

  createPost(
    circleId: string,
    request: CreateCirclePostRequest,
  ): Observable<CirclePost> {
    const formData = new FormData();

    formData.append('content', request.content);

    if (request.image) {
      formData.append('image', request.image);
    }

    return this.http.post<CirclePost>(
      this.postsUrl(circleId),
      formData,
    );
  }

  updatePost(
    circleId: string,
    postId: string,
    request: UpdateCirclePostRequest,
  ): Observable<CirclePost> {
    return this.http.put<CirclePost>(
      `${this.postsUrl(circleId)}/${postId}`,
      request,
    );
  }

  deletePost(
    circleId: string,
    postId: string,
  ): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.postsUrl(circleId)}/${postId}`,
    );
  }

  setPin(
    circleId: string,
    postId: string,
    request: SetCirclePostPinRequest,
  ): Observable<CirclePost> {
    return this.http.put<CirclePost>(
      `${this.postsUrl(circleId)}/${postId}/pin`,
      request,
    );
  }

  private postsUrl(circleId: string): string {
    return `${this.circlesUrl}/${circleId}/posts`;
  }
}
