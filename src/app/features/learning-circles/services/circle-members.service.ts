import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AddCircleMembersRequest,
  AddCircleMembersResponse,
  CircleMember,
  CircleMemberCandidate,
  UpdateCircleMemberRoleRequest,
} from '../models/circle-member.models';
import {
  PagedResult,
  RequiredSearchPaginationQuery,
  SearchPaginationQuery,
} from '../models/pagination.models';

@Injectable({ providedIn: 'root' })
export class CircleMembersService {
  private readonly http = inject(HttpClient);
  private readonly circlesUrl =
    `${environment.apiUrl}/api/learning-circles`;

  getMembers(
    circleId: string,
    query: SearchPaginationQuery,
  ): Observable<PagedResult<CircleMember>> {
    return this.http.get<PagedResult<CircleMember>>(
      this.membersUrl(circleId),
      { params: this.createSearchParams(query) },
    );
  }

  searchCandidates(
    circleId: string,
    query: RequiredSearchPaginationQuery,
  ): Observable<PagedResult<CircleMemberCandidate>> {
    const params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString())
      .set('search', query.search.trim());

    return this.http.get<PagedResult<CircleMemberCandidate>>(
      `${this.membersUrl(circleId)}/candidates`,
      { params },
    );
  }

  addMembers(
    circleId: string,
    request: AddCircleMembersRequest,
  ): Observable<AddCircleMembersResponse> {
    return this.http.post<AddCircleMembersResponse>(
      this.membersUrl(circleId),
      request,
    );
  }

  removeMember(
    circleId: string,
    memberUserId: string,
  ): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.membersUrl(circleId)}/${memberUserId}`,
    );
  }

  updateRole(
    circleId: string,
    memberUserId: string,
    request: UpdateCircleMemberRoleRequest,
  ): Observable<CircleMember> {
    return this.http.put<CircleMember>(
      `${this.membersUrl(circleId)}/${memberUserId}/role`,
      request,
    );
  }

  private membersUrl(circleId: string): string {
    return `${this.circlesUrl}/${circleId}/members`;
  }

  private createSearchParams(
    query: SearchPaginationQuery,
  ): HttpParams {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());

    const search = query.search?.trim();

    if (search) {
      params = params.set('search', search);
    }

    return params;
  }
}
