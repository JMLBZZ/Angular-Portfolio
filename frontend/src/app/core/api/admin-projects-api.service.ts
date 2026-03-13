import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from './api.config';
import {
  AdminApiResult,
  AdminProject,
  AdminProjectPayload,
} from '../auth/auth.models';
import { normalizeProject } from './project-normalizer';

@Injectable({ providedIn: 'root' })
export class AdminProjectsApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdminApiResult<AdminProject[]>> {
    return this.http
      .get<AdminApiResult<AdminProject[]>>(`${this.baseUrl}/api/admin/projects`)
      .pipe(
        map((response) => ({
          ...response,
          data: response.data.map((project) => normalizeProject(project)),
        }))
      );
  }

  getById(id: string): Observable<AdminProject> {
    return this.http
      .get<AdminProject>(`${this.baseUrl}/api/admin/projects/${id}`)
      .pipe(map((project) => normalizeProject(project)));
  }

  create(payload: AdminProjectPayload): Observable<AdminProject> {
    return this.http
      .post<AdminProject>(`${this.baseUrl}/api/admin/projects`, payload)
      .pipe(map((project) => normalizeProject(project)));
  }

  update(id: string, payload: AdminProjectPayload): Observable<AdminProject> {
    return this.http
      .put<AdminProject>(`${this.baseUrl}/api/admin/projects/${id}`, payload)
      .pipe(map((project) => normalizeProject(project)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/admin/projects/${id}`);
  }
}